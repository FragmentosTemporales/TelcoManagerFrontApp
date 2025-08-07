import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    MenuItem,
    Modal,
    InputLabel,
    Select,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    TableHead,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
    getLogQueryTimeTotal,
    getTopLogQuery,
    getLogQueryTimeTotalByEndpoint,
    getLogQuerySemanal
} from "../api/query_logs_api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import { extractDateOnly } from "../helpers/main";

function LogQueryStats() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [logsDataTime, setLogsDataTime] = useState([]);
    const [logsDataSemanal, setLogsDataSemanal] = useState([]);
    const [logsDataTop, setLogsDataTop] = useState([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState("");
    const [logDataEndpoint, setLogDataEndpoint] = useState([]);
    const [dataMethod, setDataMethod] = useState([]);
    const [isSubmittingSemanal, setIsSubmittingSemanal] = useState(true);
    const [isSubmittingTime, setIsSubmittingTime] = useState(true);
    const [isSubmittingTop, setIsSubmittingTop] = useState(true);
    const [isSubmittingEndpoint, setIsSubmittingEndpoint] = useState(true);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchLogQuerySemanal();
            await fetchQueryLogsTime();
            await fetchTopLogQuery();
        })();
    }, []);

    useEffect(() => {
        if (selectedEndpoint) {
            fetchLogQueryTimeByEndpoint(selectedEndpoint);
        } else {
            setLogDataEndpoint([]);
        }
    }, [selectedEndpoint]);

    const fetchQueryLogsTime = async () => {
        setIsSubmittingTime(true);
        try {
            const data = await getLogQueryTimeTotal(token);
            setLogsDataTime(data);
        } catch (error) {
            console.error("Error fetching log query time data:", error);
        }
        setIsSubmittingTime(false);
    }

    const fetchLogQuerySemanal = async () => {
        setIsSubmittingSemanal(true);
        try {
            const res = await getLogQuerySemanal(token);
            setLogsDataSemanal(res.data);
            setDataMethod(res.data_method);
            console.log("Data Method:", res.data_method);
        } catch (error) {
            console.error("Error fetching log query semanal data:", error);
        }
        setIsSubmittingSemanal(false);
    }

    const fetchLogQueryTimeByEndpoint = async (endpoint) => {
        setIsSubmittingEndpoint(true);
        try {
            const data = await getLogQueryTimeTotalByEndpoint(token, endpoint);
            setLogDataEndpoint(data);
        } catch (error) {
            console.error("Error fetching log query time by endpoint data:", error);
        }
        setIsSubmittingEndpoint(false);
    }

    const fetchTopLogQuery = async () => {
        setIsSubmittingTop(true);
        try {
            const data = await getTopLogQuery(token);
            setLogsDataTop(data);
            if (data[0]) {
                setSelectedEndpoint(data[0].endpoint);
            }
        } catch (error) {
            console.error("Error fetching top log query data:", error);
        }
        setIsSubmittingTop(false);
    };

    const lineChartData = () => (
        <LineChart
            height={250}
            grid={{ vertical: true, horizontal: true }}
            yAxis={[{
                width: 100,
                colorMap: {
                    type: 'piecewise',
                    thresholds: [0, 3500],
                    colors: ['blue', 'green', 'red'],
                }
            }]}
            xAxis={[
                {
                    data: logsDataSemanal.map((item) => extractDateOnly(item.fecha)),
                    scaleType: 'point'
                }
            ]}
            series={[
                {
                    data: logsDataSemanal.map((item) => item.total),
                    label: 'Total de consultas por día :',
                    color: 'green',
                    curve: "linear",
                }
            ]}
            margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
        />
    )

    const pieChartData = () => {
        // Preparar datos para el pie chart con porcentajes
        const totalTicketsExcludingFinalized = dataMethod.reduce((acc, item) => acc + item.total, 0);

        // Colores que complementan el verde usado en los otros gráficos
        const colors = ['#2e7d32', '#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'];

        const pieData = dataMethod.map((item, index) => ({
            id: index,
            value: item.total,
            label: `${item.method} (${((item.total / totalTicketsExcludingFinalized) * 100).toFixed(1)}%)`,
            estado: item.method,
            color: colors[index % colors.length]
        }));

        return (
            <PieChart
                series={[
                    {
                        data: pieData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: '#e0e0e0' },
                        innerRadius: 30,
                        outerRadius: 70,
                    },
                ]}
                height={250}
            />
        );
    }

    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    paddingY: "60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    minHeight: "90vh",
                }}
            >
                {!isSubmittingSemanal && logsDataSemanal && logsDataSemanal.length > 0 ? (
                    <Box sx={{
                        width: "90%",
                        marginY: 1,
                        backgroundColor: "#fff",
                        borderRadius: 0,
                        boxShadow: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <Typography variant="h6" sx={{ padding: 1, textAlign: "center" }}>
                            Semanal de Consultas
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            flexDirection: { lg: "row", xs: "column" }
                        }}>
                            <Box sx={{
                                width: { lg: "20%", xs: "100%" },
                                height: { lg: "100%", xs: "250px" },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {pieChartData()}
                            </Box>
                            <Box sx={{
                                width: { lg: "80%", xs: "100%" },
                                height: { lg: "100%", xs: "250px" },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {lineChartData()}
                            </Box>
                        </Box>
                    </Box>
                ) : (!isSubmittingSemanal && logsDataSemanal && logsDataSemanal.length === 0) ? (
                    <Box sx={{ width: "90%", paddingY: 3, textAlign: "center", backgroundColor: "#fff" }}>
                        <Typography variant="h6" color="textSecondary">
                            No hay datos disponibles para mostrar.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: "90%", textAlign: "center", backgroundColor: "#fff" }}>
                        <Skeleton variant="rectangular" width="100%" height={250} />
                    </Box>
                )}

                <Box sx={{ width: "90%", marginY: 1, display: "flex", flexDirection: { lg: "row", xs: "column" } }}>
                    {!isSubmittingTop && logsDataTop && logsDataTop.length > 0 ? (
                        <Box sx={{
                            width: { lg: "25%", xs: "100%" },
                            backgroundColor: "#fff",
                            borderRadius: 0,
                            marginRight: { lg: 2, xs: 0 },
                            boxShadow: 2
                        }}>
                            <Typography variant="h6" sx={{
                                padding: 1,
                                textAlign: "center",
                                fontWeight: "bold",
                                backgroundColor: "#0b2f6d",
                                color: "white",
                            }}>
                                Top 10 Endpoints
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {[
                                                "CONSULTA",
                                                "TOTAL"
                                            ].map((header) => (
                                                <TableCell
                                                    key={header}
                                                    align="left"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        backgroundColor: "#0b2f6d",
                                                        color: "white",
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: "12px" }}>{header}</Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logsDataTop.map((log) => (
                                            <TableRow key={log.id} onClick={() => setSelectedEndpoint(log.endpoint)} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                                <TableCell align="left" sx={{ fontSize: "12px" }}>{log.endpoint}</TableCell>
                                                <TableCell align="left" sx={{ fontSize: "12px" }}>{log.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>) : (<Box sx={{ width: { lg: "25%", xs: "100%" }, textAlign: "center", backgroundColor: "#fff" }}>
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        </Box>)}


                    <Box sx={{
                        width: { lg: "75%", xs: "100%" },
                        height: "100%",
                        backgroundColor: "#fff",
                        borderRadius: 0,
                    }}>

                        {!isSubmittingTime && logsDataTime && logsDataTime.length > 0 ? (
                            <Box sx={{ marginY: 1, height: "50%" }}>
                                <Typography variant="h6" sx={{ padding: 1, textAlign: "center" }}>
                                    Diario de Consultas
                                </Typography>
                                <LineChart
                                    height={250}
                                    grid={{ vertical: true, horizontal: true }}
                                    yAxis={[{
                                        width: 100,
                                        colorMap: {
                                            type: 'piecewise',
                                            thresholds: [0, 500],
                                            colors: ['blue', 'green', 'red'],
                                        }
                                    }]}
                                    xAxis={[
                                        {
                                            data: logsDataTime.map((item) => item.intervalo),
                                            scaleType: 'point'
                                        }
                                    ]}
                                    series={[
                                        {
                                            data: logsDataTime.map((item) => item.total),
                                            label: 'Total de consultas por intervalo :',
                                            color: 'green',
                                            curve: "linear",
                                        }
                                    ]}
                                    margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
                                />
                            </Box>
                        ) : (!isSubmittingTime && logsDataTime && logsDataTime.length === 0) ? (
                            <Box sx={{ width: "100%", textAlign: "center" }}>
                                <Typography variant="h6" color="textSecondary">
                                    No hay datos disponibles para mostrar.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ width: "100%", textAlign: "center", backgroundColor: "#fff" }}>
                                <Skeleton variant="rectangular" width="100%" height={250} />
                            </Box>
                        )}
                        <Divider />
                        {!isSubmittingEndpoint && logDataEndpoint && logDataEndpoint.length > 0 ? (
                            <Box sx={{ marginY: 1, height: "50%" }}>
                                <Typography variant="h6" sx={{ padding: 1, textAlign: "center" }}>
                                    {selectedEndpoint ? selectedEndpoint : "Diario de Consultas por Endpoint"}
                                </Typography>
                                <LineChart
                                    height={250}
                                    grid={{ vertical: true, horizontal: true }}
                                    yAxis={[{
                                        width: 100,
                                        colorMap: {
                                            type: 'piecewise',
                                            thresholds: [0, 500],
                                            colors: ['blue', 'green', 'red'],
                                        }
                                    }]}
                                    xAxis={[
                                        {
                                            data: logDataEndpoint.map((item) => item.intervalo),
                                            scaleType: 'point'
                                        }
                                    ]}
                                    series={[
                                        {
                                            data: logDataEndpoint.map((item) => item.total),
                                            label: 'Total de consultas por intervalo :',
                                            color: 'green',
                                            curve: "linear",
                                        }
                                    ]}
                                    margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
                                />
                            </Box>
                        ) : (!isSubmittingEndpoint && logDataEndpoint && logDataEndpoint.length === 0) ? (
                            <Box sx={{ width: "100%", textAlign: "center" }}>
                                <Typography variant="h6" color="textSecondary">
                                    No hay datos disponibles para mostrar.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ width: "100%", textAlign: "center", backgroundColor: "#fff" }}>
                                <Skeleton variant="rectangular" width="100%" height={250} />
                            </Box>
                        )}


                    </Box>
                </Box>
            </Box>
        </MainLayout>
    );
}

export default LogQueryStats;

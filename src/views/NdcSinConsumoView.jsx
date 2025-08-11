import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    MenuItem,
    Select,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { useEffect, useState } from "react";
import { fetchPendientesSinConsumo, updateOrdenSinConsumo, fetchPendientesStats } from "../api/logisticaAPI";
import { extractDateOnly } from "../helpers/main";

function NDCSinConsumoUpdate() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);
    const [tipo, setTipo] = useState('todos');
    const tipoOptions = [
        { value: 'todos', label: 'Todos' },
        { value: 'alta', label: 'Alta' },
        { value: 'Migración', label: 'Migración' },
        { value: 'Modificación de Servicio', label: 'Modificación de Servicio' },
        { value: 'Reparación', label: 'Reparación' },
        { value: 'Upgrade promoción', label: 'Upgrade promoción' },
    ];
    const [statsEstado, setStatsEstado] = useState(null);
    const [statsTipo, setStatsTipo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPendientesStats(token);
                setStatsEstado(response.estado);
                setStatsTipo(response.tipo);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchData();
    }, [token]);

    const estadoOptions = [{
        value: 'Pendiente',
        label: 'Pendiente'
    },
    {
        value: 'SI',
        label: 'Aprobado'
    },
    {
        value: 'NO',
        label: 'Rechazado'
    }];

    const pieEstado = () => (
        <Box
            sx={{ 
                width: "90%",
                padding: 2,
                backgroundColor: "white",
                borderRadius: 2,
                border: "2px solid #dfdeda",
                display: "flex",
                flexDirection: {lg: "row", xs: "column"},
                marginBottom: 2
            }}
        >
            <Box sx={{ width: {lg: "40%", xs: "100%"}, display: "flex", flexDirection: "column"}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, width: "100%", textAlign: "left", paddingLeft: 2 }}>
                    Estado de las Órdenes
                </Typography>
                <PieChart
                    series={[
                        {
                            data: statsEstado.map((item) => ({
                                id: item.estado,
                                value: item.Q,
                                label: item.estado === 'Pendiente' ? 'Pendiente' : item.estado === 'SI' ? 'Aprobado' : 'Rechazado',
                                color: item.estado === 'Pendiente' ? '#ff9800' : item.estado === 'SI' ? '#4caf50' : '#f44336'
                            })),
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            innerRadius: 30,
                            outerRadius: 70,
                        },
                    ]}
                    height={150}
                />
            </Box>
            <Box sx={{ width: {lg: "60%", xs: "100%"}, display: "flex", flexDirection: "column"}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, width: "100%", textAlign: "left", paddingLeft: 2 }}>
                    Tipo de  Órdenes
                </Typography>
                <BarChart
                    xAxis={[{
                        scaleType: 'band',
                        data: statsTipo.map((item) => item.tipo),
                    }]}
                    grid={{ vertical: true, horizontal: true }}
                    series={[{
                        data: statsTipo.map((item) => item.Q),
                        color: '#142a3d',
                    }]}
                    height={150}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    onAxisClick={(event, d) => {
                        if (d && d.axisValue) {
                            setTipo(d.axisValue);
                        }
                    }}
                    sx={{ cursor: 'pointer' }}
                />
            </Box>
        </Box>
    )


    const handleSaveChanges = async (e, id) => {
        e.preventDefault();
        const newEstado = e.target.value;

        const previousData = [...data];

        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, estado: newEstado } : item
            )
        );

        try {
            const payload = { id: id, estado: newEstado };
            await updateOrdenSinConsumo(token, payload);

            setMessage("Actualizado correctamente");
            setAlertType("success");
            setOpen(true);

        } catch (error) {
            setData(previousData);
            setMessage("Error al actualizar. Por favor, inténtelo nuevamente.");
            setAlertType("error");
            setOpen(true);
        }
    };


    const tablependientes = () => (
        //crea una tabla con los datos de pendientes sin consumo
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1, backgroundColor: "#142a3d" }}>
                <Typography
                    sx={{
                        backgroundColor: "#142a3d",
                        color: "white",
                        padding: 1,
                        fontStyle: "italic",
                        fontSize: "12px",
                    }}
                    align="center"
                >
                    Total de Órdenes: {total}
                </Typography>

            </Box>
            <TableContainer>
                <Table>
                    <TableRow>
                        {[
                            "N° ORDEN",
                            "REGION",
                            "FECHA ALTA",
                            "FECHA LIQUIDACION",
                            "RUT",
                            "TIPO",
                            "ESTADO"
                        ].map((header) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#142a3d",
                                    color: "white",
                                }}
                            >
                                <Typography>{header}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.orden}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.region ? item.region : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{extractDateOnly(item.fecha_alta) ? extractDateOnly(item.fecha_alta) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{extractDateOnly(item.fecha_liquidacion) ? extractDateOnly(item.fecha_liquidacion) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.rut ? item.rut : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.tipo ? item.tipo : 'N/A'}</TableCell>
                                <TableCell align="center" >
                                    <Select
                                        value={item.estado || 'Pendiente'}
                                        onChange={(e) => handleSaveChanges(e, item.id)}
                                        size="small"
                                        variant="standard"
                                        sx={{ minWidth: "150px" }}
                                    >
                                        {estadoOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value} >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const handleClose = () => {
        setOpen(false);
    };

    const filterCard = () => (
        <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
            <Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                size="small"
                variant="standard"
                sx={{ minWidth: "200px" }}
            >
                {tipoOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );

    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const result = await fetchPendientesSinConsumo(token, tipo);
            setData(result.pendientes);
            setTotal(result.total);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsSubmitting(false);
    };


    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [tipo]);


    return (
        <NdcLayout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    paddingY: "20px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{ width: "90%", marginBottom: 2 }}
                    >
                        {message}
                    </Alert>
                )}
                {statsEstado && Object.keys(statsEstado).length > 0 && pieEstado()}
                <Box sx={{ width: "90%", padding: 2, backgroundColor: "white", borderRadius: 2, border: "2px solid #dfdeda" }}>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Sin Consumo de Ferretería
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    {filterCard()}
                    {isSubmitting &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: 4 }}>
                            <CircularProgress />
                        </Box>}
                    {!isSubmitting && (
                        data.length > 0 ? (
                            tablependientes()
                        ) : (
                            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                                <Typography variant="body1">No hay datos disponibles.</Typography>
                            </Box>
                        )
                    )}
                </Box>
            </Box>
        </NdcLayout>
    );
}

export default NDCSinConsumoUpdate;

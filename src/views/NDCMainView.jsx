import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Paper,
    Button,
} from "@mui/material";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchConsumidasMensual } from "../api/ndcAPI";

import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from "@mui/x-charts/ChartContainer/ChartContainer";
import { BarChart } from '@mui/x-charts/BarChart';


function NDCMainView() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);

    const [metropolitanaDataConsumida, setMetropolitanaDataConsumida] = useState([]);
    const [valparaisoDataConsumida, setValparaisoDataConsumida] = useState([]);
    const [biobioDataConsumida, setBiobioDataConsumida] = useState([]);

    const [metropolitanaDataNoConsumida, setMetropolitanaDataNoConsumida] = useState([]);
    const [valparaisoDataNoConsumida, setValparaisoDataNoConsumida] = useState([]);
    const [biobioDataNoConsumida, setBiobioDataNoConsumida] = useState([]);

    const [metropolitanaDataSinStock, setMetropolitanaDataSinStock] = useState([]);
    const [valparaisoDataSinStock, setValparaisoDataSinStock] = useState([]);
    const [biobioDataSinStock, setBiobioDataSinStock] = useState([]);


    const [metropolitanaDataSinConsumoNoConsumidas, setMetropolitanaDataSinConsumoNoConsumidas] = useState([]);
    const [valparaisoDataSinConsumoNoConsumidas, setValparaisoDataSinConsumoNoConsumidas] = useState([]);
    const [biobioDataSinConsumoNoConsumidas, setBiobioDataSinConsumoNoConsumidas] = useState([]);

    const [fechaInicio, setFechaInicio] = useState("");


    const handleClose = () => {
        setOpen(false);
    };

    const filterData = (data, tipo) => {
        const metropolitana = data.filter(item => item.region == 'Metropolitana');
        if (tipo === 'consumida')
            setMetropolitanaDataConsumida(metropolitana);
        else if (tipo === 'no_consumida')
            setMetropolitanaDataNoConsumida(metropolitana);
        else if (tipo === 'sin_stock')
            setMetropolitanaDataSinStock(metropolitana);
        else if (tipo === 'sin_consumo_no_consumidas')
            setMetropolitanaDataSinConsumoNoConsumidas(metropolitana);

        const valparaiso = data.filter(item => item.region == 'Valparaíso');
        if (tipo === 'consumida')
            setValparaisoDataConsumida(valparaiso);
        else if (tipo === 'no_consumida')
            setValparaisoDataNoConsumida(valparaiso);
        else if (tipo === 'sin_stock')
            setValparaisoDataSinStock(valparaiso);
        else if (tipo === 'sin_consumo_no_consumidas')
            setValparaisoDataSinConsumoNoConsumidas(valparaiso);

        const biobio = data.filter(item => item.region == 'Biobío');
        if (tipo === 'consumida')
            setBiobioDataConsumida(biobio);
        else if (tipo === 'no_consumida')
            setBiobioDataNoConsumida(biobio);
        else if (tipo === 'sin_stock')
            setBiobioDataSinStock(biobio);
        else if (tipo === 'sin_consumo_no_consumidas')
            setBiobioDataSinConsumoNoConsumidas(biobio);
    }


    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchConsumidasMensual();
            setData(response.consumidas);
            filterData(response.consumidas, 'consumida');
            filterData(response.no_consumidas, 'no_consumida');
            filterData(response.sin_stock, 'sin_stock');
            filterData(response.sin_consumo_no_consumidas, 'sin_consumo_no_consumidas');
            setFechaInicio(response.fecha_inicial);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);


    return (
        <MainLayout >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    py: 2,
                    px: 1,
                    background: palette.bgGradient,
                    position: 'relative',
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
                        pointerEvents: 'none'
                    }
                }}
            >
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{ width: "90%", mb: 3, boxShadow: 4, borderRadius: 3, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}` }}
                    >
                        {message}
                    </Alert>
                )}
                <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, width: "92%", mb: 3, justifyContent: "center" }}>
                    {isSubmitting ? (
                        <Paper
                            elevation={8}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                my: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                p: 4,
                            }}
                        >
                            <CircularProgress size={60} thickness={5} sx={{ color: palette.primary.main }} />
                            <Typography variant="h6" sx={{ mt: 2, color: palette.textMuted }}>
                                Cargando datos...
                            </Typography>
                        </Paper>
                    ) : (
                        <Paper
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                my: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Box sx={{
                                p: 1,
                                display: "flex",
                                flexDirection: { lg: "row", xs: "column" },
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    width: { lg: "50%", xs: "100%" },
                                    justifyContent: "center",
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                        Órdenes con consumo consumidas desde {fechaInicio}
                                    </Typography>
                                    <BarChart
                                        series={[
                                            {
                                                name: 'Metropolitana',
                                                data: [metropolitanaDataConsumida.length],
                                                label: 'Metropolitana',
                                                color: "#3f51b5",
                                            },
                                            {
                                                name: 'Valparaíso',
                                                data: [valparaisoDataConsumida.length],
                                                label: 'Valparaíso',
                                                color: "#ff9800",
                                            },
                                            {
                                                name: 'Biobío',
                                                data: [biobioDataConsumida.length],
                                                label: 'Biobío',
                                                color: "#4caf50",
                                            },
                                        ]}
                                        xAxis={[
                                            {
                                                data: ['Región'],
                                                position: 'bottom',
                                                scaleType: 'band',
                                                grid: { display: true },
                                            },
                                        ]}
                                        height={250}
                                        width={500}
                                        sx={{ mt: 2 }}
                                        barLabel={(v) => v.value}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled
                                        sx={{
                                            mb: 3,
                                            backgroundColor: palette.primaryDark,
                                            color: "#fff", '&:hover': { backgroundColor: palette.primary },
                                            width: "300px"
                                        }}>
                                        Descargar detalle .xlsx
                                    </Button>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    width: { lg: "50%", xs: "100%" },
                                    justifyContent: "center",
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                        Órdenes con consumo pendientes de consumir desde {fechaInicio}
                                    </Typography>
                                    <BarChart
                                        series={[
                                            {
                                                name: 'Metropolitana',
                                                data: [metropolitanaDataNoConsumida.length],
                                                label: 'Metropolitana',
                                                color: "#3f51b5",
                                            },
                                            {
                                                name: 'Valparaíso',
                                                data: [valparaisoDataNoConsumida.length],
                                                label: 'Valparaíso',
                                                color: "#ff9800",
                                            },
                                            {
                                                name: 'Biobío',
                                                data: [biobioDataNoConsumida.length],
                                                label: 'Biobío',
                                                color: "#4caf50",
                                            },
                                        ]}
                                        xAxis={[
                                            {
                                                data: ['Región'],
                                                position: 'bottom',
                                                scaleType: 'band',
                                                grid: { display: true },
                                            },
                                        ]}
                                        height={250}
                                        width={500}
                                        sx={{ mt: 2 }}
                                        barLabel={(v) => v.value}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled
                                        sx={{
                                            mb: 3,
                                            backgroundColor: palette.primaryDark,
                                            color: "#fff", '&:hover': { backgroundColor: palette.primary },
                                            width: "300px"
                                        }}>
                                        Descargar detalle .xlsx
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ p: 1, display: "flex", flexDirection: { lg: "row", xs: "column" }, alignItems: "center", width: "100%" }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    width: { lg: "50%", xs: "100%" },
                                    justifyContent: "center",
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                        Órdenes con consumo sin stock desde {fechaInicio}
                                    </Typography>
                                    <BarChart
                                        series={[
                                            {
                                                name: 'Metropolitana',
                                                data: [metropolitanaDataSinStock.length],
                                                label: 'Metropolitana',
                                                color: "#3f51b5",
                                            },
                                            {
                                                name: 'Valparaíso',
                                                data: [valparaisoDataSinStock.length],
                                                label: 'Valparaíso',
                                                color: "#ff9800",
                                            },
                                            {
                                                name: 'Biobío',
                                                data: [biobioDataSinStock.length],
                                                label: 'Biobío',
                                                color: "#4caf50",
                                            },
                                        ]}
                                        xAxis={[
                                            {
                                                data: ['Región'],
                                                position: 'bottom',
                                                scaleType: 'band',
                                                grid: { display: true },
                                            },
                                        ]}
                                        height={250}
                                        width={500}
                                        sx={{ mt: 2 }}
                                        barLabel={(v) => v.value}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled
                                        sx={{
                                            mb: 3,
                                            backgroundColor: palette.primaryDark,
                                            color: "#fff", '&:hover': { backgroundColor: palette.primary },
                                            width: "300px"
                                        }}>
                                        Descargar detalle .xlsx
                                    </Button>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    width: { lg: "50%", xs: "100%" },
                                    justifyContent: "center",
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                        Órdenes sin consumo no consumidas desde {fechaInicio}
                                    </Typography>
                                    <BarChart
                                        series={[
                                            {
                                                name: 'Metropolitana',
                                                data: [metropolitanaDataSinConsumoNoConsumidas.length],
                                                label: 'Metropolitana',
                                                color: "#3f51b5",
                                            },
                                            {
                                                name: 'Valparaíso',
                                                data: [valparaisoDataSinConsumoNoConsumidas.length],
                                                label: 'Valparaíso',
                                                color: "#ff9800",
                                            },
                                            {
                                                name: 'Biobío',
                                                data: [biobioDataSinConsumoNoConsumidas.length],
                                                label: 'Biobío',
                                                color: "#4caf50",
                                            },
                                        ]}
                                        xAxis={[
                                            {
                                                data: ['Región'],
                                                position: 'bottom',
                                                scaleType: 'band',
                                                grid: { display: true },
                                            },
                                        ]}
                                        height={250}
                                        width={500}
                                        sx={{ mt: 2 }}
                                        barLabel={(v) => v.value}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled
                                        sx={{
                                            mb: 3,
                                            backgroundColor: palette.primaryDark,
                                            color: "#fff", '&:hover': { backgroundColor: palette.primary },
                                            width: "300px"
                                        }}>
                                        Descargar detalle .xlsx
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Box>
        </MainLayout>
    );
}

export default NDCMainView;

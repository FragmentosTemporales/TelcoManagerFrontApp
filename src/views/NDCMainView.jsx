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
    Input,
} from "@mui/material";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchResumenOrdenesNDC } from "../api/ndcAPI";
import { Link } from "react-router-dom";

import ModuleHeader from "../components/ModuleHeader";
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from "@mui/x-charts/ChartContainer/ChartContainer";
import { BarChart } from '@mui/x-charts/BarChart';


function NDCMainView() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);

    const [metropolitanaDataConsumida, setMetropolitanaDataConsumida] = useState([]);
    const [valparaisoDataConsumida, setValparaisoDataConsumida] = useState([]);
    const [biobioDataConsumida, setBiobioDataConsumida] = useState([]);

    const [dataConsumida, setDataConsumida] = useState([]);
    const [dataConsumidaFiltrada, setDataConsumidaFiltrada] = useState([]);

    const [ordenConsumida, setOrdenConsumida] = useState("");

    const [metropolitanaDataNoConsumida, setMetropolitanaDataNoConsumida] = useState([]);
    const [valparaisoDataNoConsumida, setValparaisoDataNoConsumida] = useState([]);
    const [biobioDataNoConsumida, setBiobioDataNoConsumida] = useState([]);

    const [dataNoConsumida, setDataNoConsumida] = useState([]);
    const [dataNoConsumidaFiltrada, setDataNoConsumidaFiltrada] = useState([]);
    const [ordenNoConsumida, setOrdenNoConsumida] = useState("");

    const [metropolitanaDataSinStock, setMetropolitanaDataSinStock] = useState([]);
    const [valparaisoDataSinStock, setValparaisoDataSinStock] = useState([]);
    const [biobioDataSinStock, setBiobioDataSinStock] = useState([]);

    const [dataSinStock, setDataSinStock] = useState([]);
    const [dataSinStockFiltrada, setDataSinStockFiltrada] = useState([]);
    const [ordenSinStock, setOrdenSinStock] = useState("");


    const [metropolitanaDataSinConsumoNoConsumidas, setMetropolitanaDataSinConsumoNoConsumidas] = useState([]);
    const [valparaisoDataSinConsumoNoConsumidas, setValparaisoDataSinConsumoNoConsumidas] = useState([]);
    const [biobioDataSinConsumoNoConsumidas, setBiobioDataSinConsumoNoConsumidas] = useState([]);

    const [dataSinConsumoNoConsumidas, setDataSinConsumoNoConsumidas] = useState([]);
    const [dataSinConsumoNoConsumidasFiltrada, setDataSinConsumoNoConsumidasFiltrada] = useState([]);
    const [ordenSinConsumoNoConsumidas, setOrdenSinConsumoNoConsumidas] = useState("");

    const [fechaInicio, setFechaInicio] = useState("");


    const handleClose = () => {
        setOpen(false);
    };

    const filterData = (data, tipo) => {
        const metropolitana = data.filter(item => item.region == 'Metropolitana');
        if (tipo === 'consumida') {
            setMetropolitanaDataConsumida(metropolitana);
        }
        else if (tipo === 'no_consumida') {
            setMetropolitanaDataNoConsumida(metropolitana);
        }
        else if (tipo === 'sin_stock') {
            setMetropolitanaDataSinStock(metropolitana);
        }
        else if (tipo === 'sin_consumo_no_consumidas') {
            setMetropolitanaDataSinConsumoNoConsumidas(metropolitana);
        }

        const valparaiso = data.filter(item => item.region == 'Valparaíso');
        if (tipo === 'consumida') {
            setValparaisoDataConsumida(valparaiso);
        }
        else if (tipo === 'no_consumida') {
            setValparaisoDataNoConsumida(valparaiso);
        }
        else if (tipo === 'sin_stock') {
            setValparaisoDataSinStock(valparaiso);
        }
        else if (tipo === 'sin_consumo_no_consumidas') {
            setValparaisoDataSinConsumoNoConsumidas(valparaiso);
        }

        const biobio = data.filter(item => item.region == 'Biobío');
        if (tipo === 'consumida') {
            setBiobioDataConsumida(biobio);
        }
        else if (tipo === 'no_consumida') {
            setBiobioDataNoConsumida(biobio);
        }
        else if (tipo === 'sin_stock') {
            setBiobioDataSinStock(biobio);
        }
        else if (tipo === 'sin_consumo_no_consumidas') {
            setBiobioDataSinConsumoNoConsumidas(biobio);
        }
    }

    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchResumenOrdenesNDC();

            setDataConsumida(response.consumidas);
            setDataConsumidaFiltrada(response.consumidas);

            setDataNoConsumida(response.no_consumidas);
            setDataNoConsumidaFiltrada(response.no_consumidas);

            setDataSinStock(response.sin_stock);
            setDataSinStockFiltrada(response.sin_stock);

            setDataSinConsumoNoConsumidas(response.sin_consumo_no_consumidas);
            setDataSinConsumoNoConsumidasFiltrada(response.sin_consumo_no_consumidas);

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

    useEffect(() => {
        if (ordenConsumida === "") {
            setDataConsumidaFiltrada(dataConsumida);
        } else {
            const ordenesFiltradas = dataConsumida.filter(item => item.orden.toUpperCase().startsWith(ordenConsumida.toUpperCase()));
            setDataConsumidaFiltrada(ordenesFiltradas);
        }
    }, [ordenConsumida]);

    useEffect(() => {
        if (ordenNoConsumida === "") {
            setDataNoConsumidaFiltrada(dataNoConsumida);
        } else {
            const ordenesFiltradas = dataNoConsumida.filter(item => item.orden.toUpperCase().startsWith(ordenNoConsumida.toUpperCase()));
            setDataNoConsumidaFiltrada(ordenesFiltradas);
        }
    }, [ordenNoConsumida]);

    useEffect(() => {
        if (ordenSinStock === "") {
            setDataSinStockFiltrada(dataSinStock);
        } else {
            const ordenesFiltradas = dataSinStock.filter(item => item.orden.toUpperCase().startsWith(ordenSinStock.toUpperCase()));
            setDataSinStockFiltrada(ordenesFiltradas);
        }
    }, [ordenSinStock]);

    useEffect(() => {
        if (ordenSinConsumoNoConsumidas === "") {
            setDataSinConsumoNoConsumidasFiltrada(dataSinConsumoNoConsumidas);
        } else {
            const ordenesFiltradas = dataSinConsumoNoConsumidas.filter(item => item.orden.toUpperCase().startsWith(ordenSinConsumoNoConsumidas.toUpperCase()));
            setDataSinConsumoNoConsumidasFiltrada(ordenesFiltradas);
        }
    }, [ordenSinConsumoNoConsumidas]);

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
                <ModuleHeader
                    title="NDC Bot - TelcoManager"
                    subtitle="Análisis de Órdenes de Trabajo con NDC"
                    divider
                />
                <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, width: "90%", mb: 3, justifyContent: "center" }}>
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
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                    Órdenes con consumo consumidas desde {fechaInicio}
                                </Typography>
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
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>

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

                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "90%", mb: 1 }}>
                                            <Input
                                                type="text"
                                                placeholder="🔍 Buscar Orden de Trabajo"
                                                value={ordenConsumida}
                                                onChange={(e) => setOrdenConsumida(e.target.value)}
                                                sx={{
                                                    mb: 2,
                                                    color: palette.primary,
                                                    fontWeight: "bold",
                                                    width: "100%",
                                                }} />
                                        </Box>

                                        <TableContainer component={Paper} sx={{ maxHeight: 300, width: "90%", minHeight: 250 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Orden</TableCell>
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Región</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataConsumidaFiltrada.map((item, index) => (
                                                        <TableRow 
                                                            component={Link}
                                                            to={`/ndc/orden-con-consumo-declarada/${item.orden}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                            key={index}>
                                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>{item.orden}</TableCell>
                                                            <TableCell align="center">{item.region}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>

                                </Box>
                            </Box>

                            <Divider sx={{ width: "90%", my: 2 }} />

                            <Box sx={{
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                    Órdenes con consumo pendientes de consumir desde {fechaInicio}
                                </Typography>
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

                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "90%", mb: 1 }}>
                                            <Input
                                                type="text"
                                                placeholder="🔍 Buscar Orden de Trabajo"
                                                value={ordenNoConsumida}
                                                onChange={(e) => setOrdenNoConsumida(e.target.value)}
                                                sx={{
                                                    mb: 2,
                                                    color: palette.primary,
                                                    fontWeight: "bold",
                                                    width: "100%",
                                                }} />
                                        </Box>
                                        <TableContainer component={Paper} sx={{ maxHeight: 300, width: "90%", minHeight: 250 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Orden</TableCell>
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Región</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataNoConsumidaFiltrada.map((item, index) => (
                                                        <TableRow 
                                                            component={Link}
                                                            to={`/ndc/orden/${item.orden}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                            key={index}>
                                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>{item.orden}</TableCell>
                                                            <TableCell align="center">{item.region}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ width: "90%", my: 2 }} />

                            <Box sx={{
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                    Órdenes con consumo sin stock desde {fechaInicio}
                                </Typography>
                                <Box sx={{ p: 1, display: "flex", flexDirection: { lg: "row", xs: "column" }, alignItems: "center", width: "100%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "90%",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>

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

                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "90%", mb: 1 }}>
                                            <Input
                                                type="text"
                                                placeholder="🔍 Buscar Orden de Trabajo"
                                                value={ordenSinStock}
                                                onChange={(e) => setOrdenSinStock(e.target.value)}
                                                sx={{
                                                    mb: 2,
                                                    color: palette.primary,
                                                    fontWeight: "bold",
                                                    width: "100%",
                                                }} />
                                        </Box>
                                        <TableContainer component={Paper} sx={{ maxHeight: 300, width: "90%", minHeight: 250 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Orden</TableCell>
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Región</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataSinStockFiltrada.map((item, index) => (
                                                        <TableRow 
                                                            component={Link}
                                                            to={`/ndc/orden/${item.orden}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                            key={index}>
                                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>{item.orden}</TableCell>
                                                            <TableCell align="center">{item.region}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ width: "90%", my: 2 }} />

                            <Box sx={{
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, textDecoration: "underline" }}>
                                    Órdenes sin consumo no consumidas desde {fechaInicio}
                                </Typography>
                                <Box sx={{ p: 1, display: "flex", flexDirection: { lg: "row", xs: "column" }, alignItems: "center", width: "100%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "90%",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>
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
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: { lg: "50%", xs: "100%" },
                                        justifyContent: "center",
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "90%", mb: 1 }}>
                                            <Input
                                                type="text"
                                                placeholder="🔍 Buscar Orden de Trabajo"
                                                value={ordenSinConsumoNoConsumidas}
                                                onChange={(e) => setOrdenSinConsumoNoConsumidas(e.target.value)}
                                                sx={{
                                                    mb: 2,
                                                    color: palette.primary,
                                                    fontWeight: "bold",
                                                    width: "100%",
                                                }} />
                                        </Box>

                                        <TableContainer component={Paper} sx={{ maxHeight: 300, width: "90%", minHeight: 250 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Orden</TableCell>
                                                        <TableCell sx={{ background: palette.primaryDark, color: palette.accentSoft, fontWeight: "bold" }} align="center">Región</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataSinConsumoNoConsumidasFiltrada.map((item, index) => (
                                                        <TableRow 
                                                            component={Link}
                                                            to={`/ndc/orden/${item.orden}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                            key={index}>
                                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>{item.orden}</TableCell>
                                                            <TableCell align="center">{item.region}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
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

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
    Typography,
    Paper,
    Chip,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { NdcLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchPendientesSinConsumo, updateOrdenSinConsumo, fetchPendientesStats } from "../api/logisticaAPI";
import { extractDateOnly } from "../helpers/main";

function NDCSinConsumoUpdate() {
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
                        const response = await fetchPendientesStats();
                setStatsEstado(response.estado);
                setStatsTipo(response.tipo);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchData();
    }, []);

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
        <Paper elevation={12}
            sx={{
                width: "92%",
                p: 3,
                background: palette.cardBg,
                borderRadius: 3,
                border: `1px solid ${palette.borderSubtle}`,
                display: "flex",
                flexDirection: { lg: "row", xs: "column" },
                mb: 3,
                gap: 2,
                backdropFilter: 'blur(4px)',
                boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)"
            }}
        >
            <Box sx={{ width: { lg: "40%", xs: "100%" }, display: "flex", flexDirection: "column" }}>
                <Chip label="Estado de las Órdenes" sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 600, letterSpacing: .5, background: `linear-gradient(120deg, ${palette.accent}, ${palette.primaryDark})`, color: '#fff' }} />
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
                    height={180}
                />
            </Box>
            <Box sx={{ width: { lg: "60%", xs: "100%" }, display: "flex", flexDirection: "column" }}>
                <Chip label="Tipo de Órdenes" sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 600, letterSpacing: .5, background: `linear-gradient(120deg, ${palette.accent}, ${palette.primaryDark})`, color: '#fff' }} />
                <BarChart
                    xAxis={[{
                        scaleType: 'band',
                        data: statsTipo.map((item) => item.tipo),
                    }]}
                    grid={{ vertical: true, horizontal: true }}
                    series={[{
                        data: statsTipo.map((item) => item.Q),
                        color: palette.primary,
                    }]}
                    height={180}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    onAxisClick={(event, d) => {
                        if (d && d.axisValue) {
                            setTipo(d.axisValue);
                        }
                    }}
                    sx={{ cursor: 'pointer' }}
                />
            </Box>
        </Paper>
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
            await updateOrdenSinConsumo(payload);

            setMessage("Actualizado correctamente");
            setAlertType("success");
            setOpen(true);

        } catch (error) {
            console.error(error);
            setData(previousData);
            setMessage("Error al actualizar. Por favor, inténtelo nuevamente.");
            setAlertType("error");
            setOpen(true);
        }
    };


    const tablependientes = () => (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1, background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Typography
                    sx={{
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
                <Table stickyHeader>
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
                                    fontWeight: 600,
                                    backgroundColor: palette.primary,
                                    color: 'white',
                                    letterSpacing: 0.4,
                                    borderBottom: `2px solid ${palette.primaryDark}`,
                                }}
                            >
                                <Typography>{header}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { backgroundColor: palette.accentSoft } }}>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }} align="center">{item.orden}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '12px' }} >{item.region ? item.region : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '12px' }} >{extractDateOnly(item.fecha_alta) ? extractDateOnly(item.fecha_alta) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '12px' }} >{extractDateOnly(item.fecha_liquidacion) ? extractDateOnly(item.fecha_liquidacion) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '12px' }} >{item.rut ? item.rut : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '12px' }} >{item.tipo ? item.tipo : 'N/A'}</TableCell>
                                <TableCell align="center" >
                                    <Select
                                        value={item.estado || 'Pendiente'}
                                        onChange={(e) => handleSaveChanges(e, item.id)}
                                        size="small"
                                        variant="standard"
                                        sx={{ minWidth: '150px', '& .MuiSelect-select': { fontSize: '12px' } }}
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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                size="small"
                variant="standard"
                sx={{ minWidth: 200, background: 'rgba(255,255,255,0.6)', px: 1, borderRadius: 1, '&:hover': { background: 'rgba(255,255,255,0.75)' } }}
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
            const result = await fetchPendientesSinConsumo(tipo);
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
                    minHeight: "100vh",
                    py: 8,
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
                        sx={{ width: "92%", mb: 3, boxShadow: 4, borderRadius: 3, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}` }}
                    >
                        {message}
                    </Alert>
                )}
                {statsEstado && Object.keys(statsEstado).length > 0 && pieEstado()}
                <Paper elevation={12} sx={{ width: '92%', p: 3, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)" }}>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700 }}>
                        Sin Consumo de Ferretería
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {filterCard()}
                    {isSubmitting && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!isSubmitting && (
                        data.length > 0 ? (
                            tablependientes()
                        ) : (
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Typography variant="body1">No hay datos disponibles.</Typography>
                            </Box>
                        )
                    )}
                </Paper>
            </Box>
        </NdcLayout>
    );
}

export default NDCSinConsumoUpdate;

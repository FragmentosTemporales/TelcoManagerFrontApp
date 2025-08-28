import {
    Alert,
    Backdrop,
    Box,
    Button,
    InputAdornment,
    Modal,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    CircularProgress,
    Divider,
    Chip,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";
import { useEffect, useState } from "react";
import { getTecnicos, avanzarTecnico, getTecnicosStats } from "../api/inventarioAPI";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

export default function InventarioView() {
    const authState = useSelector((state) => state.auth);
    const { estacion, user_id } = authState;
    // Normalize user_id to a number to avoid strict equality issues when user_id is a string
    const normalizedUserId = Number(user_id);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statsUsers, setStatsUsers] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const [formSiguiente, setFormSiguiente] = useState({
        numDoc: null,
        estacion: null
    });

    const [filterForm, setFilterForm] = useState({
        patente: null,
        numDoc: null,
        nombre: null
    });

    const [dataFiltered, setDataFiltered] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(()=>{
        console.log("USER ID : ", user_id)
    },[])

    const fetchTecnicos = async () => {
        setLoading(true);
        try {
            const res = await getTecnicos({ "estacion": estacion });
            setData(res.data);
            setDataFiltered(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        fetchStats();
    };

    useEffect(() => {
        if (!estacion) return;

        // Ejecuta inicialmente y luego cada 10 segundos mientras exista `estacion`.
        
        fetchStats();
        const intervalId = setInterval(() => {
            fetchStats();
        }, 15000); // 15 segundos

        return () => clearInterval(intervalId);
    }, [estacion]);

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const res = await getTecnicosStats();
            setStatsUsers(res);
        } catch (error) {
            console.error(error);
        }
        setLoadingStats(false);
    };

    const generarAvance = async () => {
        setIsSubmitting(true);
        try {
            const res = await avanzarTecnico(formSiguiente);
            setAlertSeverity("success");
            setMensaje(res.data.message);
            fetchTecnicos();
        } catch (error) {
            console.error(error);
            setMensaje("Error actualizando usuario");
            setAlertSeverity("error");
        }
        setOpen(true);
        setOpenModal(false);
        setIsSubmitting(false);
    };

    const functionToFilterData = () => {
        // Normalizamos y protegemos contra valores null/undefined antes de usar includes
        const searchPatente = (filterForm.patente || '').trim().toLowerCase();
        const searchNumDoc = (filterForm.numDoc || '').trim().toLowerCase();
        const searchNombre = (filterForm.nombre || '').trim().toLowerCase();

        const filtered = data.filter(item => {
            const patente = (item?.patente || '').toString().toLowerCase();
            const numDoc = (item?.numDoc || '').toString().toLowerCase();
            const nombre = (item?.nombre || '').toString().toLowerCase();

            const matchPatente = !searchPatente || patente.includes(searchPatente);
            const matchNumDoc = !searchNumDoc || numDoc.includes(searchNumDoc);
            const matchNombre = !searchNombre || nombre.includes(searchNombre);
            return matchPatente && matchNumDoc && matchNombre;
        });
        setDataFiltered(filtered);
    };

    const chartSetting = {
        yAxis: [
            {
                scaleType: 'band',
                dataKey: 'nombre',
            },
        ],
        xAxis: [
            {
                label: 'Total',
            },
        ],
        margin: { left: 180, right: 50 },
        height: 400,
    };

    const avanceStats = () => {
        if (!statsUsers || statsUsers.length === 0) return null;
        const total = statsUsers.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const okItem = statsUsers.find(item => (item.nombre || '').toString().toLowerCase() === 'ok');
        const porcentajeOK = total > 0 ? (((okItem?.total || 0) / total) * 100).toFixed(2) : '0.00';
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F91', '#6FFFB0', '#FFB347'];

        return (
            <Box sx={{
                width: { lg: "90%", md: "90%", xs: "95%" },
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                borderRadius: 2,
                py: 2,
                my: 2,
                textAlign: 'center'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Porcentaje de técnicos en OK: {porcentajeOK}%</Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                    {statsUsers.map((item, idx) => {
                        const pct = total > 0 ? (((item.total || 0) / total) * 100).toFixed(2) : '0.00';
                        return (
                            <Chip
                                key={item.id ?? idx}
                                label={`${item.nombre}: ${item.total} (${pct}%)`}
                                sx={{ background: COLORS[idx % COLORS.length], color: '#fff', fontWeight: 600 }}
                            />
                        );
                    })}
                </Box>
            </Box>
        );
    };

    const statsCard = () => (
        <Box
            sx={{
                width: { lg: "90%", md: "90%", xs: "95%" },
                overflow: "hidden",
                position: 'relative',
                background: palette.cardBg,
                textAlign: "center",
                my: 2,
                py: 2,
                border: `1px solid ${palette.borderSubtle}`,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column",
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <BarChart
                    dataset={statsUsers}
                    grid={{ vertical: true, horizontal: true }}
                    series={[{
                        dataKey: 'total',
                        label: 'Cantidad de técnicos por estación',
                        color: palette.accent,
                        valueFormatter: (value, context) => {
                            const item = context?.dataset?.[context.dataIndex];
                            if (!item) return value;
                            return `id: ${item.id} | nombre: ${item.nombre} | total: ${item.total}`;
                        }
                    }]}
                    layout="horizontal"
                    slotProps={{
                        tooltip: {
                            renderContent: (params) => {
                                const item = params?.series?.[0]?.data?.[params.dataIndex];
                                const d = item || (params?.series?.[0]?.context?.dataset?.[params.dataIndex]);
                                if (!d) return null;
                                return (
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption">id: {d.id}</Typography><br />
                                        <Typography variant="caption">nombre: {d.nombre}</Typography><br />
                                        <Typography variant="caption" fontWeight="bold">total: {d.total}</Typography>
                                    </Box>
                                );
                            }
                        }
                    }}
                    {...chartSetting}
                />
        </Box>
    );

    const filterCard = () => {
        if (normalizedUserId === 1) return null;

        return (
            <Box
                sx={{
                    width: { lg: "70%", md: "90%", xs: "95%" },
                    overflow: "hidden",
                    position: 'relative',
                    background: palette.cardBg,
                    textAlign: "center",
                    my: 2,
                    pb: 3,
                    border: `1px solid ${palette.borderSubtle}`,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "column",
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
                        pointerEvents: 'none'
                    }
                }}
            >
                <Typography variant="h6" sx={{
                    fontWeight: 600,
                    width: "100%",
                    py: 2,
                    color: palette.primary,
                    letterSpacing: .5
                }}>
                    FILTRAR POR</Typography>
                <Divider sx={{ width: '100%', mb: 1, borderColor: palette.borderSubtle }} />
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    marginY: 2
                }}>
                    <TextField
                        label="Nombre"
                        variant="standard"
                        value={filterForm.nombre || ""}
                        onChange={(e) => setFilterForm({ ...filterForm, nombre: e.target.value })}
                        sx={{ width: "30%" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Número de Documento"
                        variant="standard"
                        value={filterForm.numDoc || ""}
                        onChange={(e) => setFilterForm({ ...filterForm, numDoc: e.target.value })}
                        sx={{ width: "30%" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Patente"
                        variant="standard"
                        value={filterForm.patente || ""}
                        onChange={(e) => setFilterForm({ ...filterForm, patente: e.target.value })}
                        sx={{ width: "30%" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const botonActualizar = () => {
        if (normalizedUserId === 1) return null;
        return (
            <Box
                sx={{
                    width: { lg: "70%", md: "90%", xs: "95%" },
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        width: "200px",
                        background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
                        color: '#fff',
                        fontWeight: 600,
                        letterSpacing: '.5px',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                        boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45), 0 2px 6px -1px rgba(0,0,0,0.35)',
                        transition: 'all .35s',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                            mixBlendMode: 'overlay',
                            pointerEvents: 'none'
                        },
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                            background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
                        },
                        '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                        '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                    }}
                    onClick={() => fetchTecnicos()}
                >
                    Actualizar
                </Button>
            </Box>
        )
    }

    const modalRender = () => (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "150px",
                width: "600px",
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                boxShadow: '0 10px 32px -8px rgba(0,0,0,0.35)',
                p: 4,
                borderRadius: 3,
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(130deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%)',
                    pointerEvents: 'none',
                    borderRadius: 'inherit'
                }
            }}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 600, color: palette.primary }}>
                    ¿Desea avanzar de estación?
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2, color: palette.textMuted, fontSize: '.9rem' }}>
                    Al avanzar de estación, no podrá volver a visualizar la información del trabajador actual.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button variant="contained" sx={{ background: palette.primary, '&:hover': { background: palette.primaryDark } }} onClick={generarAvance} disabled={isSubmitting}>
                        {isSubmitting ? "Procesando..." : "Confirmar"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

    const tecnicosTable = () => {
    if (normalizedUserId === 1) return null;

        if (loading) {
            return (
                <Box
                    sx={{
                        position: 'relative',
                        background: palette.cardBg,
                        height: "30vh",
                        width: { lg: "70%", md: "90%", xs: "95%" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        border: `1px solid ${palette.borderSubtle}`,
                        borderRadius: 2,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                        '&:before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none', borderRadius: 'inherit' }
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 4, color: '#fff', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                        Cargando los recursos...
                    </Typography>
                    <CircularProgress />
                </Box>
            );
        }

        return (
            <Box
                sx={{
                    position: 'relative',
                    background: palette.cardBg,
                    width: { lg: "70%", md: "90%", xs: "95%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    borderRadius: 2,
                    border: `1px solid ${palette.borderSubtle}`,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                    '&:before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 65%)', pointerEvents: 'none', borderRadius: 'inherit' }
                }}
            >
                <Box sx={{ overflowX: "auto", width: "95%", marginY: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, position: 'relative', '&:before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 65%)', pointerEvents: 'none', borderRadius: 'inherit' } }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {[
                                    "NOMBRE",
                                    "RUT",
                                    "PATENTE",
                                    "ESTACION",
                                ].map((header) => (
                                    <TableCell
                                        key={header}
                                        align="left"
                                        sx={{
                                            fontWeight: 600,
                                            background: palette.bgGradient,
                                            color: 'white',
                                            borderBottom: 'none',
                                        }}
                                    >
                                        <Typography>{header}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataFiltered && dataFiltered.length > 0 ? (
                                dataFiltered.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        onClick={() => {
                                            setFormSiguiente({
                                                numDoc: row.numDoc,
                                                estacion: estacion
                                            });
                                            setOpenModal(true);
                                        }
                                        }
                                        sx={{
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            transition: 'background .2s',
                                            '&:nth-of-type(even)': { backgroundColor: '#fafbfd' },
                                            '&:hover': { backgroundColor: palette.accentSoft },
                                        }}
                                    >
                                        <TableCell align="left" width={"30%"}>{row.nombre ? row.nombre : "N/A"}</TableCell>
                                        <TableCell align="left" width={"20%"}>{row.numDoc ? row.numDoc : "N/A"}</TableCell>
                                        <TableCell align="left" width={"30%"}>{row.patente ? row.patente : "N/A"}</TableCell>
                                        <TableCell align="left" width={"20%"}>{row.estacion ? row.estacion : "N/A"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography>No hay datos disponibles</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        );
    };

useEffect(() => {
    if (estacion) {
        fetchTecnicos();
    }
}, [estacion]);

useEffect(() => {
    if (estacion) {
        fetchTecnicos();
    }
}, [estacion]);

useEffect(() => {
    functionToFilterData();
}, [filterForm.patente, filterForm.numDoc, filterForm.nombre]);

return (
    <MainLayout>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                minHeight: "80vh",
                paddingY: "70px",
                position: 'relative',
                background: palette.bgGradient,
                '::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.06), transparent 65%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <ModuleHeader
                title="Gestión Inventario"
                subtitle="Gestiona lista de asistentes a inventario."
            />
            {open && (
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    sx={{
                        width: { lg: "70%", md: "90%", xs: "95%" },
                        boxShadow: 2,
                    }}
                >
                    {mensaje}
                </Alert>
            )}
            {botonActualizar()}
            {statsCard()}
            {statsUsers.length > 0 && avanceStats()}

            {modalRender()}
            {filterCard()}
            {tecnicosTable()}

        </Box>
    </MainLayout>
);
}

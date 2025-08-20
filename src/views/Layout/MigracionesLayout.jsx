import { Box, Divider, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Navbar from "../../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
    getDataMigracionesPendientes,
    getMigracionGestiones,
    getQMigracionesPendientesdeVista
} from "../../api/despachoAPI";
import extractDate from "../../helpers/main";
import { onLoad } from "../../slices/migracionSlice";
import palette from "../../theme/palette";

function MigracionLayout({ children, showNavbar = true, id_vivienda = null }) {

    const authState = useSelector((state) => state.auth);
    const { token } = authState;

    const migracionState = useSelector((state) => state.migraciones);
    const { id_selected } = migracionState;

    const [QMigracionesPendientesVista, setQMigracionesPendientesVista] = useState([]);
    const [dataGestiones, setDataGestiones] = useState([]);
    const [dataPendiente, setDataPendiente] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const dispatch = useDispatch();
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleSubmitPendiente = (e, id_vivienda) => {
        e.preventDefault();
        try {
            dispatch(onLoad({ id_selected: id_vivienda }));
        } catch (error) {
            console.error("Error al seleccionar la migración:", error);
        }
    };

    const fetchPendientesVista = async () => {
        try {
            const response = await getQMigracionesPendientesdeVista(token);
            setQMigracionesPendientesVista(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGestiones = async () => {
        setDataGestiones([]);
        try {
            const response = await getMigracionGestiones(id_vivienda, token);
            setDataGestiones(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPendientes = async () => {
        try {
            const response = await getDataMigracionesPendientes(token);
            setDataPendiente(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPendientesVista();
    }, [id_selected]);

    useEffect(() => {
        fetchPendientes();
    }, [id_vivienda]);

    useEffect(() => {
        if (id_vivienda) {
            fetchGestiones();
        }
    }, [id_vivienda, token]);

    const sideWidth = 300; // px

    const cardBase = {
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        borderRadius: 3,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        transition: 'transform .35s, box-shadow .35s'
    };

    const pendingCard = {
        ...cardBase,
        mb: 1,
        width: '98%',
        cursor: 'pointer',
        px: 2,
        py: 1.2,
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.32)'
        }
    };

    const infoText = { color: palette.textMuted, fontSize: 11, fontWeight: 500, lineHeight: 1.25 };
    const labelTitle = { textAlign: 'left', color: palette.primary, fontWeight: 700, fontSize: 12, mb: .4 };

    return (
        <>
            {showNavbar && <Navbar />}

            {QMigracionesPendientesVista && QMigracionesPendientesVista.length > 0 && (
                <Box sx={{
                    width: '100%',
                    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
                    pt: '60px',
                    pb: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 40%, rgba(255,255,255,0.08), transparent 60%)', pointerEvents: 'none' }} />
                    <Box sx={{
                        width: '100%',
                        overflow: 'hidden',
                        py: 1,
                        position: 'relative'
                    }}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            whiteSpace: 'nowrap',
                            animation: 'scrollLeft 36s linear infinite'
                        }}>
                            {QMigracionesPendientesVista.concat(QMigracionesPendientesVista).map((item, index) => (
                                <Typography key={index} fontFamily='monospace' sx={{ color: 'yellow', fontSize: 13, letterSpacing: .5 }}>
                                    {item.COMUNA}: {item.Q}
                                </Typography>
                            ))}
                        </Box>
                        <Box sx={{
                            '@keyframes scrollLeft': {
                                '0%': { transform: 'translateX(0)' },
                                '100%': { transform: 'translateX(-50%)' }
                            }
                        }} />
                    </Box>
                </Box>
            )}

            <Box sx={{
                position: 'fixed',
                left: sidebarVisible ? sideWidth : 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                transition: 'left .35s ease'
            }}>
                <IconButton onClick={toggleSidebar} sx={{
                    background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primaryDark} 85%)`,
                    color: '#fff',
                    borderRadius: '0 10px 10px 0',
                    p: '14px 10px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
                    '&:hover': { background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 95%)` }
                }}>
                    {sidebarVisible ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </Box>

            <Box sx={{
                display: 'flex', flexDirection: 'row', minHeight: '90vh', background: palette.bgGradient,
                pt: QMigracionesPendientesVista.length > 0 ? 0 : '60px'
            }}>
                {sidebarVisible && (
                    <Box sx={{
                        width: sideWidth,
                        minWidth: 220,
                        background: `linear-gradient(160deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
                        transition: 'width .35s ease',
                        px: 1.2,
                        py: 2,
                        overflowY: 'auto',
                        scrollbarWidth: 'thin'
                    }}>
                        {dataPendiente && dataPendiente.length > 0 && (
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {dataPendiente.map((item, index) => (
                                    <Box key={index} onClick={(e) => handleSubmitPendiente(e, item.id_vivienda)} sx={pendingCard}>
                                        <Typography sx={labelTitle}>MIGRACION PENDIENTE</Typography>
                                        <Typography sx={{ ...infoText, fontWeight: 700 }}>{item.Cliente}</Typography>
                                        <Typography sx={{ ...infoText, fontWeight: 600 }}>{item.estado}</Typography>
                                        <Typography sx={infoText}>{item.Celular}</Typography>
                                        <Typography sx={infoText}>{item.COMUNA}</Typography>
                                        <Typography sx={infoText}>{item.bloque_horario}</Typography>
                                        <Typography sx={{ ...infoText, fontStyle: 'italic', fontWeight: 700 }}>
                                            {item.comentario || 'Sin Comentario'}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <Divider sx={{ width: '96%', my: 2, borderColor: 'rgba(255,255,255,0.35)' }} />
                        {dataGestiones && dataGestiones.length > 0 && (
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', mb: 2 }}>
                                {dataGestiones.map((item, index) => (
                                    <Box key={index} sx={{ ...cardBase, width: '98%', mb: 1, px: 2, py: 1.2 }}>
                                        <Typography sx={labelTitle}>GESTION PREVIA</Typography>
                                        <Typography sx={{ ...infoText, fontWeight: 700 }}>{item.contacto}</Typography>
                                        <Typography sx={{ ...infoText, fontWeight: 600 }}>{item.ingreso}</Typography>
                                        <Typography sx={infoText}>{extractDate(item.fecha_registro)}</Typography>
                                        <Typography sx={infoText}>{item.bloque_horario}</Typography>
                                        <Typography sx={{ ...infoText, fontStyle: 'italic', fontWeight: 700 }}>{item.comentario || 'Sin Comentario'}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
                <Box sx={{ width: sidebarVisible ? `calc(100% - ${sideWidth}px)` : '100%', transition: 'width .35s ease' }}>
                    {children}
                </Box>
            </Box>
        </>
    );
}

export default MigracionLayout;
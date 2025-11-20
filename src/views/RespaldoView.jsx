import {
    Alert,
    Box,
    Button,
    Divider,
    Typography,
    CircularProgress,
    Tooltip,
    Paper,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getRespaldoByID } from "../api/calidadAPI";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { MainLayout } from "./Layout";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";

export default function RespaldoView() {
    const { orden } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loadingPelo, setLoadingPelo] = useState(false);
    const [loadingPuerto, setLoadingPuerto] = useState(false);
    const [loadingCto, setLoadingCto] = useState(false);
    const [loadingVecino, setLoadingVecino] = useState(false);

    const [pelo, setPelo] = useState(null);
    const [puerto, setPuerto] = useState(null);
    const [cto, setCto] = useState(null);
    const [vecino, setVecino] = useState(null);

    const [tecnico, setTecnico] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        setIsSubmitting(true);
        setLoading(true);
        try {
            const response = await getRespaldoByID(orden);
            console.table(response)
            setData(response);
            setTecnico(response.usuario);
            setMessage("Respaldo cargado correctamente");
            setAlertType("success");
            setOpen(true);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al obtener los Respaldos");
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
        setLoading(false);
    };

    useEffect(() => {
        if (data && data.img_pelo && data.img_pelo !== "None") {
            fetchFile(data.img_pelo, 1);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.img_puerto && data.img_puerto !== "None") {
            fetchFile(data.img_puerto, 2);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.img_cto && data.img_cto !== "None") {
            fetchFile(data.img_cto, 3);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.img_vecino && data.img_vecino !== "None") {
            fetchFile(data.img_vecino, 4);
        }
    }, [data]);

    const fetchFile = async (filePath, variable) => {
        try {
            setLoadingPelo(true);
            setLoadingPuerto(true);
            setLoadingCto(true);
            setLoadingVecino(true);

            const res = await fetchFileUrl({ file_path: filePath });
            if (variable === 1) {
                setPelo(res);
                setLoadingPelo(false);
            }
            if (variable === 2) {
                setPuerto(res);
                setLoadingPuerto(false);
            }
            if (variable === 3) {
                setCto(res);
                setLoadingCto(false);
            }
            if (variable === 4) {
                setVecino(res);
                setLoadingVecino(false);
            }
        } catch (error) {
            console.error("Error al obtener la URL del archivo:", error);
        }
        finally {
            setLoadingPelo(false);
            setLoadingPuerto(false);
            setLoadingCto(false);
            setLoadingVecino(false);
        }
    };

    const RespaldoPreview = () => (
        <>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    width: '95%',
                    mt: 2,
                    mb: 1.5,
                    letterSpacing: .8,
                    color: palette.primary,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
            >
                Detalles del Respaldo
            </Typography>
            <Divider sx={{ width: '95%', mb: 2, borderColor: palette.borderSubtle }} />
            <Stack spacing={1.5} sx={{ width: '100%' }}>
                <LabelRow label="ORDEN:">{data.orden || 'No disponible'}</LabelRow>
                <LabelRow label="TECNICO:">{tecnico?.nombre ?? 'No disponible'}</LabelRow>

                <LabelRow label="DESCONEXIÓN DE PELO:">
                    {pelo && !loadingPelo ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={pelo} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={pelo}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loadingPelo ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>

                <LabelRow label="PUERTO CAIDO:">
                    {puerto && !loadingPuerto ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={puerto} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={puerto}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loadingPuerto ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>

                <LabelRow label="CTO:">
                    {cto && !loadingCto ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={cto} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={cto}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loadingCto ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>

                <LabelRow label="VECINO:">
                    {vecino && !loadingVecino ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={vecino} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={vecino}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loadingVecino ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>

                <LabelRow label="COMENTARIOS:">{data.comentarios || 'No disponible'}</LabelRow>
            </Stack>
        </>
    );

    const LabelRow = ({ label, children }) => (
        <Box sx={{
            width: '95%',
            display: 'flex',
            flexDirection: { lg: 'row', md: 'column', xs: 'column' },
            mb: 1.5,
            pl: { xs: 1.5, sm: 2, lg: 2.5 },   // indent general
            pr: { xs: 1, lg: 1.5 },
            gap: { lg: 2, xs: 0.5 },           // espacio entre label y valor en layout stacked
        }}>
            <Typography
                variant="subtitle2"
                sx={{
                    width: { lg: '22%', md: '100%', xs: '100%' },
                    fontWeight: 600,
                    color: palette.primaryDark,
                    letterSpacing: .45,
                    pr: { lg: 3, xs: 0 },          // separación extra cuando es horizontal
                    mb: { lg: 0, md: 0.25, xs: 0.25 }
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    width: { lg: '78%', md: '100%', xs: '100%' },
                    color: palette.primaryDark,
                    lineHeight: 1.45,
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        display: { lg: 'none', xs: 'block' }, // marcador sutil en móviles
                        position: 'absolute',
                        left: -8,
                        top: 8,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: palette.accent
                    }
                }}
            >
                {children}
            </Typography>
        </Box>
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    return (
        <MainLayout>
            <Box
                sx={{
                    pt: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    background: palette.bgGradient,
                    minHeight: "80vh",
                    position: 'relative',
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
                        pointerEvents: 'none',
                    }
                }}
            >

                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{
                            width: "80%",
                            mb: 3,
                            boxShadow: 4,
                            borderRadius: 3,
                            background: palette.cardBg,
                            border: `1px solid ${palette.borderSubtle}`,
                        }}
                    >
                        {message}
                    </Alert>
                )}
                <ModuleHeader
                    title="Visualización de Respaldo"
                    subtitle="Auditoría de Respaldo"
                    divider
                />
                <Box sx={{ width: '80%', display: 'flex', justifyContent: 'start', pb: 4, }}>
                    <Button
                        component={Link}
                        to="/modulo:respaldos"
                        variant="contained"
                        color="primary"
                        sx={{
                            width: "300px",
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                            },
                            '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                            '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                        }}
                    >
                        VOLVER
                    </Button>
                </Box>
                {isSubmitting ? (
                    <Box
                        sx={{
                            background: 'rgba(255,255,255,0.92)',
                            height: '30vh',
                            width: '80%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            border: `1px solid ${palette.borderSubtle}`,
                            borderRadius: 3,
                            boxShadow: '0 10px 28px -8px rgba(0,0,0,0.45)',
                            backdropFilter: 'blur(6px) saturate(160%)'
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 4, color: "#142a3d" }}>
                            Cargando los recursos...
                        </Typography>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper
                        elevation={12}
                        sx={{
                            width: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pb: 4,
                            pt: 1,
                            mb: 4,
                            background: 'rgba(255,255,255,0.92)',
                            borderRadius: 3,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: 'blur(6px) saturate(160%)',
                            boxShadow: '0 10px 28px -6px rgba(0,0,0,0.40)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
                                pointerEvents: 'none'
                            }
                        }}
                    >
                        {RespaldoPreview()}
                    </Paper>
                )}

            </Box>
        </MainLayout>
    );
}

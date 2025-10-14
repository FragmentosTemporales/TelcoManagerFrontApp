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
import { getReparacionByID } from "../api/calidadAPI";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { MainLayout } from "./Layout";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";

export default function RepaView() {
    const { orden } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [loading5, setLoading5] = useState(false);
    const [loading6, setLoading6] = useState(false);
    const [loading7, setLoading7] = useState(false);
    const [respaldo, setRespaldo] = useState(null);
    const [respaldo2, setRespaldo2] = useState(null);
    const [respaldo3, setRespaldo3] = useState(null);
    const [respaldo4, setRespaldo4] = useState(null);
    const [respaldo5, setRespaldo5] = useState(null);
    const [respaldo6, setRespaldo6] = useState(null);
    const [evidenciaRegularizacion, setEvidenciaRegularizacion] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        setIsSubmitting(true);
        setLoading(true);
        try {
            const response = await getReparacionByID(orden);
            console.table(response)
            setData(response);
            setMessage("Reparación cargada correctamente");
            setAlertType("success");
            setOpen(true);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al obtener las Reparaciones");
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
        setLoading(false);
    };

    useEffect(() => {
        if (data && data.respaldoFalta && data.respaldoFalta !== "None") {
            fetchFile(data.respaldoFalta, 1);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.respaldoFalta2 && data.respaldoFalta2 !== "None") {
            fetchFile(data.respaldoFalta2, 2);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.respaldoFalta3 && data.respaldoFalta3 !== "None") {
            fetchFile(data.respaldoFalta3, 3);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.respaldoFalta4 && data.respaldoFalta4 !== "None") {
            fetchFile(data.respaldoFalta4, 5);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.respaldoFalta5 && data.respaldoFalta5 !== "None") {
            fetchFile(data.respaldoFalta5, 6);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.respaldoFalta6 && data.respaldoFalta6 !== "None") {
            fetchFile(data.respaldoFalta6, 7);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.evidenciaRegularizacion && data.evidenciaRegularizacion !== "None") {
            fetchFile(data.evidenciaRegularizacion, 4);
        }
    }, [data]);

    const fetchFile = async (filePath, variable) => {
        try {
            setLoading(true);
            setLoading2(true);
            setLoading3(true);
            setLoading4(true);
            setLoading5(true);
            setLoading6(true);
            setLoading7(true);

            const res = await fetchFileUrl({ file_path: filePath });
            if (variable === 1) {
                setRespaldo(res);
                setLoading(false);
            } else if (variable === 2) {
                setRespaldo2(res);
                setLoading2(false);
            }
            else if (variable === 3) {
                setRespaldo3(res);
                setLoading3(false);
            }
            else if (variable === 4) {
                setEvidenciaRegularizacion(res);
                setLoading4(false);
            }
            else if (variable === 5) {
                setRespaldo4(res);
                setLoading5(false);
            }
            else if (variable === 6) {
                setRespaldo5(res);
                setLoading6(false);
            }
            else if (variable === 7) {
                setRespaldo6(res);
                setLoading7(false);
            }
        } catch (error) {
            console.error("Error al obtener la URL del archivo:", error);
        }
        finally {
            setLoading(false);
            setLoading2(false);
            setLoading3(false);
            setLoading4(false);
            setLoading5(false);
            setLoading6(false);
            setLoading7(false);
        }
    };

    const RepaPreview = () => (
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
                Detalles de la Reparación
            </Typography>
            <Divider sx={{ width: '95%', mb: 2, borderColor: palette.borderSubtle }} />
            <Stack spacing={1.5} sx={{ width: '100%' }}>
                <LabelRow label="ORDEN:">{data.orden || 'No disponible'}</LabelRow>
                <LabelRow label="CLIENTE:">{data.rutCliente || 'No disponible'}</LabelRow>
                <LabelRow label="COMUNA:">{data.comuna || 'No disponible'}</LabelRow>
                <LabelRow label="DIRECCION:">{data.direccion || 'No disponible'}</LabelRow>
                <LabelRow label="TECNICO:">{data.tecnico || 'No disponible'}</LabelRow>
                <LabelRow label="RUT TECNICO:">{data.rutTecnico || 'No disponible'}</LabelRow>
                <LabelRow label="TIPO FALTA:">{data.tipoFalta || 'No disponible'}</LabelRow>
                <LabelRow label="DESCRIPCION FALTA:">{data.observacionFalta || 'No disponible'}</LabelRow>
                <LabelRow label="IMAGEN FALTA 1:">
                    {respaldo && !loading ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="IMAGEN FALTA 2:">
                    {respaldo2 && !loading2 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo2} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo2}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="IMAGEN FALTA 3:">
                    {respaldo3 && !loading3 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo3} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo3}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="IMAGEN FALTA 4:">
                    {respaldo4 && !loading5 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo4} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo4}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="IMAGEN FALTA 5:">
                    {respaldo5 && !loading6 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo5} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo5}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="IMAGEN FALTA 6:">
                    {respaldo6 && !loading7 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={respaldo6} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={respaldo6}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="INSPECTOR:">{data.usuario?.nombre ?? 'No disponible'}</LabelRow>
                <LabelRow label="TIPO INSPECCION:">{data.tipoInspeccion || 'No disponible'}</LabelRow>
                <LabelRow label="EVIDENCIA REGULARIZACIÓN:">
                    {evidenciaRegularizacion && !loading4 ? (
                        <Tooltip title="Ver imagen" placement="top">
                            <a href={evidenciaRegularizacion} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={evidenciaRegularizacion}
                                    alt="Imagen de la reparación"
                                    style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                />
                            </a>
                        </Tooltip>
                    ) : loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : (
                        'Sin documento'
                    )}
                </LabelRow>
                <LabelRow label="OBSERVACIÓN ITO:">{data.observacionIto || 'No disponible'}</LabelRow>
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
                    title="Visualización de Auditoría"
                    subtitle="Auditoría de Reparación"
                    divider
                />
                <Box sx={{ width: '80%', display: 'flex', justifyContent: 'start', pb: 4, }}>
                    <Button
                        component={Link}
                        to="/modulo:reparaciones"
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
                        {RepaPreview()}
                    </Paper>
                )}

            </Box>
        </MainLayout>
    );
}

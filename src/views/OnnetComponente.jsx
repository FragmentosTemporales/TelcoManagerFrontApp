import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Modal,
    Paper,
    Typography,
    Fade,
    Skeleton,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getUniqueComponenteOnnet,
    updateRecursoEstado
} from "../api/onnetAPI";

import { downloadAprobadasAsZip } from "../helpers/downloadAprobadasZip";

export default function OnnetComponente() {
    const { componente_id } = useParams();
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [medicionCtoData, setMedicionCtoData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [toUpdate, setToUpdate] = useState(null);
    const [estadoRecurso, setEstadoRecurso] = useState(0);

    const [recursoData, setRecursoData] = useState(null);
    const [componenteTipoData, setComponenteTipoData] = useState(null);
    const [recursoUrls, setRecursoUrls] = useState([]);
    const [isLoadingImg, setIsLoadingImg] = useState(true);

    const [countPendientes, setCountPendientes] = useState(0);
    const [countAprobados, setCountAprobados] = useState(0);
    const [countRechazados, setCountRechazados] = useState(0);
    const [q_formulario, setQ_Formulario] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchComponenteDetails();
    }, []);

    useEffect(() => {
        if (!recursoData || recursoData.length === 0) return;
        let isMounted = true;
        const fetchRecursos = async () => {
            if (recursoData && recursoData.length > 0) {
                const urls = await Promise.all(recursoData.map(async (recurso) => {
                    if (recurso.file) {
                        try {
                            const url = await fetchFileUrl({ file_path: recurso.file });
                            return url;
                        } catch {
                            return null;
                        }
                    }
                    return null;
                }));
                if (isMounted) setRecursoUrls(urls);
            } else {
                setRecursoUrls([]);
            }
            setIsLoadingImg(false);
        };
        fetchRecursos();

        return () => {
            isMounted = false;
            recursoUrls.forEach(url => { if (url) URL.revokeObjectURL(url); });
        };
    }, [recursoData]);

    const handleClose = () => {
        setOpen(false);
    };

    const estadoSetter = (estado) => {
        switch (estado) {
            case 0:
                return "PENDIENTE";
            case 1:
                return "APROBADO";
            case 2:
                return "RECHAZADO";
            default:
                return "DESCONOCIDO";
        }
    };

    const estadoFilter = (estado) => {
        if (!recursoData) return [];
        return recursoData.filter(recurso => recurso.estado === estado);
    }

    useEffect(() => {
        if (!recursoData) {
            setCountPendientes(0);
            setCountAprobados(0);
            setCountRechazados(0);
            return;
        }
        setCountPendientes(recursoData.filter(r => r.estado === 0).length);
        setCountAprobados(recursoData.filter(r => r.estado === 1).length);
        setCountRechazados(recursoData.filter(r => r.estado === 2).length);
    }, [recursoData]);

    const fetchComponenteDetails = async () => {
        try {
            const data = await getUniqueComponenteOnnet(componente_id);
            setData(data);
            setMedicionCtoData(data.medicioncto);
            setRecursoData(data.recurso);
            setComponenteTipoData(data.componentetipo);
        } catch (error) {
            setAlertType('error');
            setMessage(`Error al cargar los detalles del componente: ${error}`);
            setOpen(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (componenteTipoData && componenteTipoData.formulario) {
            setQ_Formulario(componenteTipoData.formulario.length);
        }
    }, [componenteTipoData]);


    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    my: 4,
                }}
            >
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{
                            position: 'absolute',
                            top: 90,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            maxWidth: 700,
                            borderRadius: 2,
                            boxShadow: 3,
                            zIndex: 2
                        }}
                    >
                        {message}
                    </Alert>
                )}

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "600px",
                        background: palette.accentSoft,
                        border: `1px solid ${palette.borderSubtle}`,
                        boxShadow: '0 10px 32px -8px rgba(0,0,0,0.35)',
                        p: 2,
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
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                            }}>
                            ¿Está seguro que desea {estadoRecurso == 1 ? "aprobar" : "rechazar"} el estado del recurso?
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: palette.borderSubtle }} />
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            mt: 2,
                        }}>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    try {
                                        await updateRecursoEstado({ estado: estadoRecurso }, toUpdate);
                                        setOpenModal(false);
                                        setAlertType('success');
                                        setMessage('Estado del recurso actualizado correctamente.');
                                        setOpen(true);
                                        fetchComponenteDetails();
                                    } catch (error) {
                                        setOpenModal(false);
                                        setAlertType('error');
                                        setMessage(`Error al actualizar el estado del recurso: ${error}`);
                                        setOpen(true);
                                    }
                                }}
                                sx={{
                                    width: 150,
                                    background: estadoRecurso == 1 ? palette.primary : palette.danger,
                                    "&:hover": {
                                        background: estadoRecurso == 1 ? palette.primaryDark : palette.dangerHover
                                    }
                                }}
                            >
                                Confirmar
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenModal(false)}
                                sx={{
                                    width: 150,
                                }}
                            >
                                Cancelar
                            </Button>

                        </Box>
                    </Box>
                </Modal>

                <ModuleHeader
                    title="Detalles Componente Onnet"
                    subtitle={`Componente ID: ${componente_id}`}
                />
                <Box sx={{ width: { lg: "90%", xs: "90%" }, display: 'flex', justifyContent: 'start', pb: 4, }}>
                    <Button
                        component={Link}
                        to={`/onnet/modulo/proyecto/${data ? data.proyecto_id : ''}`}
                        variant="contained"
                        color="error"
                        sx={{
                            width: "200px",
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
                {loading ? (
                    <Paper
                        elevation={8}
                        sx={{
                            background: palette.cardBg,
                            height: "30vh",
                            width: "90%",
                            my: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            border: `1px solid ${palette.borderSubtle}`,
                            borderRadius: 3,
                            backdropFilter: 'blur(4px)',
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, color: palette.primary, fontWeight: 600 }}>
                            Cargando recursos...
                        </Typography>
                        <CircularProgress />
                    </Paper>
                ) : (
                    <>

                        {recursoData && recursoData.length > 0 ?
                            (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 1,
                                    width: '90%',
                                }}>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1500}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: palette.cardBg,
                                                fontWeight: "bold",
                                                width: '100%',
                                                textAlign: 'start',
                                                background: "#2b587e"
                                            }}>
                                            DETALLES
                                        </Typography>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1000}>
                                        <Paper
                                            elevation={8}
                                            sx={{
                                                background: palette.cardBg,
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "column",
                                                border: `1px solid ${palette.borderSubtle}`,
                                                borderRadius: 3,
                                                backdropFilter: 'blur(4px)',
                                                boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                                            }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                width: '100%',
                                                minHeight: '220px',
                                                justifyContent: 'space-around',
                                            }}>
                                                <Box sx={{
                                                    width: "100%"
                                                }}>
                                                    <PieChart
                                                        series={[{
                                                            data: [
                                                                { id: 0, value: countAprobados, label: 'Aprobados', color: 'green' },
                                                                { id: 1, value: countRechazados, label: 'Rechazados', color: 'red' },
                                                                { id: 2, value: countPendientes, label: 'Pendientes', color: 'yellow' },
                                                            ],
                                                            highlightScope: { faded: "global", highlighted: "item" },
                                                            faded: {
                                                                innerRadius: 30,
                                                                additionalRadius: -30,
                                                                color: "gray",
                                                            },
                                                            innerRadius: 40,
                                                            outerRadius: 70,
                                                        }]}
                                                        width={500}
                                                        height={200}
                                                    />
                                                </Box>
                                                <Box sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}>
                                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: palette.primaryDark,
                                                            fontWeight: "bold",
                                                            width: '90%'
                                                        }}>
                                                        TIPO COMPONENTE
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: palette.textMuted,
                                                            width: '90%'
                                                        }}>
                                                        {componenteTipoData ? componenteTipoData.nombre : 'N/A'}
                                                    </Typography>
                                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: palette.primaryDark,
                                                            fontWeight: "bold",
                                                            width: '90%'
                                                        }}>
                                                        CANTIDAD REGISTROS REQUERIDOS
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: palette.textMuted,
                                                            width: '90%'
                                                        }}>
                                                        {q_formulario}
                                                    </Typography>
                                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: palette.primaryDark,
                                                            fontWeight: "bold",
                                                            width: '90%'
                                                        }}>
                                                        CANTIDAD REGISTROS APROBADOS
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: palette.textMuted,
                                                            width: '90%'
                                                        }}>
                                                        {countAprobados}
                                                    </Typography>
                                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: palette.primaryDark,
                                                            fontWeight: "bold",
                                                            width: '90%'
                                                        }}>
                                                        % AVANCE
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: palette.textMuted,
                                                            width: '90%'
                                                        }}>
                                                        {q_formulario > 0 ? ((countAprobados / q_formulario) * 100).toFixed(2) : 0}%
                                                    </Typography>
                                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                                </Box>

                                            </Box>
                                        </Paper>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1500}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: palette.cardBg,
                                                fontWeight: "bold",
                                                width: '100%',
                                                textAlign: 'start',
                                                background: "#2b587e"
                                            }}>
                                            RECURSOS PENDIENTES
                                        </Typography>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1000}>
                                        <Grid container justifyContent="left" sx={{ mb: 2 }}>
                                            {estadoFilter(0).map((recurso) => {
                                                const originalIdx = recursoData.findIndex(r => r.id === recurso.id);
                                                return (
                                                    <Grid item xs={12} md={6} lg={4} key={recurso.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Card key={recurso.id} sx={{
                                                            background: palette.accentSoft,
                                                            width: '450px',
                                                            my: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            border: `1px solid ${palette.borderSubtle}`,
                                                            borderRadius: 3,
                                                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                                                        }}>

                                                            {isLoadingImg ? (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        my: 1,
                                                                        height: 260,
                                                                        width: 400,
                                                                    }}>
                                                                    <Skeleton variant="rectangular" width={180} height={260} />
                                                                </Box>
                                                            ) : (
                                                                <CardMedia
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        my: 1,

                                                                    }}>
                                                                    {recurso.file && recursoUrls[originalIdx] ? (
                                                                        <a href={recursoUrls[originalIdx]} target="_blank" rel="noopener noreferrer">
                                                                            <img
                                                                                src={recursoUrls[originalIdx]}
                                                                                alt="Imagen de la reparación"
                                                                                style={{
                                                                                    maxHeight: 260,
                                                                                    maxWidth: 400,
                                                                                    cursor: 'pointer',
                                                                                    boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)'
                                                                                }}
                                                                                onLoad={() => setIsLoadingImg(false)}
                                                                            />
                                                                        </a>
                                                                    ) : (
                                                                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                                            Sin documento
                                                                        </Typography>
                                                                    )}
                                                                </CardMedia>)}


                                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />

                                                            <CardContent
                                                                sx={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    background: palette.accentSoft,
                                                                }}
                                                            >
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    width: '90%',
                                                                }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            color: recurso.estado === 1 ? 'green' : recurso.estado === 2 ? 'red' : 'orange',
                                                                            textAlign: 'center',
                                                                            fontWeight: 'bold',
                                                                            width: '100%'
                                                                        }}
                                                                    >
                                                                        {estadoSetter(recurso.estado)}
                                                                    </Typography>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            width: '100%',
                                                                        }}>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textPrimary,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ fontWeight: 'bold' }}>{recurso.formulario.pregunta}</span>{' '}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textMuted,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{recurso.respuesta}</span>
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>

                                                            {recurso.estado === 0 && (
                                                                <CardActions>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(1)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            width: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.primary,
                                                                            "&:hover": { background: palette.primaryDark }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            APROBAR
                                                                        </Typography>
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(2)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            minWidth: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.danger,
                                                                            "&:hover": { background: palette.dangerHover }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            RECHAZAR
                                                                        </Typography>
                                                                    </Button>
                                                                </CardActions>
                                                            )}
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1500}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: palette.cardBg,
                                                    fontWeight: "bold",
                                                    width: '100%',
                                                    textAlign: 'start',
                                                    background: "#2b587e"
                                                }}>
                                                RECURSOS APROBADOS
                                            </Typography>
                                        </Box>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1500}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: "250px",
                                                    background: palette.succes,
                                                    '&:hover': { background: palette.succesHover }
                                                }}
                                                onClick={async () => {
                                                    await downloadAprobadasAsZip(estadoFilter(1), recursoData, recursoUrls);
                                                }}
                                            >
                                                Descargar aprobadas
                                            </Button>
                                        </Box>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1000}>
                                        <Grid container justifyContent="left" sx={{ mb: 2 }}>

                                            {estadoFilter(1).map((recurso) => {
                                                const originalIdx = recursoData.findIndex(r => r.id === recurso.id);
                                                return (
                                                    <Grid item xs={12} md={6} lg={4} key={recurso.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Card key={recurso.id} sx={{
                                                            background: palette.accentSoft,
                                                            width: '450px',
                                                            my: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            border: `1px solid ${palette.borderSubtle}`,
                                                            borderRadius: 3,
                                                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                                                        }}>



                                                            {isLoadingImg ? (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        my: 1,
                                                                        height: 260,
                                                                        width: 400,
                                                                    }}>
                                                                    <Skeleton variant="rectangular" width={180} height={260} />
                                                                </Box>
                                                            ) : (
                                                                <CardMedia
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        my: 1,

                                                                    }}>
                                                                    {recurso.file && recursoUrls[originalIdx] ? (
                                                                        <a href={recursoUrls[originalIdx]} target="_blank" rel="noopener noreferrer">
                                                                            <img
                                                                                src={recursoUrls[originalIdx]}
                                                                                alt="Imagen de la reparación"
                                                                                style={{
                                                                                    maxHeight: 260,
                                                                                    maxWidth: 400,
                                                                                    cursor: 'pointer',
                                                                                    boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)'
                                                                                }}
                                                                            />
                                                                        </a>
                                                                    ) : (
                                                                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                                            Sin documento
                                                                        </Typography>
                                                                    )}
                                                                </CardMedia>)}


                                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />

                                                            <CardContent
                                                                sx={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    background: palette.accentSoft,
                                                                }}
                                                            >
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    width: '90%',
                                                                }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            color: recurso.estado === 1 ? 'green' : recurso.estado === 2 ? 'red' : 'orange',
                                                                            textAlign: 'center',
                                                                            fontWeight: 'bold',
                                                                            width: '100%'
                                                                        }}
                                                                    >
                                                                        {estadoSetter(recurso.estado)}
                                                                    </Typography>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            width: '100%',
                                                                        }}>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textPrimary,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ fontWeight: 'bold' }}>{recurso.formulario.pregunta}</span>{' '}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textMuted,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{recurso.respuesta}</span>
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>

                                                            {recurso.estado === 0 && (
                                                                <CardActions>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(1)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            width: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.primary,
                                                                            "&:hover": { background: palette.primaryDark }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            APROBAR
                                                                        </Typography>
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(2)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            minWidth: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.danger,
                                                                            "&:hover": { background: palette.dangerHover }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            RECHAZAR
                                                                        </Typography>
                                                                    </Button>
                                                                </CardActions>
                                                            )}
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}

                                        </Grid>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1500}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: palette.cardBg,
                                                fontWeight: "bold",
                                                width: '100%',
                                                textAlign: 'start',
                                                background: "#2b587e"
                                            }}>
                                            RECURSOS RECHAZADOS
                                        </Typography>
                                    </Fade>

                                    <Divider sx={{ width: '100%', borderColor: palette.borderSubtle, my: 2 }} />

                                    <Fade in={true} timeout={1000}>
                                        <Grid container justifyContent="left" sx={{ mb: 2 }}>
                                            {estadoFilter(2).map((recurso) => {
                                                const originalIdx = recursoData.findIndex(r => r.id === recurso.id);
                                                return (
                                                    <Grid item xs={12} md={6} lg={4} key={recurso.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Card key={recurso.id} sx={{
                                                            background: palette.accentSoft,
                                                            width: '450px',
                                                            my: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            border: `1px solid ${palette.borderSubtle}`,
                                                            borderRadius: 3,
                                                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                                                        }}>

                                                            {isLoadingImg ? (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        my: 1,
                                                                        height: 260,
                                                                        width: 400,
                                                                    }}>
                                                                    <Skeleton variant="rectangular" width={180} height={260} />
                                                                </Box>
                                                            ) : (
                                                                <CardMedia sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    my: 1,

                                                                }}>
                                                                    {recurso.file && recursoUrls[originalIdx] ? (
                                                                        <a href={recursoUrls[originalIdx]} target="_blank" rel="noopener noreferrer">
                                                                            <img
                                                                                src={recursoUrls[originalIdx]}
                                                                                alt="Imagen de la reparación"
                                                                                style={{
                                                                                    maxHeight: 260,
                                                                                    maxWidth: 400,
                                                                                    cursor: 'pointer',
                                                                                    boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)'
                                                                                }}
                                                                            />
                                                                        </a>
                                                                    ) : (
                                                                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                                            Sin documento
                                                                        </Typography>
                                                                    )}
                                                                </CardMedia>
                                                            )}
                                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />

                                                            <CardContent
                                                                sx={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    background: palette.accentSoft,
                                                                }}
                                                            >
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    width: '90%',
                                                                }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            color: recurso.estado === 1 ? 'green' : recurso.estado === 2 ? 'red' : 'orange',
                                                                            textAlign: 'center',
                                                                            fontWeight: 'bold',
                                                                            width: '100%'
                                                                        }}
                                                                    >
                                                                        {estadoSetter(recurso.estado)}
                                                                    </Typography>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            width: '100%',
                                                                        }}>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textPrimary,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ fontWeight: 'bold' }}>{recurso.formulario.pregunta}</span>{' '}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{
                                                                                color: palette.textMuted,
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{recurso.respuesta}</span>
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>

                                                            {recurso.estado === 0 && (
                                                                <CardActions>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(1)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            width: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.primary,
                                                                            "&:hover": { background: palette.primaryDark }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            APROBAR
                                                                        </Typography>
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setEstadoRecurso(2)
                                                                            setToUpdate(recurso.id)
                                                                            setOpenModal(true)
                                                                        }}
                                                                        sx={{
                                                                            minWidth: 200,
                                                                            my: { xs: 1, md: 1, lg: 1 },
                                                                            background: palette.danger,
                                                                            "&:hover": { background: palette.dangerHover }
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: '#fff' }}>
                                                                            RECHAZAR
                                                                        </Typography>
                                                                    </Button>
                                                                </CardActions>
                                                            )}
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Fade>

                                </Box >
                            )
                            :
                            (
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: palette.accentSoft,
                                            fontWeight: "bold",
                                            width: '100%',
                                            textAlign: 'center',
                                            my: 2
                                        }}>
                                        No hay recursos asociados a este componente.
                                    </Typography>
                                </>
                            )}

                        {/* {medicionCtoData && medicionCtoData.length > 0 && (
                            <Paper
                                elevation={8}
                                sx={{
                                    background: palette.cardBg,
                                    width: { lg: "50%", xs: "90%" },
                                    my: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    border: `1px solid ${palette.borderSubtle}`,
                                    borderRadius: 3,
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                                }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    py: 1,
                                    width: '100%',
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: palette.primary,
                                            fontWeight: "bold",
                                            textAlign: 'center'
                                        }}>
                                        MEDICIONES CTO
                                    </Typography>
                                    <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                    {medicionCtoData.map((medicion) => (
                                        <Box key={medicion.id} sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    my: 1,
                                                    display: 'flex',
                                                    flexDirection: { lg: 'row', xs: 'column' },
                                                    justifyContent: { lg: 'space-around', xs: 'center' }
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 1 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_1}</span>
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 2 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_2}</span>
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                            <Box
                                                sx={{
                                                    my: 1,
                                                    display: 'flex',
                                                    flexDirection: { lg: 'row', xs: 'column' },
                                                    justifyContent: { lg: 'space-around', xs: 'center' }
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 3 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_3}</span>
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 4 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_4}</span>
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                            <Box
                                                sx={{
                                                    my: 1,
                                                    display: 'flex',
                                                    flexDirection: { lg: 'row', xs: 'column' },
                                                    justifyContent: { lg: 'space-around', xs: 'center' }
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 5 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_5}</span>
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 6 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_6}</span>
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                            <Box
                                                sx={{
                                                    my: 1,
                                                    display: 'flex',
                                                    flexDirection: { lg: 'row', xs: 'column' },
                                                    justifyContent: { lg: 'space-around', xs: 'center' }
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 7 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_7}</span>
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: palette.textPrimary,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>MEDICION 8 :</span>{' '}
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{medicion.value_8}</span>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        )} */}

                    </>)}
            </Box>

        </MainLayout>
    );
}

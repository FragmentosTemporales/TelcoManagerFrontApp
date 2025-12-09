import {
    Alert,
    Box,
    Button,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    InputLabel,
    TextField,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getUniqueComponenteOnnet
} from "../api/onnetAPI";

export default function OnnetComponente() {
    const { componente_id } = useParams();
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [componenteTipoData, setComponeteTipoData] = useState([]);
    const [medicionCtoData, setMedicionCtoData] = useState([]);
    const [recursoData, setRecursoData] = useState([]);
    const [recursoUrls, setRecursoUrls] = useState([]);


    useEffect(() => {
        fetchComponenteDetails();
    }, []);

    // Descargar blobs de recurso.file y guardar las URLs
    useEffect(() => {
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
        };
        fetchRecursos();
        return () => {
            isMounted = false;
            // Limpiar blobs
            recursoUrls.forEach(url => { if (url) URL.revokeObjectURL(url); });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recursoData]);

    const handleClose = () => {
        setOpen(false);
    };

    const fetchComponenteDetails = async () => {
        try {
            const data = await getUniqueComponenteOnnet(componente_id);
            setData(data);
            setComponeteTipoData(data.componentetipo);
            setMedicionCtoData(data.medicioncto);
            setRecursoData(data.recurso);
            console.log(data)
        } catch (error) {
            setAlertType('error');
            setMessage(`Error al cargar los detalles del componente: ${error}`);
            setOpen(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (recursoData && recursoData.length > 0) {
            console.log("Recursos asignados al componente:", recursoData);
        }
    }, [recursoData]);
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
                <ModuleHeader
                    title="Detalles Componente Onnet"
                    subtitle={`Componente ID: ${componente_id}`}
                />
                <Box sx={{ width: { lg: "50%", xs: "90%" }, display: 'flex', justifyContent: 'start', pb: 4, }}>
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
                        <Paper
                            elevation={8}
                            sx={{
                                background: palette.cardBg,
                                width: { lg: "50%", xs: "90%" },
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
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 1,
                            }}>
                                {data && (
                                    <Typography variant="h6" sx={{ color: palette.primary }}>
                                        Referencia : {data.referencia}
                                    </Typography>
                                )}

                                <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />

                                {componenteTipoData && componenteTipoData.nombre && (
                                    <Typography variant="h6" sx={{ color: palette.primary }}>
                                        Tipo : {componenteTipoData.nombre}
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {medicionCtoData && medicionCtoData.length > 0 && (
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
                        )}

                        {recursoData && recursoData.length > 0 && (
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
                                    alignItems: 'center',
                                    py: 1,
                                    width: '90%',
                                }}>
                                    <Typography variant="h6" sx={{ color: palette.primary, fontWeight: "bold" }}>
                                        RECURSOS ASIGNADOS
                                    </Typography>
                                    {recursoData.map((recurso, idx) => (
                                        <Box key={recurso.id} sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    my: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'

                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ color: palette.textPrimary }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>{recurso.formulario.pregunta}</span>{' '}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ color: palette.textPrimary }}
                                                >
                                                    <span style={{ color: palette.textSecondary, fontWeight: 'normal' }}>{recurso.respuesta}</span>
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ width: '90%', borderColor: palette.borderSubtle }} />
                                            <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {recurso.file && recursoUrls[idx] ? (
                                                    <a href={recursoUrls[idx]} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={recursoUrls[idx]}
                                                            alt="Imagen de la reparación"
                                                            style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                                                        />
                                                    </a>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                        Sin documento
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        )}

                    </>)}
            </Box>

        </MainLayout>
    );
}

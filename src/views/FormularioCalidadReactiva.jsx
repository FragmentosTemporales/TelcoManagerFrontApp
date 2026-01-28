import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Modal,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Chip,
    Typography,
    Fade,
    Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { getFormularioCalidadReactiva } from "../api/calidadAPI";
import { extractDateOnly } from "../helpers/main";

export default function FormularioCalidadReactiva() {
    const { formulario_id } = useParams()
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);


    const FetchData = async () => {
        setLoading(true);
        try {
            console.log("Fetching data for page:");
            const response = await getFormularioCalidadReactiva(formulario_id);
            setData(response);
            console.log("Data fetched:", response);
        } catch (error) {
            setAlertType('error');
            setMessage(`Error al cargar los formularios: ${error}`);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchData();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };


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
                    title="Formulario Calidad Reactiva"
                    subtitle={data ? `Detalle orden: ${data.orden}` : 'Cargando...'}
                />
                <Box sx={{ width: '80%', overflow: 'hidden', mx: 'auto' }}>
                    <Link to="/modulo:formulario-calidad-reactiva">
                        <Button
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
                            Volver
                        </Button>
                    </Link>
                </Box>
                {loading ? (
                    <Fade in timeout={1000}>
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
                    </Fade>
                ) : (
                    <Fade in timeout={1000}>
                        <Paper
                            elevation={8}
                            sx={{
                                background: palette.cardBg,
                                minHeight: '260px',
                                width: { xs: '90%', sm: '85%', md: '70%' },
                                my: 4,
                                px: { xs: 2, sm: 4 },
                                py: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                border: `1px solid ${palette.borderSubtle}`,
                                borderRadius: 4,
                                backdropFilter: 'blur(4px)',
                                boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)"
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                                <Typography variant="h5" sx={{ color: palette.primary, fontWeight: 700, letterSpacing: 1 }}>
                                    ORDEN: {data.orden}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: palette.textSecondary, fontWeight: 500, mt: { xs: 1, sm: 0 } }}>
                                    Fecha: {extractDateOnly(data.fecha_registro)}
                                </Typography>
                            </Box>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 500, mb: 0.5 }}>
                                        Área de Responsabilidad
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textPrimary, fontWeight: 600 }}>
                                        {data.area_responsabilidad.descripcion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 500, mb: 0.5 }}>
                                        Código de Cierre
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textPrimary, fontWeight: 600 }}>
                                        {data.codigo_cierre.descripcion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 500, mb: 0.5 }}>
                                        Sub Categoría
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textPrimary, fontWeight: 600 }}>
                                        {data.sub_categoria.descripcion || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 500, mb: 0.5 }}>
                                        Creado por
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textPrimary, fontWeight: 600 }}>
                                        {data.usuario.nombre || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 500, mb: 0.5 }}>
                                        Comentarios
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textPrimary, fontWeight: 500 }}>
                                        {data.comentarios || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>)}
            </Box>

        </MainLayout>
    );
}

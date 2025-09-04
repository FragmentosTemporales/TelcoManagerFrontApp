import {
    Alert,
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    InputLabel,
    TextField,
    LinearProgress,
    Autocomplete,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { getProyectosByEmpresa } from "../api/onnetAPI";
import { extractDateOnly } from "../helpers/main";


export default function ProyectosAsignados() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [proyectos, setProyectos] = useState([]);

    // filtros de búsqueda
    const [contratoFilter, setContratoFilter] = useState("");
    const [proyectoFilter, setProyectoFilter] = useState("");


    const handleClose = () => {
        setOpen(false);
    };

    const glass = {
        position: "relative",
        background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.80) 100%)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${palette.borderSubtle}`,
        borderRadius: 3,
        boxShadow: "0 8px 28px -4px rgba(0,0,0,0.25)",
        overflow: "hidden",
        "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
                "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
            pointerEvents: "none",
            mixBlendMode: "overlay",
        },
    };

    const fetchProyectos = async () => {
        setIsSubmitting(true);
        try {
            const response = await getProyectosByEmpresa();
            setProyectos(response.proyectos);
        } catch (error) {
            console.error("Error fetching proyectos:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // proyectos filtrados por contrato y por nombre de proyecto
    const filteredProyectos = useMemo(() => {
        const cFilter = contratoFilter.trim().toLowerCase();
        const pFilter = proyectoFilter.trim().toLowerCase();

        return proyectos.filter((p) => {
            const contrato = (p.contrato || "").toString().toLowerCase();
            const proyecto = (p.proyecto || "").toString().toLowerCase();

            const contratoMatches = cFilter ? contrato.includes(cFilter) : true;
            const proyectoMatches = pFilter ? proyecto.includes(pFilter) : true;

            return contratoMatches && proyectoMatches;
        });
    }, [proyectos, contratoFilter, proyectoFilter]);

    // contratos únicos para el select
    const contratosUnicos = useMemo(() => {
        const setContratos = new Set();
        proyectos.forEach((p) => {
            if (p && p.contrato) setContratos.add(p.contrato.toString());
        });
        return Array.from(setContratos).sort();
    }, [proyectos]);

    const clearFilters = () => {
        setContratoFilter("");
        setProyectoFilter("");
    };

    const proyectos_asignados = () => {
        if (isSubmitting) {
            return <CircularProgress />;
        }
        return (
            <Box>
                <Grid
                    container
                    rowSpacing={{ xs: 1, sm: 1, md: 1 }}
                    columnSpacing={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }}
                    // Mantener 3 columnas en pantallas grandes y permitir que el ancho de cada card crezca
                    sx={{
                        width: "100%",
                        mb: 14,
                        transition: 'max-width .4s ease'
                    }}
                    alignItems="stretch"
                >
                    {filteredProyectos.map((proyecto, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                            <Paper
                                component={Link}
                                to={`/modulo:proyecto-filtrado/${proyecto.contrato}/${proyecto.proyecto}`}
                                elevation={10}
                                sx={{
                                    textDecoration: "none",
                                    minHeight: 80,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    p: 2,
                                    borderRadius: 3,
                                    background: palette.cardBg,
                                    border: `1px solid ${palette.borderSubtle}`,
                                    backdropFilter: "blur(6px)",
                                    transition: "all .35s",
                                    overflow: "hidden",
                                    willChange: "transform, box-shadow",
                                    transformOrigin: "top center",
                                    mt: 0.5,
                                    '&:before': {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                            "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%)",
                                        opacity: 0,
                                        transition: "opacity .4s",
                                        pointerEvents: "none",
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow:
                                            "0 18px 40px -8px rgba(0,0,0,0.48), 0 8px 22px -4px rgba(0,0,0,0.32)",
                                        borderColor: palette.accent,
                                        '&:before': { opacity: 1 },
                                    },
                                    '&:active': { transform: 'translateY(-3px)', boxShadow: "0 10px 24px -10px rgba(0,0,0,0.4)" },
                                }}
                            >
                                <Box sx={{ textAlign: 'center', px: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 0.5,
                                            fontWeight: 700,
                                            color: palette.primary,
                                            letterSpacing: 0.3,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {proyecto.contrato}
                                    </Typography>

                                    <Divider sx={{ mb: 1, borderColor: palette.borderSubtle }} />
                                    <Typography
                                        variant="h6"
                                        sx={{ color: palette.textPrimary, fontWeight: 700, mb: 0.75 }}
                                    >
                                        {proyecto.proyecto}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: palette.textMuted }}>
                                            Fecha asignación:
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: palette.textMuted, fontSize: '0.8rem' }}>
                                            {extractDateOnly(proyecto.fecha_registro)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    useEffect(() => {
        fetchProyectos();
    }, []);

    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    paddingTop: "70px",
                    minHeight: '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                    title="Proyectos Asignados"
                    subtitle="Lista de proyectos asignados a tu empresa o usuario."
                />
                <Box sx={{ width: '90%', p: 2, mt: 1 }}>
                    <Paper elevation={10} sx={{ p: 2, mb: 2, borderRadius: 3, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, ...glass }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="contrato-select-label">CONTRATO</InputLabel>
                                    <Select
                                        labelId="contrato-select-label"
                                        label="CONTRATO"
                                        value={contratoFilter}
                                        onChange={(e) => setContratoFilter(e.target.value)}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {contratosUnicos.map((c) => (
                                            <MenuItem key={c} value={c}>
                                                {c}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={5} md={5}>
                                <TextField
                                    fullWidth
                                    label="Buscar por proyecto"
                                    placeholder="ID del proyecto"
                                    value={proyectoFilter}
                                    onChange={(e) => setProyectoFilter(e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={3}>
                                <Button fullWidth variant="outlined" color="inherit" onClick={clearFilters}>
                                    Limpiar
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Box sx={{ width: '90%', p: 2 }}>
                    {proyectos_asignados()}
                </Box>
            </Box>
        </MainLayout>
    );
}

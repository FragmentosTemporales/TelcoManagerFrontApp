import {
    Alert,
    Box,
    Button,
    ButtonGroup,
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
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { extractDateOnly } from "../helpers/main";
import { 
    getProyectoOnnet, 
    uploadProyectoOnnet, 
    getComponenteTipoOnnet, 
    createComponenteOnnet
} from "../api/onnetAPI";
import { getEmpresas } from "../api/authAPI";

export default function OnnetProyecto() {
    const { proyecto_id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const [empresas, setEmpresas] = useState(null);
    const [empresa, setEmpresa] = useState(null);

    const [proyectoData, setProyectoData] = useState(null);

    const [componentes, setComponentes] = useState([]);

    const [componentesTipos, setComponentesTipos] = useState([]);

    const [formComponenteTipo, setFormComponenteTipo] = useState({
        referencia: "",
        proyecto_id: proyecto_id,
        tipo_id: "",
    });

    const [formEmpresa, setFormEmpresa] = useState({
        empresa_id: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchProyectoData = async () => {
        setLoading(true);
        try {
            const data = await getProyectoOnnet(proyecto_id);
            setProyectoData(data);
            setEmpresa(data.empresa);
            setComponentes(data.componente);
            console.log(data)
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpresas = async () => {
        if (empresas != null) return;
        try {
            const empresas = await getEmpresas();
            setEmpresas(empresas);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
    };

    const fetchComponentesTipos = async () => {
        try {
            const componentesTipos = await getComponenteTipoOnnet();
            setComponentesTipos(componentesTipos);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
    };

    const onUpdateProyecto = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                empresaID: formEmpresa.empresa_id,
                estado: 1
            };
            await uploadProyectoOnnet(payload, proyecto_id);
            console.log(payload);
            setMessage("Proyecto actualizado correctamente");
            setAlertType("success");
            setOpen(true);
            fetchProyectoData();
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitComponente = async () => {
        setIsSubmitting(true);
        try {
            if (formComponenteTipo.referencia === "" || formComponenteTipo.tipo_id === "") {
                setMessage("Por favor, complete todos los campos del formulario.");
                setAlertType("warning");
                setOpen(true);
                setIsSubmitting(false);
                return;
            }

            await createComponenteOnnet(formComponenteTipo);
            setMessage("Componente creado correctamente");
            setAlertType("success");
            setOpen(true);
            fetchProyectoData();
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
            setFormComponenteTipo({
                referencia: "",
                proyecto_id: proyecto_id,
                tipo_id: "",
            });
        }
    };

    useEffect(() => {
        fetchProyectoData();
    }, [proyecto_id]);

    useEffect(() => {
        fetchEmpresas();
    }, [empresa]);

    useEffect(() => {
        fetchComponentesTipos();
    }, []);

    useEffect(() => {
        console.log(componentes);
    }, [componentes]);

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
                    title="Detalles Proyecto Onnet"
                    subtitle={`Proyecto ID: ${proyecto_id}`}
                />
                <Box sx={{ width: '90%', display: 'flex', justifyContent: 'start', pb: 4, }}>
                    <Button
                        component={Link}
                        to="/onnet/modulo/proyectos"
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
                            elevation={10}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                border: `1px solid ${palette.borderSubtle}`,
                                borderRadius: 3,
                                backdropFilter: 'blur(6px)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{
                                    width: '100%',
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {empresa != null ? (
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                                {empresa.nombre}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: palette.textMuted, fontWeight: 600 }}>
                                                {empresa.rut}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <FormControl sx={{ minWidth: 200, mr: 2 }}>
                                                <InputLabel id="filter-empresa-label">Empresa</InputLabel>
                                                <Select
                                                    labelId="filter-empresa-label"
                                                    id="filter-empresa"
                                                    value={formEmpresa.empresa_id || ''}
                                                    label="Empresa"
                                                    onChange={(e) => setFormEmpresa({ empresa_id: e.target.value || null })}
                                                    sx={{ minWidth: 300 }}
                                                    size="small"
                                                >
                                                    {empresas && empresas.map((emp) => (
                                                        <MenuItem key={emp.empresaID} value={emp.empresaID}>{emp.nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Button
                                                sx={{ minWidth: 300, mr: 2, mt: { xs: 1, md: 1, lg: 0 }, background: palette.primary, "&:hover": { background: palette.primaryDark } }}
                                                variant="contained"
                                                onClick={onUpdateProyecto}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Actualizando...' : 'Asignar Empresa'}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </CardContent>
                        </Paper>

                        <Divider sx={{ width: '90%', my: 2, borderColor: palette.borderSubtle }} />
                        <Typography variant="h5" sx={{ color: palette.accentSoft, fontWeight: 600 }}>
                            {
                                proyectoData.estado === 0
                                    ? "PENDIENTE ASIGNACIÓN"
                                    : proyectoData.estado === 1
                                        ? "EN PROCESO"
                                        : proyectoData.estado === 2
                                            ? "COMPLETADO"
                                            : "DESCONOCIDO"
                            }
                        </Typography>
                        <Divider sx={{ width: '90%', my: 2, borderColor: palette.borderSubtle }} />

                        <Paper
                            elevation={10}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                border: `1px solid ${palette.borderSubtle}`,
                                borderRadius: 3,
                                backdropFilter: 'blur(6px)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                        COMPONENTES
                                    </Typography>
                                </Box>
                                <Divider sx={{ width: '100%', borderColor: palette.bgGradient }} />
                                <Grid container sx={{ m: 1, width: '100%' }}>
                                    {componentes && componentes.length === 0 ? (
                                        <Typography variant="body1" sx={{
                                            color: palette.textMuted,
                                            fontStyle: 'italic',
                                            m: 2,
                                            width: '100%',
                                            textAlign: 'center',
                                        }}>
                                            No hay componentes disponibles.
                                        </Typography>
                                    ) : (
                                        componentes && componentes.map((componente, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Box sx={{
                                                    width: '80%',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    my: 1,
                                                    mx: 'auto',
                                                    textAlign: 'center',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                    transition: "all .35s",
                                                    background: palette.accentSoft,
                                                    cursor: "pointer",
                                                    '&:before': {
                                                        content: '""',
                                                        position: "absolute",
                                                        inset: 0,
                                                        background:
                                                            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)",
                                                        opacity: 0,
                                                        transition: "opacity .4s",
                                                        pointerEvents: "none",
                                                    },
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow:
                                                            "0 14px 34px -6px rgba(0,0,0,0.42), 0 6px 16px -2px rgba(0,0,0,0.30)",
                                                        borderColor: palette.accent,
                                                        '&:before': { opacity: 1 },
                                                    },
                                                    '&:active': { transform: 'translateY(-3px)', boxShadow: "0 8px 20px -8px rgba(0,0,0,0.4)" },

                                                }}>
                                                    <Typography variant="subtitle1" sx={{ width: '100%', color: palette.accent, fontWeight: 600 }}>
                                                        {componente.referencia}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: palette.textMuted }}>
                                                        {componente.componentetipo.nombre}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                                <Divider sx={{ width: '100%', borderColor: palette.bgGradient }} />
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    my: 2,
                                }}>
                                    <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                        CREAR COMPONENTES
                                    </Typography>
                                    <Box sx={{ mt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row', lg: 'row' }, justifyContent: 'center', alignItems: 'center' }}>
                                        <FormControl sx={{ minWidth: 200, mr: 2 }}>
                                            <InputLabel id="filter-tipo-label">Tipo</InputLabel>
                                            <Select
                                                labelId="filter-tipo-label"
                                                id="filter-tipo"
                                                value={formComponenteTipo.tipo_id || ''}
                                                label="Tipo"
                                                onChange={(e) => setFormComponenteTipo({ ...formComponenteTipo, tipo_id: e.target.value || null })}
                                                sx={{ minWidth: 250 }}
                                                size="small"
                                            >
                                                {componentesTipos && componentesTipos.map((tipo) => (
                                                    <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Referencia Componente"
                                            variant="outlined"
                                            value={formComponenteTipo.referencia || ''}
                                            onChange={(e) => setFormComponenteTipo({ ...formComponenteTipo, referencia: e.target.value || null })}
                                            sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 } }}
                                            size="small"
                                        />

                                        <Button
                                            sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 }, background: palette.primary, "&:hover": { background: palette.primaryDark } }}
                                            variant="contained"
                                            onClick={onSubmitComponente}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Creando...' : 'Crear Componente'}
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Paper>
                    </>
                )}
            </Box>

        </MainLayout>
    );
}

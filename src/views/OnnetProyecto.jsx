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
import { getProyectoOnnet, uploadProyectoOnnet } from "../api/onnetAPI";
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

    useEffect(() => {
        fetchProyectoData();
    }, [proyecto_id]);

    useEffect(() => {
        fetchEmpresas();
    }, [empresa]);

    const handleClose = () => {
        setOpen(false);
    };

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
                                my: 2,
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
                                    height:40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>

                                </Box>
                            </CardContent>
                        </Paper>
                    </>
                )}
            </Box>

        </MainLayout>
    );
}

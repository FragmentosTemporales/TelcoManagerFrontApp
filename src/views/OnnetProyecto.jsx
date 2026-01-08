import {
    Alert,
    Box,
    Button,
    Card,
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
    Fade,
} from "@mui/material";
import PushPinIcon from '@mui/icons-material/PushPin';
import { useEffect, useState } from "react";
import { useParams, Link, Form } from "react-router-dom";

import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getProyectoOnnet,
    getComponenteTipoOnnet,
    createComponenteOnnet,
    getProyectoOnnetUsers,
    createAsignadoOnnet,
    getPendientesComponente
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

    const [proyectoData, setProyectoData] = useState(null);

    const [componentes, setComponentes] = useState([]);
    const [pendientesMap, setPendientesMap] = useState({});

    const [componentesTipos, setComponentesTipos] = useState([]);

    const [formComponenteTipo, setFormComponenteTipo] = useState({
        referencia: "",
        proyecto_id: proyecto_id,
        asignado_id: "",
        tipo_id: "",
    });

    const [formAsignacion, setFormAsignacion] = useState({
        proyecto_id: proyecto_id,
        userID: "",
        empresaID: "",
        subgrupo: "",
    });

    const [asignadoSeleccionado, setAsignadoSeleccionado] = useState(null);

    const [userList, setUserList] = useState([]);
    const [asignados, setAsignados] = useState([]);


    const fetchAllPendientes = async (componentesList) => {
        const pendientesObj = {};
        await Promise.all(
            (componentesList || []).map(async (componente) => {
                try {
                    const pendientes = await getPendientesComponente(componente.id);
                    const pendientes2 = pendientes.pendientes;
                    pendientesObj[componente.id] = `Pendientes: ${pendientes2[0].q_pendiente ?? 0}`;
                } catch (error) {
                    pendientesObj[componente.id] = 'Pendientes: 0';
                }
            })
        );
        setPendientesMap(pendientesObj);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchProyectoData = async () => {
        setLoading(true);
        try {
            const data = await getProyectoOnnet(proyecto_id);
            setProyectoData(data);
            setAsignados(data.asignados);
            setAsignadoSeleccionado(null);
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

    const fetchUserList = async (empresa_id) => {
        try {
            const users = await getProyectoOnnetUsers(empresa_id);
            setUserList(users.data);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
    };

    const onCreateAsignado = async () => {
        setIsSubmitting(true);
        if (formAsignacion.empresaID === "" || formAsignacion.userID === "") {
            setMessage("Por favor, complete todos los campos del formulario.");
            setAlertType("warning");
            setOpen(true);
            setIsSubmitting(false);
            return;
        }
        try {
            const payload = {
                empresaID: formAsignacion.empresaID,
                userID: formAsignacion.userID,
                proyecto_id: proyecto_id,
            };
            if (formAsignacion.subgrupo && formAsignacion.subgrupo !== "") {
                payload.subgrupo = formAsignacion.subgrupo;
            }
            await createAsignadoOnnet(payload);
            setMessage("Asignado correctamente");
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
                asignado_id: "",
                tipo_id: "",
            });
        }
    };

    useEffect(() => {
        fetchProyectoData();
    }, [proyecto_id]);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    useEffect(() => {
        fetchComponentesTipos();
    }, []);

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        if (asignadoSeleccionado?.componente) {
            setComponentes(asignadoSeleccionado.componente);
            fetchAllPendientes(asignadoSeleccionado.componente);
        } else {
            setComponentes([]);
            setPendientesMap({});
        }
    }, [asignadoSeleccionado]);


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
                        <>
                            <Divider sx={{ width: '90%', mb: 2, borderColor: palette.borderSubtle }} />

                            <Typography variant="h5" sx={{ color: palette.accentSoft, fontWeight: 600 }}>
                                {
                                    proyectoData?.estado === 0
                                        ? "PENDIENTE ASIGNACIÓN"
                                        : proyectoData?.estado === 1
                                            ? "EN PROCESO"
                                            : proyectoData?.estado === 2
                                                ? "COMPLETADO"
                                                : "DESCONOCIDO"
                                }
                            </Typography>

                            <Divider sx={{ width: '90%', my: 2, borderColor: palette.borderSubtle }} />
                        </>

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
                                mb: 2,
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <Box sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                    CREAR ASIGNACIÓN
                                </Typography>
                            </Box>
                            <Divider sx={{ width: '100%', borderColor: palette.bgGradient }} />
                            <Box sx={{
                                display: "flex",
                                flexDirection: { xs: 'column', md: 'column', lg: 'row' },
                                justifyContent: "space-around",
                                alignItems: "center",
                                pt: 2
                            }}>
                                {/* SELECTOR DE EMPRESA */}
                                <FormControl sx={{ minWidth: 200, mt: { xs: 1, md: 0, lg: 0 } }}>
                                    <InputLabel id="filter-empresa-label">Empresa</InputLabel>
                                    <Select
                                        labelId="filter-empresa-label"
                                        id="filter-empresa"
                                        value={formAsignacion.empresaID || ''}
                                        label="Empresa"
                                        onChange={(e) => { setFormAsignacion({ ...formAsignacion, empresaID: e.target.value || null }); fetchUserList(e.target.value || null); }}
                                        sx={{ minWidth: 300, backdropFilter: 'blur(6px)' }}
                                        size="small"
                                    >
                                        <MenuItem value="">Ninguno</MenuItem>
                                        {empresas && empresas.map((emp, index) => (
                                            <MenuItem key={index} value={emp.empresaID}>{emp.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* SELECTOR DE USUARIO */}
                                <FormControl sx={{ minWidth: 200, mt: { xs: 1, md: 1, lg: 0 } }}>
                                    <InputLabel id="filter-usuario-label">Usuario</InputLabel>
                                    <Select
                                        labelId="filter-usuario-label"
                                        id="filter-usuario"
                                        label="Usuario"
                                        value={formAsignacion.userID || ''}
                                        onChange={(e) => setFormAsignacion({ ...formAsignacion, userID: e.target.value || null })}
                                        sx={{ minWidth: 300, backdropFilter: 'blur(6px)' }}
                                        size="small"
                                        disabled={userList.length === 0}
                                    >
                                        <MenuItem value="">Ninguno</MenuItem>
                                        {userList.length > 0 && userList.map((user, index) => (
                                            <MenuItem key={index} value={user.userID}>{user.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* SELECTOR DE SUBGRUPO */}
                                <FormControl sx={{ minWidth: 200, mt: { xs: 1, md: 1, lg: 0 } }}>
                                    <InputLabel id="filter-subgrupo-label">Subgrupo</InputLabel>
                                    <Select
                                        labelId="filter-subgrupo-label"
                                        id="filter-subgrupo"
                                        label="Subgrupo"
                                        value={formAsignacion.subgrupo || ''}
                                        onChange={(e) => setFormAsignacion({ ...formAsignacion, subgrupo: e.target.value || null })}
                                        sx={{ minWidth: 300, backdropFilter: 'blur(6px)' }}
                                        size="small"
                                        disabled={userList.length === 0}
                                    >
                                        <MenuItem value="">Ninguno</MenuItem>
                                        <MenuItem value="linea">Linea</MenuItem>
                                        <MenuItem value="empalme">Empalme</MenuItem>
                                    </Select>
                                </FormControl>

                            </Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: { xs: 'column', md: 'row', lg: 'row' },
                                justifyContent: "space-around",
                                alignItems: "center",
                                py: 2
                            }}>

                                <Button
                                    sx={{ minWidth: 300, mt: { xs: 1, md: 1, lg: 0 }, background: palette.primary, "&:hover": { background: palette.primaryDark } }}
                                    variant="contained"
                                    disabled={isSubmitting}
                                    onClick={onCreateAsignado}
                                >
                                    {isSubmitting ? 'Actualizando...' : 'Asignar'}
                                </Button>
                            </Box>
                        </Paper>

                        {asignados && asignados.length > 0 ? (
                            <Fade in={true} timeout={1000}>
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
                                        mb: 2,
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                            pointerEvents: 'none'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                            ASIGNADOS AL PROYECTO
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ width: '100%', borderColor: palette.bgGradient }} />
                                    <Grid container sx={{ width: '100%', p: 2 }}>
                                        {asignados.map((asignado, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index} >

                                                <Card
                                                    onClick={() => {
                                                        setAsignadoSeleccionado(asignado);
                                                        setFormComponenteTipo({ ...formComponenteTipo, asignado_id: asignado.id });
                                                    }}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: { xs: '90%', sm: '80%', md: '80%' },
                                                        minHeight: 60,
                                                        p: 2.5,
                                                        borderRadius: 3,
                                                        my: 2,
                                                        mx: 'auto',
                                                        textAlign: 'center',
                                                        textDecoration: 'none',
                                                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                                        transition: 'all .35s',
                                                        background: `linear-gradient(135deg, ${palette.accentSoft} 80%, #fff 100%)`,
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        border: asignadoSeleccionado?.id === asignado.id ? `2px solid ${palette.accent}` : `2px solid transparent`,
                                                        '&:hover': {
                                                            transform: 'translateY(-6px) scale(1.03)',
                                                            boxShadow: '0 12px 32px -6px rgba(0,0,0,0.22), 0 6px 16px -2px rgba(0,0,0,0.18)',
                                                            borderColor: palette.accent,
                                                        },
                                                        '&:active': {
                                                            transform: 'translateY(-2px) scale(1.01)',
                                                            boxShadow: '0 6px 16px -6px rgba(0,0,0,0.18)',
                                                        },
                                                    }}>
                                                    <Typography variant="body1" sx={{ color: palette.primary, fontWeight: 600 }}>
                                                        {asignadoSeleccionado?.id === asignado.id ? (
                                                            <>
                                                                <PushPinIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                                {asignado.empresa.nombre}
                                                            </>
                                                        ) : asignado.empresa.nombre}
                                                    </Typography>
                                                    <Divider sx={{ width: '80%', my: 1, borderColor: palette.borderSubtle }} />
                                                    <Typography variant="body1" sx={{ color: palette.textMuted, fontWeight: 500, m: 0.5 }}>
                                                        {asignado.user.nombre}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: palette.textMuted, fontWeight: 500, m: 0.5 }}>
                                                        {asignado.subgrupo ? asignado.subgrupo.charAt(0).toUpperCase() + asignado.subgrupo.slice(1) : 'Sin subgrupo asignado'}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: palette.textMuted, fontWeight: 500, m: 0.5 }}>
                                                        {asignado.componente.length} componentes asignados
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Fade>
                        ) : null}

                        {asignadoSeleccionado ? (
                            <Fade in={true} timeout={1000}>
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
                                    mb: 2,
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                        pointerEvents: 'none'
                                    }
                                }}
                            >
                                <Box sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ color: palette.primary, fontWeight: 600 }}>
                                        COMPONENTES
                                    </Typography>
                                </Box>
                                <Divider sx={{ width: '100%', borderColor: palette.bgGradient }} />

                                <Grid container sx={{ width: '100%', p: 2 }}>
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
                                                <Box
                                                    component={Link}
                                                    to={`/onnet/modulo/componente/${componente.id}`}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: { xs: '90%', sm: '80%', md: '80%' },
                                                        minHeight: 60,
                                                        p: 2.5,
                                                        borderRadius: 3,
                                                        my: 2,
                                                        mx: 'auto',
                                                        textAlign: 'center',
                                                        textDecoration: 'none',
                                                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                                        transition: 'all .35s',
                                                        background: `linear-gradient(135deg, ${palette.accentSoft} 80%, #fff 100%)`,
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        border: `2px solid transparent`,
                                                        '&:hover': {
                                                            transform: 'translateY(-6px) scale(1.03)',
                                                            boxShadow: '0 12px 32px -6px rgba(0,0,0,0.22), 0 6px 16px -2px rgba(0,0,0,0.18)',
                                                            borderColor: palette.accent,
                                                        },
                                                        '&:active': {
                                                            transform: 'translateY(-2px) scale(1.01)',
                                                            boxShadow: '0 6px 16px -6px rgba(0,0,0,0.18)',
                                                        },
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" sx={{ width: '100%', color: palette.accent, fontWeight: 700, fontSize: 20, mb: 0.5, letterSpacing: 0.5 }}>
                                                        REFERENCIA : {componente.referencia}
                                                    </Typography>

                                                    <Divider sx={{ width: '80%', my: 1, borderColor: palette.borderSubtle }} />

                                                    <Typography variant="body2" sx={{ color: palette.primary, fontWeight: 600, fontSize: 15 }}>
                                                        {componente.componentetipo.nombre}
                                                    </Typography>

                                                    <Typography variant="body2" sx={{ color: palette.primary, fontWeight: 600, fontSize: 15 }}>
                                                        {pendientesMap[componente.id] ?? 'Cargando pendientes...'}
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
                                                sx={{ minWidth: 250, backdropFilter: 'blur(6px)' }}
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
                                            sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 }, backdropFilter: 'blur(6px)' }}
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

                            </Paper>
                            </Fade>
                        ) : null}
                    </>
                )}
            </Box>

        </MainLayout>
    );
}

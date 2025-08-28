import {
    Alert,
    Box,
    Button,
    Divider,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { crearProyectoInterno, getProyectobyID, UpdateProyectoInterno } from "../api/proyectos_internos_api";
import { palette } from "../theme/palette";
import { MainLayout } from "./Layout";

function CreateProyectoInterno() {
    const authState = useSelector((state) => state.auth);
    const { proyecto_id } = useParams();
    const { user_id, area } = authState;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        userID: user_id,
        areaID: area.areaID
    });

    const [titulo, setTitulo] = useState("Crear Proyecto Interno");

    const handleClose = () => {
        setOpen(false);
    };

    const fetchProyecto = async () => {
        setIsSubmitting(true);
        try {
            const proyecto = await getProyectobyID(proyecto_id);
            const data = proyecto.data;
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                userID: user_id,
                areaID: area.areaID
            });
            setTitulo("Editar Proyecto Interno");
        } catch (error) {
            setMessage(`Error al cargar el proyecto: ${error}`);
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
    }

    useEffect(() => {
        if (proyecto_id) {
            // Fetch the existing project data and populate the form
            setTitulo("Editar Proyecto Interno");
            fetchProyecto();
        }
    }, [proyecto_id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        setFormData({
            ...formData,
            userID: user_id,
            areaID: area.areaID
        });
    }, [user_id, area.areaID]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await crearProyectoInterno(formData);
            setMessage("Proyecto creado exitosamente.");
            setAlertType("success");
            setOpen(true);
            setTimeout(() => {
                navigate("/modulo:proyecto-interno");
            }, 3000);
        } catch (error) {
            setMessage(`Error al crear el proyecto: ${error}`);
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await UpdateProyectoInterno(proyecto_id, formData);
            setMessage("Proyecto actualizado exitosamente.");
            setAlertType("success");
            setOpen(true);
            setTimeout(() => {
                navigate("/modulo:proyecto-interno");
            }, 3000);
        } catch (error) {
            setMessage(`Error al actualizar el proyecto: ${error}`);
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
    };

    return (
        <MainLayout>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '90vh',
                py: '70px',
                background: palette.bgGradient,
                position: 'relative',
                overflow: 'hidden',
                '::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 18% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.06), transparent 65%)',
                    pointerEvents: 'none'
                }
            }}>
                {open && (
                    <Alert onClose={handleClose} severity={alertType} sx={{ mb: 3, width: '80%', borderRadius: 3, boxShadow: 4, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}` }}>
                        {message}
                    </Alert>
                )}
                <Box sx={{ width: '80%', my: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/modulo:proyecto-interno"
                        sx={{ 
                            width: "200px",
                            background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
                            color: '#fff',
                            fontWeight: 600,
                            letterSpacing: '.5px',
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                            boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45), 0 2px 6px -1px rgba(0,0,0,0.35)',
                            transition: 'all .35s',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                                mixBlendMode: 'overlay',
                                pointerEvents: 'none'
                            },
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                                background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
                            },
                            '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                            '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                        }} 
                    >
                        VOLVER
                    </Button>
                </Box>
                <Box sx={{
                    width: '80%',
                    borderRadius: 3,
                    background: palette.cardBg,
                    border: `1px solid ${palette.borderSubtle}`,
                    boxShadow: '0 10px 32px -10px rgba(0,0,0,0.40)',
                    backdropFilter: 'blur(6px)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <Box sx={{
                        px: 3,
                        py: 2.2,
                        background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 130%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant='h5' sx={{ fontWeight: 600, color: '#fff', letterSpacing: .5 }}>
                            {titulo}
                        </Typography>
                        {isSubmitting && <CircularProgress size={26} sx={{ color: '#fff' }} />}
                    </Box>
                    <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                        <form onSubmit={proyecto_id ? handleUpdate : handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <TextField
                                    label="Nombre del Proyecto"
                                    variant="standard"
                                    sx={{ mb: 2, width: { xs: '100%', sm: '400px', lg: '400px' } }}
                                    inputProps={{ maxLength: 99, minLength: 5 }}
                                    required
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Area"
                                    variant="standard"
                                    sx={{ mb: 2, width: { xs: '100%', sm: '400px', lg: '400px' } }}
                                    value={area.descri || ''}
                                    disabled
                                />
                                <TextField
                                    label="Descripción"
                                    variant="standard"
                                    sx={{ mb: 2, width: { xs: '100%', sm: '500px', lg: '700px' } }}
                                    inputProps={{ maxLength: 249, minLength: 5 }}
                                    required
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                />
                                <Button
                                    variant='contained'
                                    type='submit'
                                    disabled={isSubmitting}
                                    sx={{
                                        background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 75%)`,
                                        color: '#fff',
                                        borderRadius: 2,
                                        width: '200px', // mantener ancho
                                        mt: 2,
                                        fontWeight: 600,
                                        letterSpacing: .6,
                                        textTransform: 'none',
                                        boxShadow: '0 8px 22px -6px rgba(0,0,0,0.45)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)',
                                            opacity: .55,
                                            mixBlendMode: 'overlay',
                                            transition: 'opacity .4s'
                                        },
                                        '&:hover': { boxShadow: '0 12px 30px -8px rgba(0,0,0,0.55)', transform: 'translateY(-3px)', '&:before': { opacity: .85 } },
                                        '&:active': { transform: 'translateY(-1px)' }
                                    }}
                                >
                                    {proyecto_id ? (isSubmitting ? 'Actualizando...' : 'Actualizar Proyecto') : (isSubmitting ? 'Creando...' : 'Crear Proyecto')}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </MainLayout>
    );
}

export default CreateProyectoInterno;

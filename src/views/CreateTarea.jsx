import {
    Alert,
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { crearTareaProyectoInterno, getUsuariosByArea } from "../api/proyectos_internos_api";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";

export default function CreateTareaInterna() {
    const authState = useSelector((state) => state.auth);
    const { proyecto_id } = useParams();
    const { area } = authState;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    const [formDataTarea, setFormDataTarea] = useState({
        titulo: '',
        descripcion: '',
        estado: '',
        proyecto_id: proyecto_id,
        userID: '',
    });

    const handleClose = () => {
        setOpen(false);
    };

    const fetchUsuarios = async () => {
        try {
            const response = await getUsuariosByArea(area.areaID);
            setUsuarios(response);
            console.log("Usuarios fetched:", response);
        } catch (error) {
            console.error(error);
            setMessage(`Error al cargar los usuarios: ${error}`);
            setAlertType("error");
            setOpen(true);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, [area.areaID]);

    const handleChange = (e) => {
        setFormDataTarea({
            ...formDataTarea,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await crearTareaProyectoInterno(formDataTarea);
            setMessage("Tarea creada exitosamente.");
            setAlertType("success");
            setOpen(true);
            setTimeout(() => {
                navigate("/modulo:proyecto-interno");
            }, 3000);
        } catch (error) {
            console.error(error);
            setMessage(`Error al crear la tarea: ${error}`);
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
    };

    return (
        <MainLayout>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: "90vh",
                    py: "70px",
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
                }}
            >
                {open && (
                    <Alert onClose={handleClose} severity={alertType} sx={{ mb: 3, width: { xs: '90%', sm: '70%', md: '50%' }, background: palette.cardBg, backdropFilter: 'blur(6px)', border: `1px solid ${palette.borderSubtle}`, borderRadius: 3, boxShadow: 4 }}>
                        {message}
                    </Alert>
                )}
                <Box
                    sx={{
                        width: "80%",
                        my: 2,
                    }}
                >
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

                <Box sx={{ width: '80%', borderRadius: 3, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, boxShadow: '0 10px 32px -10px rgba(0,0,0,0.40)', backdropFilter: 'blur(6px)', overflow: 'hidden', position: 'relative' }}>
                    <Box sx={{ px: 3, py: 2.2, background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 130%)` }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff', letterSpacing: .5 }}>
                            Crear tarea
                        </Typography>
                    </Box>
                    <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <TextField
                                    label="Titulo de la Tarea"
                                    variant="standard"
                                    sx={{ mb: 2, width: { xs: '100%', sm: '400px', lg: '400px' } }}
                                    inputProps={{ maxLength: 99, minLength: 5 }}
                                    required
                                    name="titulo"
                                    value={formDataTarea.titulo}
                                    onChange={handleChange}
                                />
                                <Select
                                    label="Estado"
                                    name="estado"
                                    variant="standard"
                                    value={formDataTarea.estado}
                                    onChange={handleChange}
                                    sx={{ mb: 2, width: { xs: '100%', sm: '400px', lg: '400px' } }}
                                >
                                    <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                                    <MenuItem value="GESTIONANDO">GESTIONANDO</MenuItem>
                                    <MenuItem value="FINALIZADA">FINALIZADA</MenuItem>
                                    <MenuItem value="CANCELADA">CANCELADA</MenuItem>
                                </Select>
                                <Select
                                    label="Responsable"
                                    name="userID"
                                    variant="standard"
                                    value={formDataTarea.userID}
                                    onChange={handleChange}
                                    sx={{ mb: 2, width: { xs: '100%', sm: '400px', lg: '400px' } }}
                                >
                                    {usuarios.map((user) => (
                                        <MenuItem key={user.id} value={user.value}>
                                            {user.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    label="Descripción"
                                    variant="standard"
                                    sx={{ mb: 2, width: { xs: '100%', sm: '500px', lg: '700px' } }}
                                    inputProps={{ maxLength: 249, minLength: 5 }}
                                    required
                                    name="descripcion"
                                    value={formDataTarea.descripcion}
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
                                        width: '200px',
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
                                    {isSubmitting ? 'Creando...' : 'Crear Tarea'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>

            </Box>

        </MainLayout>
    );
}


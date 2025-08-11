import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    InputLabel,
    TextField,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { crearProyectoInterno, getProyectobyID, UpdateProyectoInterno } from "../api/proyectos_internos_api";
import { MainLayout } from "./Layout";

function CreateProyectoInterno() {
    const authState = useSelector((state) => state.auth);
    const { proyecto_id } = useParams();
    const { token, user_id, area } = authState;
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
            const proyecto = await getProyectobyID(token, proyecto_id);
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
            const response = await crearProyectoInterno(formData, token);
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
            const response = await UpdateProyectoInterno(proyecto_id, formData, token);
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    minHeight: "90vh",
                    paddingY: "70px",
                }}
            >
                {open && (
                    <Alert onClose={handleClose} severity={alertType} sx={{ marginBottom: 3 }}>
                        {message}
                    </Alert>
                )}
                <Box
                    sx={{
                        width: "80%",
                        marginY: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        component={Link}
                        to="/modulo:proyecto-interno"
                        sx={{
                            backgroundColor: "#142a3d",
                            color: "white",
                            borderRadius: 2,
                            width: "200px"
                        }}
                    >
                        VOLVER
                    </Button>
                </Box>

                <Box sx={{ border: "2px solid #dfdeda", backgroundColor: "white", paddingY: 1, borderRadius: 2, width: '80%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left', width: '90%', marginLeft: 3 }}>
                        {titulo}
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />

                    <Box sx={{ paddingX: 3, paddingBottom: 3 }}>
                        <form onSubmit={proyecto_id ? handleUpdate : handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                <TextField
                                    label="Nombre del Proyecto"
                                    variant="standard"
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "400px", lg: "400px" } }}
                                    inputProps={{ maxLength: 99, minLength: 5 }}
                                    required
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Area"
                                    variant="standard"
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "400px", lg: "400px" } }}
                                    value={area.descri || ''}
                                    disabled
                                />
                                <TextField
                                    label="Descripción"
                                    variant="standard"
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "500px", lg: "700px" } }}
                                    inputProps={{ maxLength: 249, minLength: 5 }}
                                    required
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                />
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: "#142a3d",
                                        color: "white",
                                        borderRadius: 2,
                                        width: "200px",
                                        marginTop: 2
                                    }}>
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

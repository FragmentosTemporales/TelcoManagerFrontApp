import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    InputLabel,
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

export default function CreateTareaInterna() {
    const authState = useSelector((state) => state.auth);
    const { proyecto_id } = useParams();
    const { token, user_id, area } = authState;
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
            const response = await getUsuariosByArea(token, area.areaID);
            setUsuarios(response);
            console.log("Usuarios fetched:", response);
        } catch (error) {
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
            const response = await crearTareaProyectoInterno(formDataTarea, token);
            setMessage("Tarea creada exitosamente.");
            setAlertType("success");
            setOpen(true);
            setTimeout(() => {
                navigate("/modulo:proyecto-interno");
            }, 3000);
        } catch (error) {
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
                        Crear tarea
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />

                    <Box sx={{ paddingX: 3, paddingBottom: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                <TextField
                                    label="Titulo de la Tarea"
                                    variant="standard"
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "400px", lg: "400px" } }}
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
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "400px", lg: "400px" } }}
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
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "400px", lg: "400px" } }}
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
                                    sx={{ marginBottom: 2, width: { xs: "100%", sm: "500px", lg: "700px" } }}
                                    inputProps={{ maxLength: 249, minLength: 5 }}
                                    required
                                    name="descripcion"
                                    value={formDataTarea.descripcion}
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


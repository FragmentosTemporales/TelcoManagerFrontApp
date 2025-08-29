import {
    Alert,
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    InputLabel,
    MenuItem,
    TextField,
    LinearProgress,
    Select,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadConsumosOnnet } from "../api/onnetAPI";
import { getUsuariosByArea } from "../api/proyectos_internos_api";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { Margin } from "@mui/icons-material";

export default function LoadPlantillaOnnet() {
    const { plantilla_tipo } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);

    const [form, setForm] = useState({
        file: null,
        proyecto: "",
        supervisor_id: ""
    });

    const [titulo, setTitulo] = useState("");

    const [supervisores, setSupervisores] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (e) => {
        setForm({
            ...form,
            file: e.target.files[0],
        });
    };

    const clearForm = () => {
        setForm({
            file: null,
            proyecto: "",
            supervisor_id: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        if (form.file) {
            formData.append("file", form.file);
        }
        formData.append("proyecto", form.proyecto);
        formData.append("supervisor_id", form.supervisor_id);
        try {

            const response = await loadConsumosOnnet(
                formData,
                plantilla_tipo
            );
            clearForm();
            setAlertType("success");
            setMessage(response.message);
            setOpen(true);

        } catch (error) {
            // Manejo de error específico si el archivo está abierto por otro proceso
            let errorMsg = error?.message || error;
            if (
                typeof errorMsg === "string" &&
                (errorMsg.includes("used by another process") ||
                    errorMsg.includes("no se puede obtener acceso al archivo") ||
                    errorMsg.includes("Failed to load"))
            ) {
                errorMsg =
                    "No se pudo cargar el archivo porque está abierto en otra aplicación. Por favor, cierre el archivo e intente nuevamente.";
            }
            setMessage(errorMsg);
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const setIngresoOpciones = () => {
        if (plantilla_tipo && plantilla_tipo != "") {
            switch (plantilla_tipo) {
                case "cubicado_onnet":
                    setTitulo("Carga de Cubicado Onnet");
                    break;
                case "cubicado_telefonica":
                    setTitulo("Carga de Cubicado Telefonica");
                    break;
                case "ejecutado_onnet":
                    setTitulo("Carga de Ejecutado Onnet");
                    break;
                case "ejecutado_telefonica":
                    setTitulo("Carga de Ejecutado Telefonica");
                    break;

                default:
                    console.log("contacto no reconocido");
                    break;
            }
        } else {
            console.log("No hay submotivos disponible");
        }
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
    const primaryBtn = {
        background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
        color: "#fff",
        fontWeight: "bold",
        borderRadius: 2,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        "&:hover": { background: palette.primaryDark },
    };

    const fetchSupervisores = async () => {
        try {
            const response = await getUsuariosByArea(8);
            setSupervisores(response);
            console.log(response)
        } catch (error) {
            console.error("Error fetching supervisors:", error);
        }
    };

    useEffect(() => {
        setIngresoOpciones();
        fetchSupervisores();
    }, [plantilla_tipo]);


    const componente_carga = () => (
        <Card sx={{ ...glass }}>
            <CardHeader
                titleTypographyProps={{ fontSize: 18, fontWeight: "bold" }}
                title="Carga de Planilla"
                sx={{
                    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
                    color: "#fff",
                    py: 1.5,
                    textAlign: "center",
                }}
            />
            <CardContent sx={{ pt: 3 }}>
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    style={{ width: "100%" }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box>
                            <InputLabel id="file-label">Supervisor</InputLabel>
                            <Select
                                required
                                variant="standard"
                                value={form.supervisor_id}
                                onChange={(e) => setForm({ ...form, supervisor_id: e.target.value })}
                                sx={{ width: "100%" }}
                            >
                                {supervisores.map((supervisor, index) => (
                                    <MenuItem key={index} value={supervisor.value}>
                                        {supervisor.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <InputLabel id="file-label">Proyecto</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="proyecto"
                                type="text"
                                name="proyecto"
                                variant="standard"
                                value={form.proyecto}
                                onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
                            />
                        </Box>
                        <Box>
                            <InputLabel id="file-label">Archivo</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="file"
                                type="file"
                                name="file"
                                variant="standard"
                                onChange={handleFileChange}
                                inputProps={{ accept: ".xlsx,.xls,.csv" }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ ...primaryBtn, py: 1.2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Procesando..." : "Cargar"}
                            </Button>
                            {isSubmitting && <LinearProgress />}
                        </Box>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );

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
                    title={titulo}
                    subtitle="Elige tu supervisor, proyecto y carga tu plantilla."
                />
                <Box sx={{ width: '100%', maxWidth: 700, p: 2 }}>
                    {componente_carga()}
                </Box>
            </Box>
        </MainLayout>
    );
}


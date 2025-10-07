import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Modal,
    Table,
    TableHead,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
    TextField,
    Typography,
    Paper,
    Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { 
    getZonaItoTecnico, 
    createZonaCalidad, 
    createTecnicoCalidad, 
    createTipoFaltaCalidad, 
    createTipoInspeccionCalidad 
} from "../api/calidadAPI";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { MainLayout } from "./Layout";

export default function ReparacionesInfoEdit() {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formToSend, setFormToSend] = useState({}); // Datos del formulario a enviar

    const [zonas, setZonas] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [inspecciones, setInspecciones] = useState([]);
    const [formulario, setFormulario] = useState("ZONA"); // "ZONA", "TECNICO"


    const fetchDataZonasItosTecnicos = async () => {
        setLoading(true);
        try {
            const response = await getZonaItoTecnico();
            setZonas(response.zonas || []);
            setTecnicos(response.tecnicos || []);
            setFaltas(response.tipo_faltas || []);
            setInspecciones(response.tipo_inspecciones || []);
        } catch (error) {
            console.error("Error fetching zonas, itos, tecnicos:", error);
            setMessage("Error cargando datos. Por favor, intenta de nuevo.");
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    const extractDate = (rawString) => {
        const normalized = rawString.replace(/(\.\d{3})\d+$/, "$1");
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return rawString; // fallback si el parse falla

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
    };

    const zonaHeaders = ["NOMBRE", "CREACIÓN"];
    const tecnicoHeaders = ["NOMBRE", "RUT", "ZONA", "CREACIÓN"];
    const inspeccionHeaders = ["DESCRIPCIÓN", "CREACIÓN"];

    const modalForm = () => {
        let formInModal = null;

        if (formulario === "ZONA") {
            formInModal = (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                            Crear Nueva Zona
                        </Typography>
                        <TextField
                            required
                            label="Nombre de la Zona"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, zona: e.target.value })}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: palette.primary,
                                width: '200px',
                                '&:hover': { backgroundColor: palette.primaryDark }
                            }}
                            size="small"
                            type="submit"
                        >
                            CREAR
                        </Button>
                    </Box>
                </form>
            );


        } else if (formulario === "TECNICO") {
            formInModal = (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                            Crear Nuevo Técnico
                        </Typography>
                        <TextField
                            required
                            label="Nombre del Técnico"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, nombre: e.target.value })}
                        />
                        <TextField
                            required
                            label="RUT del Técnico"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, rut: e.target.value })}
                        />
                        <Select
                            required
                            native
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, zona_id: e.target.value })}
                        >
                            <option value="" disabled selected>Selecciona una Zona</option>
                            {zonas.map((zona) => (
                                <option key={zona.id} value={zona.id}>{zona.zona}</option>
                            ))}
                        </Select>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: palette.primary,
                                width: '200px',
                                '&:hover': { backgroundColor: palette.primaryDark }
                            }}
                            size="small"
                            type="submit"
                        >
                            CREAR
                        </Button>
                    </Box>
                </form>
            );
        } else if (formulario === "TIPO_FALTA") {
            formInModal = (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                            Crear Nuevo Tipo de Falta
                        </Typography>
                        <TextField
                            required
                            label="Descripción de la Falta"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, descripcion: e.target.value })}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: palette.primary,
                                width: '200px',
                                '&:hover': { backgroundColor: palette.primaryDark }
                            }}
                            size="small"
                            type="submit"
                        >
                            CREAR
                        </Button>
                    </Box>
                </form>
            );
        } else if (formulario === "INSPECCION") {
            formInModal = (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                            Crear Nuevo Tipo de Inspección
                        </Typography>
                        <TextField
                            required
                            label="Descripción de la Inspección"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setFormToSend({ ...formToSend, descripcion: e.target.value })}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: palette.primary,
                                width: '200px',
                                '&:hover': { backgroundColor: palette.primaryDark }
                            }}
                            size="small"
                            type="submit"
                        >
                            CREAR
                        </Button>
                    </Box>
                </form>
            );
        }

        return (
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3
                }}>
                    {formInModal}
                </Box>
            </Modal>
        );
    }

    const handleClose = () => {
        setOpen(false);
        setOpenModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (formulario === "ZONA") {
                await createZonaCalidad(formToSend);
            } else if (formulario === "TECNICO") {
                await createTecnicoCalidad(formToSend);
            } else if (formulario === "TIPO_FALTA") {
                await createTipoFaltaCalidad(formToSend);
            } else if (formulario === "INSPECCION") {
                await createTipoInspeccionCalidad(formToSend);
            }
            setMessage("Creación exitosa.");
            setAlertType("success");
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            setMessage("Error en la creación. Por favor, intenta de nuevo.");
            setAlertType("error");
        } finally {
            setIsSubmitting(false);
            fetchDataZonasItosTecnicos();
            setFormToSend({});
            setOpenModal(false);
            setOpen(true);
        }
    };


    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataZonasItosTecnicos();
    }, []);

    return (
        <MainLayout>
            <Box
                sx={{
                    pt: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    background: palette.bgGradient,
                    minHeight: "80vh",
                    position: 'relative',
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
                        pointerEvents: 'none',
                    }
                }}
            >
                {modalForm()}
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{
                            width: "80%",
                            mb: 3,
                            boxShadow: 4,
                            borderRadius: 3,
                            background: palette.cardBg,
                            border: `1px solid ${palette.borderSubtle}`,
                        }}
                    >
                        {message}
                    </Alert>
                )}
                <ModuleHeader
                    title="Gestión de Información para Reparaciones"
                    subtitle="Gestiona Zonas, ITOs y Técnicos"
                    divider
                />
                {loading ? (
                    <Paper
                        elevation={8}
                        sx={{
                            background: 'rgba(255,255,255,0.92)',
                            height: '30vh',
                            width: '90%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            border: `1px solid ${palette.borderSubtle}`,
                            borderRadius: 3,
                            boxShadow: '0 10px 28px -8px rgba(0,0,0,0.45)',
                            backdropFilter: 'blur(6px) saturate(160%)'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, color: palette.primary, fontWeight: 600 }}>
                            Cargando recursos...
                        </Typography>
                        <CircularProgress />
                    </Paper>
                ) : (
                    <>
                        <Box sx={{ width: '90%', display: 'flex', flexDirection: 'column', gap: 4, mb: 4, justifyContent: 'center', alignItems: 'center' }}>

                            <Box sx={{ p: 3, background: palette.cardBg, borderRadius: 3, boxShadow: 4, width: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                                    Zonas
                                </Typography>
                                {zonas.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay zonas disponibles.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 360, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {zonaHeaders.map((h) => (
                                                        <TableCell key={h} sx={{
                                                            fontWeight: 600,
                                                            backgroundColor: palette.primary,
                                                            color: "white",
                                                            letterSpacing: 0.4,
                                                            borderBottom: `2px solid ${palette.primaryDark}`,
                                                        }}>
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {zonas.map((zona) => (
                                                    <TableRow key={zona.id}>
                                                        <TableCell>{zona.zona ?? "N/A"}</TableCell>
                                                        <TableCell>{extractDate(zona.fecha_registro) ?? "N/A"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setFormulario("ZONA");
                                        setFormToSend({});
                                    }}
                                    sx={{ background: palette.danger, width: '400px', fontWeight: 'bold', borderRadius: 3 }}>
                                    CREAR NUEVA ZONA
                                </Button>
                            </Box>

                            <Box sx={{ p: 3, background: palette.cardBg, borderRadius: 3, boxShadow: 4, width: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                                    Técnicos
                                </Typography>
                                {tecnicos.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay técnicos disponibles.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 360, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {tecnicoHeaders.map((h) => (
                                                        <TableCell key={h} sx={{
                                                            fontWeight: 600,
                                                            backgroundColor: palette.primary,
                                                            color: "white",
                                                            letterSpacing: 0.4,
                                                            borderBottom: `2px solid ${palette.primaryDark}`,
                                                        }}>
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tecnicos.map((tecnico) => (
                                                    <TableRow key={tecnico.id}>
                                                        <TableCell>{tecnico.nombre ?? "N/A"}</TableCell>
                                                        <TableCell>{tecnico.rut ?? "N/A"}</TableCell>
                                                        <TableCell>{tecnico.zona.zona ?? "N/A"}</TableCell>
                                                        <TableCell>{extractDate(tecnico.fecha_registro) ?? "N/A"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setFormulario("TECNICO");
                                        setFormToSend({});
                                    }}
                                    sx={{ background: palette.danger, width: '400px', fontWeight: 'bold', borderRadius: 3 }}>
                                    CREAR NUEVO TECNICO
                                </Button>
                            </Box>

                            <Box sx={{ p: 3, background: palette.cardBg, borderRadius: 3, boxShadow: 4, width: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                                    Tipo de Inspecciones
                                </Typography>
                                {inspecciones.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay tipos de inspecciones disponibles.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 360, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {inspeccionHeaders.map((h) => (
                                                        <TableCell key={h} sx={{
                                                            fontWeight: 600,
                                                            backgroundColor: palette.primary,
                                                            color: "white",
                                                            letterSpacing: 0.4,
                                                            borderBottom: `2px solid ${palette.primaryDark}`,
                                                        }}>
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inspecciones.map((inspeccion) => (
                                                    <TableRow key={inspeccion.id}>
                                                        <TableCell>{inspeccion.descripcion ?? "N/A"}</TableCell>
                                                        <TableCell>{extractDate(inspeccion.fecha_registro) ?? "N/A"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setFormulario("INSPECCION");
                                        setFormToSend({});
                                    }}
                                    sx={{ background: palette.danger, width: '400px', fontWeight: 'bold', borderRadius: 3 }}>
                                    CREAR NUEVO TIPO DE INSPECCION
                                </Button>
                            </Box>

                            <Box sx={{ p: 3, background: palette.cardBg, borderRadius: 3, boxShadow: 4, width: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                                    Tipo de Faltas
                                </Typography>
                                {faltas.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay tipos de faltas disponibles.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 360, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {inspeccionHeaders.map((h) => (
                                                        <TableCell key={h} sx={{
                                                            fontWeight: 600,
                                                            backgroundColor: palette.primary,
                                                            color: "white",
                                                            letterSpacing: 0.4,
                                                            borderBottom: `2px solid ${palette.primaryDark}`,
                                                        }}>
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {faltas.map((falta) => (
                                                    <TableRow key={falta.id}>
                                                        <TableCell>{falta.descripcion ?? "N/A"}</TableCell>
                                                        <TableCell>{extractDate(falta.fecha_registro) ?? "N/A"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setFormulario("TIPO_FALTA");
                                        setFormToSend({});
                                    }}
                                    sx={{ background: palette.danger, width: '400px', fontWeight: 'bold', borderRadius: 3 }}>
                                    CREAR NUEVO TIPO DE  FALTA
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </MainLayout>
    );
}

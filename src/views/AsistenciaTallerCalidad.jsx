import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Modal,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Chip,
    Typography,
    Fade,
    Select,
    Skeleton,
    TextField,
    Tooltip,
    Autocomplete,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getCursosAsignados,
    getInscritosCurso,
    updateTecnicoInscritoCurso
} from "../api/calidadAPI";
import { extractDateOnly } from "../helpers/main";


export default function AsistenciaTallerCalidadView() {
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [loadingInscritos, setLoadingInscritos] = useState(false);
    const [cursosAsignados, setCursosAsignados] = useState([]);
    const [inscritosCurso, setInscritosCurso] = useState([]);

    const [seleccionado, setSeleccionado] = useState(null);

    const [formulario, setFormulario] = useState([]);


    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCursosAsignados();
    }, []);

    useEffect(() => {   
        console.log(inscritosCurso);
    }, [inscritosCurso]);

    const opcionesAsistencia = [
        { label: "Sin registrar", value: "Pendiente" },
        { label: "Asistió", value: "Asistió" },
        { label: "No asistió", value: "No asistió" },
    ];

    const handleClose = () => {
        setOpen(false);
    };

    const fetchCursosAsignados = async () => {
        try {
            setLoading(true);
            const data = await getCursosAsignados();
            setCursosAsignados(data);
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || String(error));
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchInscritosCurso = async (cursoId) => {
        try {
            setLoadingInscritos(true);
            const data = await getInscritosCurso(cursoId);
            setInscritosCurso(data);
            setFormulario(data.map(inscrito => ({
                id: inscrito.id,
                asistencia: inscrito.asistencia || ""
            })));
        }
        catch (error) {
            setAlertType("error");
            setMessage(error?.message || String(error));
            setOpen(true);
        }
        finally {
            setLoadingInscritos(false);
        }
    };

    const updateAsistencia = async () => {
        try {

            for (const item of formulario) {
                await updateTecnicoInscritoCurso(item.id, item);
            }
            setAlertType("success");
            setMessage("Asistencia actualizada correctamente.");
            setOpen(true);
            fetchInscritosCurso(seleccionado.id_curso);
        }
        catch (error) {
            setAlertType("error");
            setMessage(error?.message || String(error));
            setOpen(true);
        }

    };

    useEffect(() => {
        if (seleccionado) {
            fetchInscritosCurso(seleccionado.id_curso);
        }
    }, [seleccionado]);


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
                    title="Asistencia a Talleres de Calidad"
                    subtitle="Gestiona la asistencia a los talleres de calidad."
                />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid
                        container
                        rowSpacing={{ xs: 5, sm: 6, md: 7 }}
                        columnSpacing={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 1320, lg: 1460, xl: 1600 },
                            mb: 4,
                            transition: 'max-width .4s ease'
                        }}
                        alignItems="stretch"
                    >
                        {cursosAsignados.map((curso, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                                <Paper
                                    elevation={10}
                                    sx={{
                                        textDecoration: "none",
                                        minHeight: "70%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        p: 1.5,
                                        borderRadius: 1,
                                        background: palette.cardBg,
                                        border: `1px solid ${palette.borderSubtle}`,
                                        backdropFilter: "blur(4px)",
                                        transition: "all .35s",
                                        overflow: "hidden",
                                        willChange: "transform, box-shadow",
                                        transformOrigin: "top center",
                                        mt: 0.5,
                                        pointerEvents: "auto",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                                            borderColor: palette.primary,
                                        },
                                    }}

                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                color: palette.primary,
                                            }}
                                        >
                                            {curso.nombre_zona}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: palette.primary,
                                                mb: 0.5,
                                            }}
                                        >
                                            {curso.nombre_curso}
                                        </Typography>
                                        <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: palette.textMuted, fontSize: "0.85rem", mb: 0.5 }}
                                        >
                                            {curso.descripcion_curso}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: palette.primary, fontSize: "0.85rem" }}
                                        >
                                            Fecha: {extractDateOnly(curso.fecha_curso)}
                                        </Typography>

                                        <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                                        <Box
                                            onClick={() => setSeleccionado(curso)}
                                            sx={{ display: 'flex', gap: 1 }}>

                                            <Button variant="text" >GESTIONAR</Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )
                }

                {seleccionado && !loadingInscritos && (
                    <Paper
                        elevation={10}
                        sx={{
                            textDecoration: "none",
                            minHeight: "70%",
                            minWidth: "90%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "relative",
                            p: 1.5,
                            borderRadius: 1,
                            background: palette.cardBg,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: "blur(4px)",
                            transition: "all .35s",
                            overflow: "hidden",
                            willChange: "transform, box-shadow",
                            transformOrigin: "top center",
                            mt: 0.5
                        }}
                    >

                        <Box>
                            <Button
                                variant="text"
                                onClick={() => setSeleccionado(null)}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    borderRadius: "50%",
                                    minWidth: 32,
                                    width: 32,
                                }}
                            >
                                x
                            </Button>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary }}>
                                {seleccionado.nombre_curso}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, color: palette.textMuted }}>
                                {seleccionado.nombre_zona}
                            </Typography>
                        </Box>

                        <Box>
                            {inscritosCurso.length === 0 ? (
                                <Typography variant="body1" sx={{ color: palette.textMuted }}>
                                    No hay inscritos para este curso.
                                </Typography>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: palette.primaryDark }}>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >NOMBRE</TableCell>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >RUT</TableCell>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >CARGO</TableCell>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >ASISTENCIA</TableCell>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >GESTIONAR</TableCell>
                                            <TableCell sx={{ color: palette.accentSoft, fontWeight: 'bold' }} >OBSERVACIONES</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {inscritosCurso.map((inscrito, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{inscrito.nombre}</TableCell>
                                                <TableCell>{inscrito.rut}</TableCell>
                                                <TableCell>{inscrito.cargo}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={inscrito.asistencia}
                                                        color={inscrito.asistencia === "Asistió" ? "success" : inscrito.asistencia === "No asistió" ? "error" : "warning"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={formulario.find((item) => item.id === inscrito.id)?.asistencia || ""}
                                                        disabled ={inscrito.asistencia !== "Pendiente"}
                                                        onChange={(event) => {
                                                            const nuevaAsistencia = event.target.value;
                                                            setFormulario((prevFormulario) =>
                                                                prevFormulario.map((item) =>
                                                                    item.id === inscrito.id
                                                                        ? { ...item, asistencia: nuevaAsistencia }
                                                                        : item
                                                                )
                                                            );
                                                            }}
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ minWidth: 120 }}
                                                    >
                                                        {opcionesAsistencia.map((opcion) => (
                                                            <MenuItem key={opcion.value} value={opcion.value}>
                                                                {opcion.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={formulario.find((item) => item.id === inscrito.id)?.observacion || inscritosCurso.find((item) => item.id === inscrito.id)?.observacion || ""}
                                                        disabled={inscrito.asistencia !== "Pendiente"}
                                                        onChange={(event) => {
                                                            const nuevasObservaciones = event.target.value;
                                                            setFormulario((prevFormulario) =>
                                                                prevFormulario.map((item) =>
                                                                    item.id === inscrito.id
                                                                        ? { ...item, observacion: nuevasObservaciones }
                                                                        : item
                                                                )
                                                            );
                                                        }
                                                        }                                                        
                                                        size="small"
                                                        variant="standard"
                                                        fullWidth
                                                        placeholder="Agregar observación"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            <Divider sx={{ my: 2, borderColor: palette.borderSubtle }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    onClick={() => updateAsistencia()}
                                    sx={{background: palette.primaryDark}}
                                    >
                                    Guardar Cambios
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>

        </MainLayout>
    );
}

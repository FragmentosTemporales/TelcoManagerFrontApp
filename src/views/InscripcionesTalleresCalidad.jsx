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
    createInscripcionTecnico,
    getCursosActivos,
    getTecnicos,
    getInscritosCurso
} from "../api/calidadAPI";
import { extractDateOnly } from "../helpers/main";


export default function InscripcionTalleresCalidadView() {
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [dataCursos, setDataCursos] = useState([]);
    const [dataTecnicos, setDataTecnicos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalInscritos, setOpenModalInscritos] = useState(false);
    const [inscritosCurso, setInscritosCurso] = useState([]);

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormInscripcion({
            curso_agendado_id: "",
            tecnico_id: "",
        });
        setCursoSeleccionado(null);
    };

    const [formInscripcion, setFormInscripcion] = useState({
        curso_agendado_id: "",
        tecnico_id: "",
    });

    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [searchZona, setSearchZona] = useState(null);

    const zonasUnicas = [...new Set(dataCursos.map((c) => c.zona).filter(Boolean))];

    const cursosFiltrados = searchZona
        ? dataCursos.filter((curso) => curso.zona === searchZona)
        : dataCursos;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseModalInscritos = () => {
        setOpenModalInscritos(false);
    }

    const onSubmitDetalles = async (curso_id) => {
        setLoading(true);
        setInscritosCurso([]);
        try {
            const inscritos = await getInscritosCurso(curso_id);
            setInscritosCurso(inscritos);
        } catch (error) {
            setAlertType("error");
            setMessage(error);
            setOpen(true);
        }
        setLoading(false);
    };

    const onSubmitInscripcion = async () => {
        setLoading(true);
        try {
            await createInscripcionTecnico(formInscripcion);
            setAlertType("success");
            setMessage("Técnico inscrito exitosamente al taller.");
            setOpen(true);
            handleCloseModal();
            fetchDataCursos();
        } catch (error) {
            setAlertType("error");
            setMessage(error);
            setOpen(true);
        }
        setLoading(false);
    };

    const fetchDataCursos = async () => {
        setLoading(true);
        try {
            const cursos = await getCursosActivos();
            setDataCursos(cursos);
            const tecnicos = await getTecnicos();
            setDataTecnicos(tecnicos.sort((a, b) => a.nombre.localeCompare(b.nombre)));
        } catch (error) {
            setAlertType("error");
            setMessage(error);
            setOpen(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDataCursos();
    }, []);


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
                    title="Inscripción a Talleres de Calidad"
                    subtitle="Gestiona las inscripciones a los talleres de calidad."
                />


                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 700,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <Typography variant="body1" component="h2" sx={{ fontWeight: 600, color: palette.primary }}>
                                {cursoSeleccionado ? cursoSeleccionado.zona : ""}
                            </Typography>
                            <Typography variant="h6" component="h2" sx={{ mb: 1, color: palette.textMuted }}>
                                {cursoSeleccionado ? cursoSeleccionado.curso : ""}
                            </Typography>

                            <Divider sx={{ width: '100%', mb: 2 }} />

                            <Box sx={{ display: 'flex', py: 1, mb: 2, width: '80%' }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    disabled={
                                        loading || (cursoSeleccionado && cursoSeleccionado.inscritos >= 3)
                                    }
                                    options={dataTecnicos}
                                    getOptionLabel={(option) => `${option.nombre} (${option.rut})`}
                                    value={dataTecnicos.find(t => t.id === formInscripcion.tecnico_id) || null}
                                    onChange={(event, newValue) => {
                                        setFormInscripcion({ ...formInscripcion, tecnico_id: newValue ? newValue.id : "" });
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Selecciona un técnico" variant="outlined" />}
                                />
                            </Box>

                            {cursoSeleccionado && cursoSeleccionado.inscritos >= 3 && (
                                <Typography variant="body2" sx={{ mb: 1, color: palette.textMuted }}>
                                    **El curso ha alcanzado el número máximo de inscritos.
                                </Typography>)}

                            <Box sx={{ display: 'flex', gap: 2, width: '80%', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    onClick={onSubmitInscripcion}
                                    disabled={loading || cursoSeleccionado?.inscritos >= 3}
                                    sx={{ background: palette.primaryDark, width: "200px" }}>
                                    CONFIRMAR
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ width: "200px" }}>
                                    CANCELAR
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <Modal
                    open={openModalInscritos}
                    onClose={handleCloseModalInscritos}
                    closeAfterTransition
                    BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModalInscritos}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "70%",
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" component="h2" sx={{ mb: 2, color: palette.primary }}>
                                Técnicos Inscritos
                            </Typography>

                            {inscritosCurso.length > 0 ? (
                                <Table sx={{ width: '100%' }}>
                                    <TableHead size="small">
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>RUT</TableCell>
                                            <TableCell>CARGO</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody size="small">
                                        {inscritosCurso.map((inscrito, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{inscrito.nombre}</TableCell>
                                                <TableCell>{inscrito.rut}</TableCell>
                                                <TableCell>{inscrito.cargo}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography variant="body2" sx={{ color: palette.textMuted }}>
                                    No hay técnicos inscritos en este curso.
                                </Typography>
                            )}
                        </Box>
                    </Fade>
                </Modal>

                <Box sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column', alignItems: 'center', backgroundColor: palette.cardBg, borderRadius: 2, p: 1, mb: 2
                }}>
                    <Autocomplete
                        size="small"
                        options={zonasUnicas}
                        value={searchZona}
                        onChange={(e, newValue) => setSearchZona(newValue)}
                        renderInput={(params) => <TextField {...params} label="Filtrar por zona" variant="outlined" />}
                        sx={{ width: 300 }}
                    />
                </Box>

                {cursosFiltrados && cursosFiltrados.length > 0 ? (
                    <Grid
                        container
                        rowSpacing={{ xs: 5, sm: 6, md: 7 }}
                        columnSpacing={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 1320, lg: 1460, xl: 1600 },
                            mb: 14,
                            transition: 'max-width .4s ease'
                        }}
                        alignItems="stretch"
                    >
                        {cursosFiltrados.map((curso, index) => (
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
                                            {curso.zona}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: palette.primary,
                                                mb: 0.5,
                                            }}
                                        >
                                            {curso.curso}
                                        </Typography>
                                        <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: palette.textMuted, fontSize: "0.85rem", mb: 0.5 }}
                                        >
                                            {curso.descripcion}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: palette.primary, fontSize: "0.85rem" }}
                                        >
                                            Fecha: {extractDateOnly(curso.fecha_curso)}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: palette.primary, fontSize: "0.85rem" }}
                                        >
                                            Relator: {curso.relator}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: palette.primary, fontSize: "0.85rem", fontWeight: 600 }}
                                        >

                                            Inscritos:
                                        </Typography>
                                        <Chip
                                            label={curso.inscritos}
                                            size="small"
                                            sx={{
                                                backgroundColor: curso.inscritos === 3 ? "#4caf50" : curso.inscritos < 3 ? "#ffca28" : "#ff2100",
                                                color: "#fff",
                                                mb: 1.5
                                            }}
                                        />
                                        <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                onClick={() => {
                                                    setCursoSeleccionado(curso);
                                                    setFormInscripcion({ ...formInscripcion, curso_agendado_id: curso.id_curso_agendado });
                                                    setOpenModal(true);
                                                }}
                                                variant="text" >INSCRIBIR</Button>

                                            <Button
                                                onClick={() => {
                                                    onSubmitDetalles(curso.id_curso_agendado);
                                                    setOpenModalInscritos(true);
                                                }}
                                                variant="text" >DETALLES</Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper
                        elevation={6}
                        sx={{
                            px: 5,
                            py: 6,
                            borderRadius: 4,
                            background: palette.cardBg,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: "blur(4px)",
                            textAlign: "center",
                            maxWidth: 520,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary }}>
                            Sin cursos disponibles
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1.5, color: palette.textMuted }}>
                            No se encontraron cursos asociados a tus permisos. Contacta a un administrador si esto es un error.
                        </Typography>
                    </Paper>
                )}
            </Box>

        </MainLayout>
    );
}

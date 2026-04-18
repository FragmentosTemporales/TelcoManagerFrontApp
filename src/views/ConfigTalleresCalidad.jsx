import {
    Alert,
    Box,
    Button,
    Divider,
    LinearProgress,
    Modal,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Fade,
    Input,
    Select,
    Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getListaRelatoresTallerCalidad,
    getListaZonasTallerCalidad,
    getListaCursosCalidad,
    getTop20CursosAgendados,
    createZonaTallerCalidad,
    createRelatorTallerCalidad,
    createCursoCalidad,
    agendarCursoCalidad,
    updateRelatorTallerCalidad,
    updateZonaTallerCalidad,
    updateCursoCalidad,
    updateEstadoCursoCalidad
} from "../api/calidadAPI";
import { extractDateOnly } from "../helpers/main";

export default function ConfigTalleresCalidad() {
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalHabilitado, setOpenModalHabilitado] = useState(false);
    const [openModalUpdateCurso, setOpenModalUpdateCurso] = useState(false);

    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState("");
    const [payloadForm, setPayloadForm] = useState({});

    const [relatores, setRelatores] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [avance, setAvance] = useState(0);
    const [top20CursosAgendados, setTop20CursosAgendados] = useState([]);

    const [habilitado, setHabilitado] = useState("HABILITAR");

    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenModalUpdate(false);
        setOpenModalHabilitado(false);
        setOpenModalUpdateCurso(false);
    };

    const onSubmitUpdateCurso = async () => {
        try {
            setLoading(true);
            await updateEstadoCursoCalidad(cursoSeleccionado);
            setMessage("Curso finalizado exitosamente.");
            handleCloseModal();
            setAlertType("success");
            setMessage("Curso finalizado exitosamente.");
        } catch (error) {
            setAlertType("error");
            setMessage(error);
        }
        loadData();
        setOpen(true);
    };

    const fetchZonas = async () => {
        try {
            const zonasData = await getListaZonasTallerCalidad();
            setZonas(zonasData);
            setAvance(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching zonas:", error);
        }
    };

    const fetchRelatores = async () => {
        try {
            const relatoresData = await getListaRelatoresTallerCalidad(0);
            setRelatores(relatoresData);
            setAvance(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching relatores:", error);
        }
    };

    const fetchCursos = async () => {
        try {
            const cursosData = await getListaCursosCalidad();
            setCursos(cursosData);
            setAvance(prev => prev + 1);
        }
        catch (error) {
            console.error("Error fetching cursos:", error);
        }
    };

    const fetchTop20CursosAgendados = async () => {
        try {
            const top20Data = await getTop20CursosAgendados();
            setTop20CursosAgendados(top20Data);
            setAvance(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching top 20 cursos agendados:", error);
        }
    };

    const onSubmitCreate = async () => {
        try {
            setLoading(true);
            setAvance(0);
            if (form === "zona") {
                await createZonaTallerCalidad(payloadForm);
                setMessage("Zona creada exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Zona creada exitosamente.");
            }
            else if (form === "relator") {
                await createRelatorTallerCalidad(payloadForm);
                setMessage("Relator creado exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Relator creado exitosamente.");
            }
            else if (form === "curso") {
                await createCursoCalidad(payloadForm);
                setMessage("Curso creado exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Curso creado exitosamente.");
            }
            else if (form === "curso_agendado") {
                await agendarCursoCalidad(payloadForm);
                setMessage("Curso agendado exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Curso agendado exitosamente.");
            }

        } catch (error) {
            setAlertType("error");
            setMessage(error);
        }
        loadData();
        setOpen(true);
    };

    const onSubmitUpdate = async () => {
        try {
            setLoading(true);
            setAvance(0);
            if (form === "zona") {
                await updateZonaTallerCalidad(payloadForm.id, payloadForm);
                setMessage("Zona actualizada exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Zona actualizada exitosamente.");
            }
            else if (form === "relator") {
                await updateRelatorTallerCalidad(payloadForm.id, payloadForm);
                setMessage("Relator actualizado exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Relator actualizado exitosamente.");
            }
            else if (form === "curso") {
                await updateCursoCalidad(payloadForm.id, payloadForm);
                setMessage("Curso actualizado exitosamente.");
                handleCloseModal();
                setAlertType("success");
                setMessage("Curso actualizado exitosamente.");
            }

        } catch (error) {
            setAlertType("error");
            setMessage(error);
        }
        loadData();
        setOpen(true);
    };

    const formZona = () => (
        <>
            <Input
                placeholder="Nombre Zona"
                size="small"
                name="nombre"
                value={payloadForm.nombre || ""}
                fullWidth sx={{ mt: 2 }}
                onChange={(e) => setPayloadForm({ ...payloadForm, nombre: e.target.value })}
            />
        </>
    )

    const formRelator = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Input
                placeholder="Nombre Relator"
                size="small"
                name="nombre"
                value={payloadForm.nombre || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, nombre: e.target.value })}
            />
            <Input
                placeholder="RUT Relator"
                size="small"
                name="rut"
                value={payloadForm.rut || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, rut: e.target.value })}
                sx={{ mt: 2 }}
            />
            <Select
                native
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                variant="standard"
                value={payloadForm.zona_id || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, zona_id: e.target.value })}
            >
                <option value="" disabled>
                    Selecciona una zona
                </option>
                {zonas.filter((zona) => zona.habilitado).map((zona) => (
                    <option key={zona.id} value={zona.id}>
                        {zona.nombre}
                    </option>
                ))}
            </Select>
        </Box>
    )

    const formCurso = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Input
                placeholder="Nombre Curso"
                size="small"
                name="nombre"
                value={payloadForm.nombre || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, nombre: e.target.value })}
            />
            <Input
                placeholder="Descripción Curso"
                size="small"
                name="descripcion"
                value={payloadForm.descripcion || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, descripcion: e.target.value })}
                sx={{ mt: 2 }}
            />
        </Box>
    )

    const formCursoAgendado = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Select
                native
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                variant="standard"
                value={payloadForm.zona_id || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, zona_id: e.target.value, relator_id: "" })}
            >
                <option value="" disabled>
                    Selecciona una zona
                </option>
                {zonas.filter((zona) => zona.habilitado).map((zona) => (
                    <option key={zona.id} value={zona.id}>
                        {zona.nombre}
                    </option>
                ))}
            </Select>
            <Select
                native
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                variant="standard"
                value={payloadForm.curso_id || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, curso_id: e.target.value })}
            >
                <option value="" disabled>
                    Selecciona un curso
                </option>
                {cursos.filter((curso) => curso.habilitado).map((curso) => (
                    <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                    </option>
                ))}
            </Select>
            <Select
                native
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                variant="standard"
                disabled={!payloadForm.zona_id}
                value={payloadForm.relator_id || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, relator_id: e.target.value })}
            >
                <option value="" disabled>
                    Selecciona un relator
                </option>
                {relatores
                    .map((relator) => (
                        <option key={relator.id} value={relator.id}>
                            {relator.nombre}
                        </option>
                    ))}
            </Select>
            <Input
                placeholder="Fecha del Curso (YYYY-MM-DD)"
                size="small"
                name="fecha"
                type="date"
                value={payloadForm.fecha || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, fecha: e.target.value })}
                sx={{ mt: 2 }}
            />
            <Input
                placeholder="Hora del Curso (HH:MM)"
                size="small"
                name="horario"
                type="time"
                value={payloadForm.horario || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, horario: e.target.value })}
                sx={{ mt: 2 }}
            />
            <Input
                placeholder="Sala"
                size="small"
                name="sala"
                value={payloadForm.sala || ""}
                onChange={(e) => setPayloadForm({ ...payloadForm, sala: e.target.value })}
                sx={{ mt: 2 }}
            />
        </Box>
    )

    const loadData = async () => {
        await fetchZonas();
        await fetchRelatores();
        await fetchCursos();
        await fetchTop20CursosAgendados();
    };


    const formSetter = (formName) => {
        if (formName === "zona") {
            return formZona();
        }
        else if (formName === "relator") {
            return formRelator();
        }
        else if (formName === "curso") {
            return formCurso();
        }
        else if (formName === "curso_agendado") {
            return formCursoAgendado();
        }
        else {
            return null;
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (avance >= 4) {
            setLoading(false);
        }
    }, [avance]);

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
                    title="Configuración Talleres de Calidad"
                    subtitle="Gestiona la información relacionada a Talleres de Calidad."
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
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{ mb: 2, fontWeight: 600 }}
                                disabled={loading}>
                                CREAR {form === "zona" ? "ZONA" : form === "relator" ? "RELATOR" : form === "curso" ? "CURSO" : "CURSO AGENDADO"}
                            </Typography>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            <Box sx={{ display: 'flex', py: 1, mb: 2, width: '80%' }}>
                                {formSetter(form)}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, width: '80%', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        onSubmitCreate()
                                    }}
                                    sx={{ background: palette.primaryDark, width: "200px" }}>
                                    CREAR
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ width: "200px" }}>
                                    CANCELAR
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <Modal
                    open={openModalUpdate}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModalUpdate}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 700,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                ACTUALIZAR {form === "zona" ? "ZONA" : form === "relator" ? "RELATOR" : form === "curso" ? "CURSO" : "CURSO AGENDADO"}
                            </Typography>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            <Box sx={{ display: 'flex', py: 1, mb: 2, width: '80%' }}>
                                {formSetter(form)}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, width: '80%', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={() => {
                                        onSubmitUpdate()
                                    }}
                                    sx={{ background: palette.primaryDark, width: "200px" }}>
                                    ACTUALIZAR
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ width: "200px" }}>
                                    CANCELAR
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <Modal
                    open={openModalHabilitado}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModalHabilitado}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 700,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                {habilitado} {form === "zona" ? "ZONA" : form === "relator" ? "RELATOR" : form === "curso" ? "CURSO" : "CURSO AGENDADO"}
                            </Typography>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            <Box sx={{ display: 'flex', gap: 2, width: '80%', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        onSubmitUpdate()
                                    }}
                                    sx={{ background: palette.primaryDark, width: "200px" }}
                                    disabled={loading}>
                                    {habilitado}
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ width: "200px" }}>
                                    CANCELAR
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <Modal
                    open={openModalUpdateCurso}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModalUpdateCurso}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 700,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                ¿DESEA FINALIZAR EL CURSO SELECCIONADO?
                            </Typography>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            <Box sx={{ display: 'flex', gap: 2, width: '80%', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        onSubmitUpdateCurso()
                                    }}
                                    sx={{ background: palette.primaryDark, width: "200px" }}>
                                    FINALIZAR
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ width: "200px" }}>
                                    CANCELAR
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

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
                        <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 600 }}>
                            Estamos recopilando la información necesaria
                        </Typography>
                        <Box sx={{ width: '80%', mb: 3 }}>
                            <LinearProgress
                                variant="determinate"
                                value={(avance / 4) * 100}
                                sx={{ height: 10, borderRadius: 5, mb: 3 }}
                            />
                            <Stepper activeStep={avance} alternativeLabel>
                                <Step completed={avance > 0}>
                                    <StepLabel>Zonas</StepLabel>
                                </Step>
                                <Step completed={avance > 1}>
                                    <StepLabel>Relatores</StepLabel>
                                </Step>
                                <Step completed={avance > 2}>
                                    <StepLabel>Cursos</StepLabel>
                                </Step>
                                <Step completed={avance > 3}>
                                    <StepLabel>Cursos Agendados</StepLabel>
                                </Step>
                            </Stepper>
                        </Box>
                    </Paper>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ color: palette.accentSoft, fontWeight: 600, textAlign: 'left', width: '90%', my: 2 }}>
                            Zonas Registradas
                        </Typography>
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="error"
                                sx={{
                                    alignSelf: 'flex-start',
                                    width: '200px'
                                }}
                                onClick={() => {
                                    setForm("zona")
                                    setPayloadForm({})
                                    setOpenModal(true)
                                }}
                            >
                                Agregar Zona
                            </Button>
                        </Box>
                        <Divider sx={{ width: '90%', my: 1, background: palette.borderSubtle }} />
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: palette.cardBg,
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                            mb: 4
                        }}>
                            <Table>
                                <TableHead sx={{ background: palette.primary }}>
                                    <TableRow>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            NOMBRE
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ESTADO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ACCIONES
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {zonas.map((zona, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body1" sx={{ color: palette.textPrimary }}>
                                                    {zona.nombre}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Chip index={index} label={zona.habilitado === true ? "Habilitada" : zona.habilitado === false ? "No Habilitada" : "Sin estado"} color={zona.habilitado === true ? "success" : zona.habilitado === false ? "error" : "default"} size="small" />
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    sx={{ color: palette.textSecondary, width: "120px" }}
                                                    onClick={() => {
                                                        setForm("zona")
                                                        setPayloadForm({
                                                            id: zona.id,
                                                            nombre: zona.nombre,
                                                            habilitado: zona.habilitado
                                                        })
                                                        setOpenModalUpdate(true)
                                                    }}
                                                >
                                                    EDITAR
                                                </Button>
                                                {zona.habilitado && zona.habilitado == 1 ? (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => {
                                                            setPayloadForm({
                                                                id: zona.id,
                                                                nombre: zona.nombre,
                                                                habilitado: false
                                                            })
                                                            setHabilitado("INHABILITAR")
                                                            setForm("zona")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}>
                                                        INHABILITAR
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => {
                                                            setPayloadForm({
                                                                id: zona.id,
                                                                nombre: zona.nombre,
                                                                habilitado: true
                                                            })
                                                            setHabilitado("HABILITAR")
                                                            setForm("zona")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}>
                                                        HABILITAR
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Typography variant="h6" sx={{ color: palette.accentSoft, fontWeight: 600, textAlign: 'left', width: '90%', my: 2 }}>
                            Relatores Registrados
                        </Typography>
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => {
                                    setForm("relator")
                                    setPayloadForm({})
                                    setOpenModal(true)
                                }}
                                sx={{ alignSelf: 'flex-start', width: '200px' }}>
                                Agregar Relator
                            </Button>
                        </Box>
                        <Divider sx={{ width: '90%', my: 1, background: palette.borderSubtle }} />
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: palette.cardBg,
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                            mb: 4
                        }}>
                            <Table>
                                <TableHead sx={{ background: palette.primary }}>
                                    <TableRow>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            NOMBRE
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            RUT
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ZONA
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ESTADO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ACCIONES
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {relatores.map((relator, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body1" sx={{ color: palette.textPrimary }}>
                                                    {relator.nombre}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {relator.rut}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {relator.zona.nombre}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Chip label={relator.habilitado === true ? "Habilitado" : relator.habilitado === false ? "No Habilitada" : "Sin estado"} color={relator.habilitado === true ? "success" : relator.habilitado === false ? "error" : "default"} size="small" />
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    sx={{ color: palette.textSecondary, width: "120px" }}
                                                    onClick={() => {
                                                        setForm("relator")
                                                        setPayloadForm({
                                                            id: relator.id,
                                                            nombre: relator.nombre,
                                                            rut: relator.rut,
                                                            zona_id: relator.zona_id
                                                        })
                                                        setOpenModalUpdate(true)
                                                    }}
                                                >
                                                    EDITAR
                                                </Button>
                                                {relator.habilitado && relator.habilitado == 1 ? (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}
                                                        onClick={() => {
                                                            setForm("relator")
                                                            setPayloadForm({
                                                                id: relator.id,
                                                                nombre: relator.nombre,
                                                                rut: relator.rut,
                                                                zona_id: relator.zona_id,
                                                                habilitado: false
                                                            })
                                                            setHabilitado("INHABILITAR")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                    >
                                                        INHABILITAR
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        size="small"
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}
                                                        onClick={() => {
                                                            setForm("relator")
                                                            setPayloadForm({
                                                                id: relator.id,
                                                                nombre: relator.nombre,
                                                                rut: relator.rut,
                                                                zona_id: relator.zona_id,
                                                                habilitado: true
                                                            })
                                                            setHabilitado("HABILITAR")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                    >
                                                        HABILITAR
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Typography variant="h6" sx={{ color: palette.accentSoft, fontWeight: 600, textAlign: 'left', width: '90%', my: 2 }}>
                            Cursos Registrados
                        </Typography>
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => {
                                    setForm("curso")
                                    setPayloadForm({})
                                    setOpenModal(true)
                                }}
                                sx={{ alignSelf: 'flex-start', width: '200px' }}>
                                Agregar Curso
                            </Button>
                        </Box>
                        <Divider sx={{ width: '90%', my: 1, background: palette.borderSubtle }} />
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: palette.cardBg,
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                            mb: 4
                        }}>
                            <Table>
                                <TableHead sx={{ background: palette.primary }}>
                                    <TableRow>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            NOMBRE
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            DESCRIPCIÓN
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ESTADO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ACCIONES
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cursos.map((curso, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body1" sx={{ color: palette.textPrimary }}>
                                                    {curso.nombre}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {curso.descripcion}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Chip index={index} label={curso.habilitado === true ? "Habilitada" : curso.habilitado === false ? "No Habilitada" : "Sin estado"} color={curso.habilitado === true ? "success" : curso.habilitado === false ? "error" : "default"} size="small" />
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    sx={{ color: palette.textSecondary, width: "120px" }}
                                                    onClick={() => {
                                                        setForm("curso")
                                                        setPayloadForm({
                                                            id: curso.id,
                                                            nombre: curso.nombre,
                                                            descripcion: curso.descripcion,
                                                            habilitado: curso.habilitado
                                                        })
                                                        setOpenModalUpdate(true)
                                                    }}
                                                >
                                                    EDITAR
                                                </Button>

                                                {curso.habilitado && curso.habilitado == 1 ? (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}
                                                        onClick={() => {
                                                            setForm("curso")
                                                            setPayloadForm({
                                                                id: curso.id,
                                                                nombre: curso.nombre,
                                                                descripcion: curso.descripcion,
                                                                habilitado: false
                                                            })
                                                            setHabilitado("INHABILITAR")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                    >
                                                        INHABILITAR
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        size="small"
                                                        sx={{ color: palette.textSecondary, ml: 1, width: "120px" }}
                                                        onClick={() => {
                                                            setForm("curso")
                                                            setPayloadForm({
                                                                id: curso.id,
                                                                nombre: curso.nombre,
                                                                descripcion: curso.descripcion,
                                                                habilitado: true

                                                            })
                                                            setHabilitado("HABILITAR")
                                                            setOpenModalHabilitado(true)
                                                        }}
                                                    >
                                                        HABILITAR
                                                    </Button>
                                                )}

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Typography variant="h6" sx={{ color: palette.accentSoft, fontWeight: 600, textAlign: 'left', width: '90%', my: 2 }}>
                            Últimos Cursos Agendados
                        </Typography>
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => {
                                    setForm("curso_agendado")
                                    setPayloadForm({})
                                    setOpenModal(true)
                                }}
                                sx={{ alignSelf: 'flex-start', width: '200px' }}>
                                Agendar Curso
                            </Button>
                        </Box>
                        <Divider sx={{ width: '90%', my: 1, background: palette.borderSubtle }} />
                        <Box sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: palette.cardBg,
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                            mb: 4
                        }}>
                            <Table>
                                <TableHead sx={{ background: palette.primary }}>
                                    <TableRow>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            FECHA CURSO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ZONA
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            CURSO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            RELATOR
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            INSCRITOS
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ESTADO
                                        </TableCell>
                                        <TableCell size="small" align="center" sx={{ fontWeight: 600, color: palette.accentSoft }}>
                                            ACTUALIZAR
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {top20CursosAgendados.map((curso, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body1" sx={{ color: palette.textPrimary }}>
                                                    {extractDateOnly(curso.fecha_curso)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {curso.zona}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {curso.curso}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {curso.relator}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                                                    {curso.inscritos}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Chip index={index} label={curso.estado_curso === true ? "Activo" : curso.estado_curso === false ? "Finalizado" : "Sin estado"} color={curso.estado_curso === true ? "success" : curso.estado_curso === false ? "error" : "default"} size="small" />
                                            </TableCell>
                                            <TableCell align="center" size="small">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    disabled={curso.estado_curso === false}
                                                    sx={{ color: palette.textSecondary, width: "120px" }}
                                                    onClick={
                                                        () => {
                                                            setCursoSeleccionado(curso.id_curso_agendado)
                                                            setOpenModalUpdateCurso(true);
                                                        }}
                                                >
                                                    FINALIZAR
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                    </>)}
            </Box>

        </MainLayout>
    );
}

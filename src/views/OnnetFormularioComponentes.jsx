import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    InputLabel,
    TextField,
    Modal,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableContainer,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import {
    getComponenteTipoFormularioOnnet,
    updateComponenteForm,
    deleteComponenteOnnet,
    createFormularioOnnet
} from "../api/onnetAPI";

export default function OnnetFormularioComponentes() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [formularioActivo, setFormularioActivo] = useState(null);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedComponentId, setSelectedComponentId] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editForm, setEditForm] = useState({
        pregunta: ''
    });

    const [createForm, setCreateForm] = useState({
        pregunta: '',
        orden: '',
        tipo_id: ''
    });

    useEffect(() => {
        console.log(createForm)
    }, [createForm]);


    const onUpdateSubmit = async () => {
        if (!selectedComponentId) return;
        if (!editForm.pregunta || editForm.pregunta.trim() === "") {
            setMessage("La pregunta no puede estar vacía.");
            setAlertType("error");
            return;
        }
        setIsSubmitting(true);
        try {
            await updateComponenteForm(editForm, selectedComponentId);
            setMessage("Componente actualizado correctamente.");
            setAlertType("success");
            handleCloseEditModal();
            fetchData();
            setEditForm({ pregunta: '' });
            setFormularioActivo(null);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
        }
        setIsSubmitting(false);
    }

    const onDeleteSubmit = async () => {
        if (!selectedComponentId) return;
        setIsSubmitting(true);
        try {
            await deleteComponenteOnnet(selectedComponentId);
            setMessage("Componente eliminado correctamente.");
            setAlertType("success");
            handleCloseDeleteModal();
            fetchData();
            setFormularioActivo(null);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
        }
        setIsSubmitting(false);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenDeleteModal = (id) => {
        setSelectedComponentId(id);
        setOpenModalDelete(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenModalDelete(false);
        setSelectedComponentId(null);
    };

    const handleOpenEditModal = (id) => {
        setSelectedComponentId(id);
        setOpenModalEdit(true);
    };

    const handleCloseEditModal = () => {
        setOpenModalEdit(false);
        setSelectedComponentId(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const componentesTipos = await getComponenteTipoFormularioOnnet();
            setData(componentesTipos);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    const onCreateSubmit = async () => {
        if (!createForm.pregunta || createForm.pregunta.trim() === "") {
            setMessage("La pregunta no puede estar vacía.");
            setAlertType("error");
            return;
        }
        setIsSubmitting(true);
        try {
            await createFormularioOnnet(createForm);
            setMessage("Componente creado correctamente.");
            setAlertType("success");
            fetchData();
            setCreateForm({ pregunta: '', orden: '', tipo_id: '' });
        }
        catch (error) {
            console.log(error);
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
        setIsSubmitting(false);
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    paddingTop: "70px",
                    minHeight: '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: palette.bg,
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
                    title="Onnet Componentes Construcción"
                    subtitle="Selecciona un componente para ver su formulario asociado"
                />
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
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'stretch', md: 'flex-start' },
                            justifyContent: { xs: 'center', md: 'center' },
                            gap: 4,
                            mt: 2,
                        }}
                    >
                        {/* Columna izquierda: tarjetas */}
                        <Box
                            sx={{
                                width: { xs: '100%', md: '340px' },
                                minWidth: 280,
                                maxWidth: 400,
                                mx: { xs: 'auto', md: 0 }, // Centrado horizontal en xs/md
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-start' },
                            }}
                        >
                            <Paper elevation={4} sx={{ p: 2, background: palette.cardBg, borderRadius: 3, boxShadow: 3, width: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 700, textAlign: 'center' }}>
                                    Componentes disponibles
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {data.length === 0 ? (
                                        <Typography variant="body1" sx={{ color: palette.textMuted, textAlign: 'center' }}>
                                            No se encontraron componentes.
                                        </Typography>
                                    ) : (
                                        data.map((componente) => (
                                            <Card
                                                key={componente.id}
                                                elevation={3}
                                                onClick={() => {
                                                    setFormularioActivo(componente.formulario);
                                                    setCreateForm({ ...createForm, tipo_id: componente.id })
                                                }
                                                }
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 2,
                                                    background: palette.cardBg,
                                                    border: formularioActivo === componente.formulario ? `2px solid ${palette.primary}` : `1px solid ${palette.borderSubtle}`,
                                                    boxShadow: formularioActivo === componente.formulario ? 6 : 2,
                                                    transition: 'all .25s',
                                                    '&:hover': {
                                                        boxShadow: 8,
                                                        borderColor: palette.accent,
                                                    },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ color: palette.textPrimary, textAlign: 'center', fontWeight: 600 }}>
                                                        {componente.nombre}
                                                    </Typography>
                                                    <Divider sx={{ my: 1, borderColor: palette.borderSubtle }} />
                                                    <Typography variant="body2" sx={{ color: palette.textMuted, textAlign: 'center' }}>
                                                        Haz click para visualizar formulario.
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                        {/* Columna derecha: formulario o placeholder */}
                        <Box sx={{ flex: 1, minWidth: 320, maxWidth: 900, mt: { xs: 4, md: 0 }, pl: { lg: 2 } }}>
                            {!formularioActivo ? (
                                <Paper elevation={2} sx={{ p: 4, background: palette.cardBg, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', boxShadow: 2 }}>
                                    <Typography variant="h5" sx={{ color: palette.textMuted, fontWeight: 500, mb: 2 }}>
                                        Selecciona un componente para visualizar
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: palette.textMuted, textAlign: 'center' }}>
                                        Haz click en una tarjeta de la izquierda para ver el formulario asociado.
                                    </Typography>
                                </Paper>
                            ) : (
                                <Box sx={{}}>

                                    <Paper elevation={2} sx={{ p: 4, background: palette.cardBg, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', boxShadow: 2 }}>
                                        <TableContainer sx={{ width: '100%' }}>
                                            <Table sx={{ minWidth: 320, width: '100%' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        {["N°", "PREGUNTA", "ACCIONES"].map((header) => (
                                                            <TableCell
                                                                key={header}
                                                                align="center"
                                                                sx={{
                                                                    fontWeight: "bold",
                                                                    backgroundColor: palette.primary,
                                                                    color: "white",
                                                                    letterSpacing: 0.4,
                                                                    borderBottom: `2px solid ${palette.primaryDark}`,
                                                                }}
                                                            >
                                                                <Typography>{header}</Typography>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {formularioActivo.length > 0 ? (
                                                        formularioActivo.map((row, index) => (
                                                            <TableRow
                                                                key={index}
                                                            >
                                                                <TableCell align="center" sx={{ fontSize: "12px" }}>{row.orden ? row.orden : "Sin Folio"}</TableCell>
                                                                <TableCell align="center" sx={{ fontSize: "12px" }}>{row.pregunta ? row.pregunta : "Sin Información"}</TableCell>
                                                                <TableCell align="center" sx={{ fontSize: "12px" }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        sx={{
                                                                            textTransform: "none",
                                                                            backgroundColor: palette.primary,
                                                                            '&:hover': { backgroundColor: palette.primaryDark },
                                                                            mx: 1,
                                                                            width: '80px',
                                                                        }}
                                                                        onClick={() => handleOpenEditModal(row.id)}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        sx={{
                                                                            textTransform: "none",
                                                                            backgroundColor: palette.danger,
                                                                            '&:hover': { backgroundColor: palette.dangerHover },
                                                                            mx: 1,
                                                                            width: '80px',
                                                                        }}
                                                                        onClick={() => handleOpenDeleteModal(row.id)}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={12} align="center">
                                                                <Typography fontFamily="initial">No hay datos disponibles</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Box>
                            )}
                            <Box sx={{ mt: 4, p: 2, border: `1px solid ${palette.borderSubtle}`, borderRadius: 2, background: palette.cardBg }}>
                                <Typography variant="h6" sx={{ mb: 2, color: palette.primary, fontWeight: 700, textAlign: 'center' }}>
                                    Crear pregunta para {data.find(c => c.id === createForm.tipo_id)?.nombre || 'componente seleccionado'}
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="tipo-componente-label">Tipo de componente</InputLabel>
                                    <Select
                                        labelId="tipo-componente-label"
                                        value={createForm.tipo_id}
                                        label="Tipo de componente"
                                        size="small"
                                        onChange={(e) => setCreateForm({ ...createForm, tipo_id: e.target.value })}
                                    >
                                        {data.map((componente) => (
                                            <MenuItem key={componente.id} value={componente.id}>
                                                {componente.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Orden"
                                    size="small"
                                    fullWidth
                                    type="number"
                                    sx={{ mb: 2 }}
                                    value={createForm.orden}
                                    onChange={(e) => setCreateForm({ ...createForm, orden: e.target.value })}
                                />
                                <TextField
                                    label="Pregunta"
                                    size="small"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={createForm.pregunta}
                                    onChange={(e) => setCreateForm({ ...createForm, pregunta: e.target.value })}
                                />

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ backgroundColor: palette.primary, '&:hover': { backgroundColor: palette.primaryDark } }}
                                    disabled={isSubmitting || !createForm.tipo_id}
                                    onClick={onCreateSubmit}
                                >
                                    Crear Componente
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                )}
            </Box>



            {/* Modal DELETE */}
            <Modal
                open={openModalDelete}
                onClose={handleCloseDeleteModal}
                aria-labelledby="modal-delete-title"
                aria-describedby="modal-delete-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
                    <Typography id="modal-delete-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Eliminar componente
                    </Typography>
                    <Typography id="modal-delete-description" sx={{ mb: 2 }}>
                        ¿Está seguro que desea eliminar esta pregunta? Esta acción no se puede deshacer.
                    </Typography>
                    <Button variant="contained" color="error" sx={{ mr: 2 }} disabled={isSubmitting} onClick={onDeleteSubmit}>
                        Confirmar eliminación
                    </Button>
                    <Button variant="outlined" onClick={handleCloseDeleteModal}>
                        Cancelar
                    </Button>
                </Box>
            </Modal>

            {/* Modal EDIT */}
            <Modal
                open={openModalEdit}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-edit-title"
                aria-describedby="modal-edit-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
                    <Typography id="modal-edit-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Editar pregunta
                    </Typography>
                    <TextField
                        label="Pregunta"
                        fullWidth sx={{ mb: 2 }}
                        value={editForm.pregunta}
                        onChange={(e) => setEditForm({ ...editForm, pregunta: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2, backgroundColor: palette.primary, '&:hover': { backgroundColor: palette.primaryDark } }}
                        disabled={isSubmitting}
                        onClick={onUpdateSubmit}>
                        Guardar cambios
                    </Button>
                    <Button variant="outlined" onClick={handleCloseEditModal}>
                        Cancelar
                    </Button>
                </Box>
            </Modal>

        </MainLayout>
    );
}

import {
    Alert,
    Box,
    CircularProgress,
    Button,
    Card,
    CardHeader,
    CardContent,
    Grid,
    InputLabel,
    TextField,
    LinearProgress,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Select,
    MenuItem,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { getProyectobyID } from "../api/onnetAPI";
import { extractDateOnly } from "../helpers/main";
import { useParams } from "react-router-dom";
import { loadConsumosOnnet, updateValidacionEstado, loadOnnetAprobados } from "../api/onnetAPI";
import { getEmpresas } from "../api/authAPI";
import { downloadFile } from "../api/downloadApi";
import { useSelector } from "react-redux";


export default function ProyectoFiltrado() {
    const { proyecto_id } = useParams();
    const authState = useSelector((state) => state.auth);
    const { user_id, area } = authState;
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);

    const [infoProyecto, setInfoProyecto] = useState(undefined);

    const [empresas, setEmpresas] = useState([]);

    const [dataCubicada, setDataCubicada] = useState([]);
    const [dataSubida, setDataSubida] = useState([]);
    const [infoSupervisor, setInfoSupervisor] = useState([]);

    const filePath = "/home/ubuntu/telcomanager/app/data/Plantilla.xlsx";

    const [form, setForm] = useState({
        file: null,
        proyecto: proyecto_id || ""
    });

    const [formAsignar, setFormAsignar] = useState({
        empresaID: "",
        userID: "",
        proyecto: proyecto_id || ""
    });

    const [formToUpdate, setFormToUpdate] = useState(undefined);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleFileChange = (e) => {
        setForm({
            ...form,
            file: e.target.files[0],
        });
    };

    const downloadInforme = async () => {
        try {
            const payload = { file_path: filePath };
            await downloadFile(payload);
            console.log("Archivo descargado exitosamente");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();
        if (form.file) {
            formData.append("file", form.file);
        }
        formData.append("proyecto", form.proyecto);
        try {

            const response = await loadConsumosOnnet(formData);
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
            fetchProyecto();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchEmpresas = async () => {
        try {
            const res = await getEmpresas();
            setEmpresas(res || []);
        } catch (error) {
            setMessage("Error al cargar las empresas");
            setAlertType("error");
            setOpen(true);
        }
    };

    const fetchProyecto = async () => {
        setIsSubmitting(true);
        try {
            const res = await getProyectobyID(proyecto_id);
            setInfoProyecto(res.info || []);
            setDataCubicada(res.data || []);
            setDataSubida(res.cubicados || []);
            setInfoSupervisor(res.asignado || []);
        } catch (error) {
            setMessage("Error al cargar el proyecto");
            setAlertType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const execLoadOnnetAprobados = async () => {
        try {
            await loadOnnetAprobados(proyecto_id);
        } catch (error) {
            console.log("Error al cargar los aprobados de Onnet: ", error);
        }
    };

    const onSubmitUpdateEstado = async () => {
        // Mostrar mensaje informativo antes de ejecutar la actualización
        setMessage("Si procede, los valores aprobados serán cargados directamente en QuickBase. Ejecutando actualización...");
        setAlertType("info");
        setOpen(true);

        if (!formToUpdate || formToUpdate.length === 0) {
            setMessage("No hay datos para actualizar");
            setAlertType("error");
            setOpen(true);
            return;
        }
        setIsSubmitting(true);
        try {
            // Excluir items cuyo validacion_estado sea '0' o 0
            const payload = (formToUpdate || []).filter(item => {
                const estado = item?.validacion_estado;
                return !(estado === 0 || estado === '0' || estado === null || estado === undefined);
            });

            if (!payload || payload.length === 0) {
                setMessage("No hay elementos seleccionados para actualizar (todos pendientes).");
                setAlertType("info");
                setOpen(true);
                return;
            }

            const res = await updateValidacionEstado(payload);
            setMessage(res.message || "Actualización exitosa");
            setAlertType("success");
            setOpen(true);
            setIsSubmitting(false);
            execLoadOnnetAprobados();
            fetchProyecto();
        } catch (error) {
            let errorMsg = error?.message || error;
            setMessage(errorMsg || "Error al actualizar");
            setAlertType("error");
            setOpen(true);
            setIsSubmitting(false);
        }
    };

    const handleOpenConfirm = () => {
        if (!formToUpdate || formToUpdate.length === 0) {
            setMessage("No hay datos para actualizar");
            setAlertType("error");
            setOpen(true);
            return;
        }
        setConfirmOpen(true);
    }

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    }

    const handleConfirmUpdate = async () => {
        // Close dialog and perform update
        setConfirmOpen(false);
        await onSubmitUpdateEstado();
    }

    const clearForm = () => {
        setForm({
            file: null,
            proyecto: proyecto_id || "",
            supervisor_id: ""
        });
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

    const validateDisabled = (item) => {
        const validateUserArea = () => {
            if (
                parseInt(user_id) === parseInt(infoSupervisor.userID) ||
                parseInt(area.areaID) === 8
            ) return false
            else return true;
        }

        const validateEstado = () => {
            if (item['validacion_estado'] !== 0 || item['estado_carga'] !== 0) return true
            else return false;
        }
        if (validateUserArea() || validateEstado()) return true
        else return false;
    }

    const validateDisabledButton = () => {
        if
            (
            parseInt(user_id) === parseInt(infoSupervisor.userID) ||
            (parseInt(area.areaID) === 8)
        ) return false
        else return true;
    }

    const updateFormToUpdateEstado = (index, newEstado) => {
        setFormToUpdate((prev) => {
            if (!prev || prev.length === 0) return prev;
            // clonar array
            const updated = prev.map((item, i) => {
                if (i !== index) return item;
                // clonar objeto y actualizar solo validacion_estado
                return { ...item, validacion_estado: newEstado };
            });
            return updated;
        });
    }

    const infoProyectoCard = () => {
        const info = infoProyecto || {};

        const labelStyle = { fontWeight: 700, color: palette.textMuted, fontSize: 13 };
        const valueStyle = { fontWeight: 700, color: palette.textPrimary, fontSize: 15 };

        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title="Información General" sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{info.proyecto ?? 'Sin Código'}</Typography>
                                        <Typography sx={{ color: palette.textMuted, fontSize: 13 }}>{info.empresa_colaboradora ?? 'Sin empresa'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                    <Box sx={{ bgcolor: palette.accentSoft, px: 1.2, py: 0.6, borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: 12, color: palette.textMuted }}>Actividades</Typography>
                                        <Typography sx={{ fontWeight: 800, color: palette.textPrimary }}>{info.q_actividades ?? 0}</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: palette.accentSoft, px: 1.2, py: 0.6, borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: 12, color: palette.textMuted }}>Materiales</Typography>
                                        <Typography sx={{ fontWeight: 800, color: palette.textPrimary }}>{info.q_materiales ?? 0}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography sx={labelStyle}>Agencia</Typography>
                                <Typography sx={valueStyle}>{info.agencia ?? 'Sin Información'}</Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography sx={labelStyle}>Estado</Typography>
                                <Typography sx={{ ...valueStyle, color: info.estado_proyecto ? palette.primary : palette.textPrimary }}>{info.estado_proyecto ?? 'Sin Información'}</Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography sx={labelStyle}>Fecha construcción</Typography>
                                <Typography sx={valueStyle}>{info.fecha_constuccion ? extractDateOnly(info.fecha_constuccion) : 'Sin Información'}</Typography>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    const infoCubicadoOnnet = () => {

        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title="Informe Avance" sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead sx={{ background: palette.cardBg }}>
                                    <TableRow>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Cod. Actividad</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Descripción</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>UM</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Informada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Cod. Material</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Descripción</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Informada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataCubicada && dataCubicada.length > 0 ? (
                                        dataCubicada.map((p, index) => (
                                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: palette.accentSoft } }}>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Related Mano de Obra'] ? p['Related Mano de Obra'] : 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Mano de Obra - DESCRIPCION'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Mano de Obra - UM'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO-Cantidad Cubicada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO-Cantidad Informada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO-Cantidad Aprobada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Related Unidad de Obra'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Unidad de Obra - DESCRIPCION'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO-Cantidad Cubicada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO-Cantidad Informada (As-Built)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO-Cantidad Aprobada'] ?? 'Sin Información'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center">No hay datos disponibles</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    const cargaArchivos = () => {
        return (
            <Box sx={{ ...glass, width: '90%', my: 4, display: 'flex', flexDirection: { lg: 'row', xs: 'column' }, py: 3, gap: 4, justifyContent: 'space-around', alignItems: 'center' }}>
                <Box>
                    <form
                        onSubmit={() => { handleSubmit() }}
                        encType="multipart/form-data"
                        style={{ width: "100%" }}
                    >
                        <Box>
                            <InputLabel id="file-label">Cargar Cubicados</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="file"
                                type="file"
                                name="file"
                                variant="standard"
                                onChange={handleFileChange}
                                inputProps={{ accept: ".xlsx,.xls" }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ ...primaryBtn, py: 1.2, my: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Procesando..." : "Cargar"}
                            </Button>
                            {isSubmitting && <LinearProgress />}
                        </Box>
                    </form>
                </Box>
            </Box>
        )
    }

    const cubicadosCargados = () => {

        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title="Elementos cargados" sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead sx={{ background: palette.cardBg }}>
                                    <TableRow>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Fecha Carga</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Cod. Actividad</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Cod. Material</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Estado</TableCell>
                                        <TableCell sx={{ color: palette.textMuted, fontWeight: "bold" }}>Fecha Validación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formToUpdate && formToUpdate.length > 0 ? (
                                        formToUpdate.map((p, index) => (
                                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: palette.accentSoft } }}>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['fecha_registro'] ? extractDateOnly(p['fecha_registro']) : 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cod_actividad'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cant_actividad'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cod_material'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cant_material'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>
                                                    <Select
                                                        value={p['validacion_estado'] ?? '0'}
                                                        onChange={(e) => updateFormToUpdateEstado(index, e.target.value)}
                                                        size="small"
                                                        variant="standard"
                                                        disabled={validateDisabled(p)}
                                                        sx={{ minWidth: 120 }}
                                                    >
                                                        <MenuItem value={"0"}>Pendiente</MenuItem>
                                                        <MenuItem value={"1"}>Aprobado</MenuItem>
                                                        <MenuItem value={"2"}>Rechazado</MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['validacion_fecha'] ? extractDateOnly(p['validacion_fecha']) : 'No validada'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">No hay datos disponibles</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" sx={{ ...primaryBtn, mt: 2, width: 200 }} disabled={validateDisabledButton()} onClick={handleOpenConfirm}>
                            ACTUALIZAR
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    const confirmDialog = (
        <>
            <Dialog
                open={confirmOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar actualización</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Al confirmar, los valores aprobados serán cargados directamente en QuickBase.
                        ¿Desea continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Cancelar</Button>
                    <Button variant="contained" onClick={handleConfirmUpdate} autoFocus sx={{ ...primaryBtn }}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

    useEffect(() => {
        fetchProyecto();
        fetchEmpresas();
    }, []);

    useEffect(() => {
        if (dataSubida && dataSubida.length > 0) {
            setFormToUpdate(dataSubida);
        }
    }, [dataSubida]);


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
                {confirmDialog}
                {isSubmitting && (
                    <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <CircularProgress />
                            <Typography sx={{ fontWeight: 700, color: palette.textPrimary }}>Procesando...</Typography>
                        </Box>
                    </Box>
                )}

                <ModuleHeader
                    title={proyecto_id}
                    subtitle="Gestión de cubicados Onnet"
                />
                {infoProyectoCard()}
                {infoCubicadoOnnet()}

                <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" sx={{ background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.accent} 100%)`, width: 300, borderRadius: 2, fontWeight: 600, letterSpacing: .3, '&:hover': { background: palette.primaryDark } }} onClick={() => { downloadInforme(); }}>
                        Descarga Plantilla
                    </Button>
                </Box>

                {cargaArchivos()}
                {cubicadosCargados()}
            </Box>
        </MainLayout>
    );
}

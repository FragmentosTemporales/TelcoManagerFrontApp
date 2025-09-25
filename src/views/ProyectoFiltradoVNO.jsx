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
    Autocomplete,
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
import { getProyectoVNObyID } from "../api/onnetAPI";
import { extractDateOnly } from "../helpers/main";
import { useParams } from "react-router-dom";
import {
    loadConsumosOnnetVNO,
    updateValidacionEstadoVNO,
    loadOnnetAprobados,
    createCubicadoVNOUnitario,
    getRelateds,
    updateCubicadoRecord
} from "../api/onnetAPI";
import { downloadFile } from "../api/downloadApi";
import { useSelector } from "react-redux";


export default function ProyectoFiltradoVNO() {
    const { proyecto_id } = useParams();
    const authState = useSelector((state) => state.auth);
    const { user_id, area } = authState;
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);

    const [infoProyecto, setInfoProyecto] = useState(undefined);

    const [dataCubicada, setDataCubicada] = useState([]);
    const [dataSubida, setDataSubida] = useState([]);
    const [relatedMO, setRelatedMO] = useState([]);
    const [relatedUO, setRelatedUO] = useState([]);

    const [toUpdate, setToUpdate] = useState(undefined);

    const filePath = "/home/ubuntu/telcomanager/app/data/PLANILLA_VNO.xlsm";

    const [vnoOption, setVnoOption] = useState([]);

    const [form, setForm] = useState({
        file: null,
        proyecto: proyecto_id || "",
        related_vno: ""
    });

    const [formUnitario, setFormUnitario] = useState({
        proyecto: proyecto_id || "",
        userID: user_id || "",
        cod_actividad: "",
        mo_cubicada_habilitacion: "",
        mo_cubicada_construccion: "",
        mo_cubicada_interior: "",
        cod_material: "",
        uo_cubicada_habilitacion: "",
        uo_cubicada_construccion: "",
        uo_cubicada_interior: "",
        orden_vno: ""
    });

    const [formToUpdate, setFormToUpdate] = useState(undefined);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleFileChange = (e) => {
        setForm({
            ...form,
            file: e.target.files[0],
        });
    };

    const handleUnitarioChange = (e) => {
        const { name, value } = e.target;
        setFormUnitario((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler to update the single record being edited (toUpdate)
    const handleToUpdateChange = (e) => {
        const { name, value } = e.target;
        setToUpdate((prev) => ({
            ...(prev || {}),
            [name]: value,
        }));
    };

    const downloadInforme = async () => {
        try {
            const payload = { file_path: filePath };
            await downloadFile(payload);
            console.log("Archivo descargado exitosamente");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitUnitario = async () => {
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("proyecto", form.proyecto);
        try {
            // Convertir campos numéricos a Number|null
            const payload = {
                ...formUnitario,
                mo_cubicada_habilitacion: formUnitario.mo_cubicada_habilitacion === '' ? null : Number(formUnitario.mo_cubicada_habilitacion),
                mo_cubicada_construccion: formUnitario.mo_cubicada_construccion === '' ? null : Number(formUnitario.mo_cubicada_construccion),
                mo_cubicada_interior: formUnitario.mo_cubicada_interior === '' ? null : Number(formUnitario.mo_cubicada_interior),
                uo_cubicada_habilitacion: formUnitario.uo_cubicada_habilitacion === '' ? null : Number(formUnitario.uo_cubicada_habilitacion),
                uo_cubicada_construccion: formUnitario.uo_cubicada_construccion === '' ? null : Number(formUnitario.uo_cubicada_construccion),
                uo_cubicada_interior: formUnitario.uo_cubicada_interior === '' ? null : Number(formUnitario.uo_cubicada_interior),
            };

            const response = await createCubicadoVNOUnitario(payload);
            setMessage(response.message || "Cubicado unitario creado exitosamente");
            setAlertType("success");
            setOpen(true);
            setFormUnitario({
                proyecto: proyecto_id || "",
                userID: user_id || "",
                cod_actividad: "",
                mo_cubicada_habilitacion: "",
                mo_cubicada_construccion: "",
                mo_cubicada_interior: "",
                cod_material: "",
                uo_cubicada_habilitacion: "",
                uo_cubicada_construccion: "",
                uo_cubicada_interior: ""
            });

        } catch (error) {
            console.error(error);
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();
        if (form.file) {
            formData.append("file", form.file);
        }
        formData.append("proyecto", form.proyecto);
        formData.append("related_vno", form.related_vno);
        try {

            const response = await loadConsumosOnnetVNO(formData);
            clearForm();
            setAlertType("success");
            setMessage(response.message);
            setOpen(true);

        } catch (error) {
            console.error(error);
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

    const handleSubmitUpdateRecord = async () => {
        if (!toUpdate) {
            setMessage("No hay registro seleccionado para actualizar");
            setAlertType("error");
            setOpen(true);
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await updateCubicadoRecord(toUpdate);
            setMessage(response.message || "Registro enviado para su aprobación");
            setAlertType("success");
            setOpen(true);
            setToUpdate(undefined);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al actualizar el registro");
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchRelateds = async () => {
        try {
            const res = await getRelateds();
            setRelatedMO(res.related_mo.sort((a, b) => a.related_mo_label.localeCompare(b.related_mo_label)) || []);
            setRelatedUO(res.related_uo.sort((a, b) => a.related_uo_label.localeCompare(b.related_uo_label)) || []);
        } catch (error) {
            console.error("Error fetching relateds: ", error);
        }
    };

    const fetchProyecto = async () => {
        setIsSubmitting(true);
        try {
            const res = await getProyectoVNObyID(proyecto_id);
            setInfoProyecto(res.info || []);
            setDataCubicada(res.data || []);
            setDataSubida(res.cubicados || []);

            if (res.related_options) {
                setVnoOption(res.related_options);
            }

        } catch (error) {
            console.error(error);
            setMessage("Error al cargar el proyecto");
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const execLoadOnnetAprobados = async () => {
        try {
            await loadOnnetAprobados(proyecto_id);
        } catch (error) {
            console.error(error);
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

            const res = await updateValidacionEstadoVNO(payload);
            setMessage(res.message || "Actualización exitosa");
            setAlertType("success");
            setOpen(true);
            setIsSubmitting(false);
            execLoadOnnetAprobados();
            fetchProyecto();
        } catch (error) {
            console.error(error);
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

    // Sticky header style for table headers
    const stickyTh = {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: palette.cardBg,
        // ensure a subtle separation when scrolling
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
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
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 420, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            {/* Ensure table can overflow horizontally to show a lateral scrollbar on small viewports */}
                            <Table size="small" sx={{}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Cod. Actividad</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Descripción</TableCell>

                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Habilitación</TableCell>


                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Habilitación</TableCell>


                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Habilitación</TableCell>


                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Cod. Material</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Descripción</TableCell>

                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Cubicada Habilitación</TableCell>


                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Informada Habilitación</TableCell>


                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Q Aprobada Habilitación</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataCubicada && dataCubicada.length > 0 ? (
                                        dataCubicada.map((p, index) => (
                                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: palette.accentSoft } }} onClick={() => { setToUpdate(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['Related Mano de Obra'] ? p['Related Mano de Obra'] : 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Mano de Obra - DESCRIPCION'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['MO-Cantidad Cubicada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['MO-Cantidad Informada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Informada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Informada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Informada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['MO-Cantidad Aprobada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['MO Aprobada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['Related Unidad de Obra'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['Unidad de Obra - DESCRIPCION'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['UO-Cantidad Cubicada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Cubicada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Cubicada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Cubicada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['UO-Cantidad Informada (As-Built)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Informada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Informada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Informada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>


                                                <TableCell sx={{ color: palette.primary, fontWeight: "bold" }}>{p['UO-Cantidad Aprobada'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Aprobada - Interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Aprobada - L3 (Construccion UMI)'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['UO Aprobada - Link T1/T2 (Habilitacion)'] ?? 'Sin Información'}</TableCell>

                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={28} align="center">No hay datos disponibles</TableCell>
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
                        <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: 4, justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box>
                            <InputLabel id="file-label">Orden Asociada</InputLabel>
                            <Select
                                required
                                fullWidth
                                id="related_vno"
                                name="related_vno"
                                variant="standard"
                                value={form.related_vno}
                                onChange={(e, newValue) => {
                                    const value = e.target.value;
                                    setForm((prev) => ({
                                        ...prev,
                                        related_vno: value
                                    }));
                                }}
                                sx={{ mb: 2, minWidth: 240 }}
                            >
                                {vnoOption.map((option, index) => (
                                    <MenuItem key={index} value={option.ORDEN}>
                                        {option.ORDEN}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <InputLabel id="file-label">Cargar Cubicados VNO</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="file"
                                type="file"
                                name="file"
                                variant="standard"
                                onChange={handleFileChange}
                                inputProps={{ accept: ".xlsx,.xls,.xlsm" }}
                                sx={{ mb: 2, minWidth: 240 }}
                            />
                        </Box>
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

    const toUpdateEditCard = () => {
        if (!toUpdate) { return null; }
        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title={`Editar Record - #${toUpdate['Record ID#']}`} sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSubmitUpdateRecord(); }}
                            style={{ width: "100%" }}
                        >
                            <Grid container spacing={2} alignItems="center">

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Código Actividad</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="Related Mano de Obra"
                                        name="Related Mano de Obra"
                                        variant="standard"
                                        value={toUpdate['Related Mano de Obra'] || ''}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Cubicada Actividad</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="MO-Cantidad Cubicada"
                                        name="MO-Cantidad Cubicada"
                                        variant="standard"
                                        value={toUpdate['MO-Cantidad Cubicada'] || ''}
                                        onChange={handleToUpdateChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Informada Actividad</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="MO-Cantidad Informada"
                                        name="MO-Cantidad Informada"
                                        variant="standard"
                                        value={toUpdate['MO-Cantidad Informada'] || ''}
                                        onChange={handleToUpdateChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Aprobada Actividad</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="MO-Cantidad Aprobada"
                                        name="MO-Cantidad Aprobada"
                                        variant="standard"
                                        value={toUpdate['MO-Cantidad Aprobada'] || ''}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Código Material</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="Related Unidad de Obra"
                                        name="Related Unidad de Obra"
                                        variant="standard"
                                        value={toUpdate['Related Unidad de Obra'] || ''}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Cubicada Material</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="UO-Cantidad Cubicada"
                                        name="UO-Cantidad Cubicada"
                                        variant="standard"
                                        value={toUpdate['UO-Cantidad Cubicada'] || 0}
                                        onChange={handleToUpdateChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Informada Material</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="UO-Cantidad Informada (As-Built)"
                                        name="UO-Cantidad Informada (As-Built)"
                                        variant="standard"
                                        value={toUpdate['UO-Cantidad Informada (As-Built)'] || 0}
                                        onChange={handleToUpdateChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cantidad Aprobada Material</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="UO-Cantidad Aprobada"
                                        name="UO-Cantidad Aprobada"
                                        variant="standard"
                                        value={toUpdate['UO-Cantidad Aprobada'] || 0}
                                        disabled
                                    />
                                </Grid>



                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
                                        <Button
                                            type="submit"
                                            size="small"
                                            variant="contained"
                                            sx={{ ...primaryBtn, mt: 2, width: 200 }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Procesando..." : "Cargar"}
                                        </Button>
                                        {isSubmitting && <LinearProgress sx={{ flex: 1 }} />}
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    const cargaUnitario = () => {
        if (relatedMO.length === 0 || relatedUO.length === 0) { return null; }
        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title="Carga Unitario" sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSubmitUnitario(); }}
                            style={{ width: "100%" }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-actividad-label">Cod. Actividad</InputLabel>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={relatedMO}
                                        getOptionLabel={(option) => option.related_mo_label || ''}
                                        isOptionEqualToValue={(option, value) => option.related_mo_value === (value?.related_mo_value ?? value)}
                                        onChange={(e, newValue) => {
                                            const value = newValue ? newValue.related_mo_value : '';
                                            handleUnitarioChange({ target: { name: 'cod_actividad', value } });
                                        }}
                                        value={
                                            relatedMO.find((itm) => itm.related_mo_value === formUnitario.cod_actividad) || null
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} variant="standard" required />
                                        )}
                                    />
                                </Grid>


                                <Grid item xs={12} md={6}>
                                    <InputLabel id="mo-habilitacion-label">MO Habilitación</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="mo_cubicada_habilitacion"
                                        name="mo_cubicada_habilitacion"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.mo_cubicada_habilitacion}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="mo-construccion-label">MO Construcción</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="mo_cubicada_construccion"
                                        name="mo_cubicada_construccion"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.mo_cubicada_construccion}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="mo-interior-label">MO Interior</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="mo_cubicada_interior"
                                        name="mo_cubicada_interior"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.mo_cubicada_interior}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="cod-material-label">Cod. Material</InputLabel>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={relatedUO}
                                        getOptionLabel={(option) => option.related_uo_label || ''}
                                        isOptionEqualToValue={(option, value) => option.related_uo_value === (value?.related_uo_value ?? value)}
                                        onChange={(e, newValue) => {
                                            const value = newValue ? newValue.related_uo_value : '';
                                            handleUnitarioChange({ target: { name: 'cod_material', value } });
                                        }}
                                        value={
                                            relatedUO.find((itm) => itm.related_uo_value === formUnitario.cod_material) || null
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} variant="standard" required />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="uo-habilitacion-label">UO Habilitación</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="uo_cubicada_habilitacion"
                                        name="uo_cubicada_habilitacion"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.uo_cubicada_habilitacion}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="uo-construccion-label">UO Construcción</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="uo_cubicada_construccion"
                                        name="uo_cubicada_construccion"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.uo_cubicada_construccion}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputLabel id="uo-interior-label">UO Interior</InputLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="uo_cubicada_interior"
                                        name="uo_cubicada_interior"
                                        type="number"
                                        inputProps={{ step: 'any' }}
                                        variant="standard"
                                        onChange={handleUnitarioChange}
                                        value={formUnitario.uo_cubicada_interior}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                        <Box>
                            <InputLabel id="file-label">Orden Asociada</InputLabel>
                            <Select
                                required
                                fullWidth
                                id="orden_vno"
                                name="orden_vno"
                                variant="standard"
                                onChange={handleUnitarioChange}
                                value={formUnitario.orden_vno}
                                sx={{ mb: 2, minWidth: 240 }}
                            >
                                {vnoOption.map((option, index) => (
                                    <MenuItem key={index} value={option.ORDEN}>
                                        {option.ORDEN}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
                                        <Button
                                            type="submit"
                                            size="small"
                                            variant="contained"
                                            sx={{ ...primaryBtn, mt: 2, width: 200 }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Procesando..." : "Cargar"}
                                        </Button>
                                        {isSubmitting && <LinearProgress sx={{ flex: 1 }} />}
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    const cubicadosCargados = () => {

        return (
            <Box sx={{ width: '90%', mb: 4 }}>
                <Card sx={{ ...glass, width: '100%' }}>
                    <CardHeader title="Elementos cargados" sx={{ background: 'transparent', pb: 0 }} />
                    <CardContent sx={{ pt: 1 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${palette.borderSubtle}`, borderRadius: 1, maxHeight: 420, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Fecha Carga</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Cod. Actividad</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>MO Cubicada Habilitación</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>MO Cubicada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>MO Cubicada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Cod. Material</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>UO Cubicada Habilitacion</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>UO Cubicada Construcción</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>UO Cubicada Interior</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Estado</TableCell>
                                        <TableCell sx={{ ...stickyTh, color: palette.textMuted, fontWeight: "bold" }}>Fecha Validación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formToUpdate && formToUpdate.length > 0 ? (
                                        formToUpdate.map((p, index) => (
                                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: palette.accentSoft } }}>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['fecha_registro'] ? extractDateOnly(p['fecha_registro']) : 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cod_actividad'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['mo_cubicada_habilitacion'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['mo_cubicada_construccion'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['mo_cubicada_interior'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['cod_material'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['uo_cubicada_habilitacion'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['uo_cubicada_construccion'] ?? 'Sin Información'}</TableCell>
                                                <TableCell sx={{ color: palette.textMuted }}>{p['uo_cubicada_interior'] ?? 'Sin Información'}</TableCell>
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
                                            <TableCell colSpan={11} align="center">No hay datos disponibles</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" sx={{ ...primaryBtn, mt: 2, width: 200 }} disabled={validateDisabledButton()} onClick={handleOpenConfirm}>
                            ACTUALIZAR
                        </Button>
                    </CardContent>
                    <Typography sx={{ fontSize: 12, color: palette.textMuted, p: 2 }}>* Solo el supervisor asignado o usuarios del área de planificación pueden actualizar los estados.</Typography>
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
        fetchRelateds()
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
                {toUpdateEditCard()}
                {infoProyectoCard()}
                {infoCubicadoOnnet()}

                <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" sx={{ background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.accent} 100%)`, width: 300, borderRadius: 2, fontWeight: 600, letterSpacing: .3, '&:hover': { background: palette.primaryDark } }} onClick={() => { downloadInforme(); }}>
                        Descarga Plantilla
                    </Button>
                </Box>

                {cargaArchivos()}
                {cargaUnitario()}
                {cubicadosCargados()}
            </Box>
        </MainLayout>
    );
}

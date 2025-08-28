import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Modal,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Tooltip,
    Typography,
    Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchErroresConConsumo, createOrdenValidada } from "../api/logisticaAPI";
import { extractDateOnly } from "../helpers/main";


function NDCErrorConConsumo() {
    const authState = useSelector((state) => state.auth);
    const { user_id } = authState;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        orden: "",
        material: "",
        cantidad: "",
        region: "",
        logs_error_id: "",
        user_id: "",
    });

    const handleUpdateSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await createOrdenValidada(updateForm);
            console.log(res);
            setMessage("Orden validada correctamente");
            setUpdateForm({
                orden: "",
                material: "",
                cantidad: "",
                region: "",
                logs_error_id: "",
                user_id: "",
            });
            setOpenUpdate(false);
            setAlertType("success");
            setOpen(true);
        } catch (error) {
            console.error("Error updating data:", error);
            setAlertType("error");
            setMessage("Error updating data");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
            fetchData();
        }
    };

    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchErroresConConsumo();
            setData(response.pendientes);
            setTotal(response.total);
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertType("error");
            setMessage("Error fetching data");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tableDataError = () => (
        //crea una tabla con los datos de pendientes sin consumo
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1, background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Typography
                    sx={{
                        color: "white",
                        padding: 1,
                        fontStyle: "italic",
                        fontSize: "12px",
                    }}
                    align="center"
                >
                    Total de Órdenes: {total}
                </Typography>

            </Box>
            <TableContainer>
                <Table stickyHeader>
                    <TableRow>
                        {[
                            "FECHA",
                            "REGION",
                            "SESSION ID",
                            "N° ORDEN",
                            "MATERIAL",
                            "STOCK INGRESADO",
                            "STOCK DISPONIBLE",
                            "OBSERVACION",
                        ].map((header) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    fontWeight: 600,
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
                    <TableBody>
                        {data.map((item, index) => (
                            <Tooltip key={index} title="Haga clic para editar entrada" arrow>
                                <TableRow
                                    key={index}
                                    onClick={() => {
                                        const selected = {
                                            orden: item.orden,
                                            material: item.material,
                                            cantidad: item.cantidad,
                                            region: item.region,
                                            logs_error_id: item.id,
                                            user_id: user_id,
                                        };
                                        setUpdateForm(selected);
                                        setOpenUpdate(true);
                                    }}
                                    role="button"
                                    aria-label={`Orden ${item.orden} material ${item.material || 'N/A'}`}
                                    tabIndex={0}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'background-color .25s',
                                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                                        '&:hover': { backgroundColor: palette.accentSoft },
                                        '&:focus-visible': { outline: `2px solid ${palette.accentSoft}` }
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}
                                >
                                    <TableCell align="center" sx={{ fontSize: "12px" }} >{item.fecha_registro ? extractDateOnly(item.fecha_registro) : 'N/A'}</TableCell>
                                    <TableCell sx={{ fontSize: "12px" }} align="center">{item.region}</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.session_id}</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.orden}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px" }} >{item.material ? item.material : 'N/A'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px" }} >{item.cantidad ? item.cantidad : 'N/A'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px" }} >{item.stock_disponible}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px" }} >{item.observacion ? item.observacion : 'N/A'}</TableCell>
                                </TableRow>
                            </Tooltip>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const UpdateCard = () => {
        const handleChangeUpdate = (field, value) => {
            setUpdateForm((prev) => ({ ...prev, [field]: value }));
        };
        return (
            <Paper
                elevation={10}
                sx={{
                    width: "90%",
                    p: 3,
                    background: palette.cardBg,
                    borderRadius: 3,
                    border: `1px solid ${palette.borderSubtle}`,
                    backdropFilter: 'blur(4px)',
                    boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                    marginTop: 2
                }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Corregir Error Stock Consumo
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                    <TextField
                        label="Orden"
                        variant="standard"
                        disabled
                        value={updateForm.orden}
                        onChange={(e) => handleChangeUpdate('orden', e.target.value)}
                        sx={{ mb: 2, width: "30%" }}
                    />
                    <TextField
                        label="Región"
                        variant="standard"
                        disabled
                        value={updateForm.region}
                        onChange={(e) => handleChangeUpdate('region', e.target.value)}
                        sx={{ mb: 2, width: "30%" }}
                    />

                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                    <TextField
                        label="Material"
                        variant="standard"
                        value={updateForm.material}
                        onChange={(e) => handleChangeUpdate('material', e.target.value)}
                        sx={{ mb: 2, width: "30%" }}
                    />
                    <TextField
                        label="Cantidad"
                        variant="standard"
                        value={updateForm.cantidad}
                        onChange={(e) => handleChangeUpdate('cantidad', e.target.value)}
                        sx={{ mb: 2, width: "30%" }}
                    />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleUpdateSubmit}
                        disabled={isSubmitting}
                        sx={{
                            width: "200px",
                            background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
                            color: '#fff',
                            transition: 'all .35s',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                                mixBlendMode: 'overlay',
                                pointerEvents: 'none'
                            },
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                                background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
                            },
                            '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                            '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                        }}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : "Actualizar"}
                    </Button>
                </Box>

            </Paper>
        );
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);


    return (
        <NdcLayout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    px: 1,
                    background: palette.bgGradient,
                    position: 'relative',
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
                        pointerEvents: 'none'
                    }
                }}
            >
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{ width: "90%", mb: 3, boxShadow: 4, borderRadius: 3, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}` }}
                    >
                        {message}
                    </Alert>
                )}
                {!isSubmitting ? (
                    <Paper elevation={10} sx={{ width: "90%", p: 3, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)" }}>
                        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                            Error Stock Consumo de Ferretería
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        {data && data.length > 0 ? (
                            tableDataError()
                        ) : (
                            <Typography variant="body1" sx={{ textAlign: "center" }}>
                                No se encontraron datos.
                            </Typography>
                        )}
                    </Paper>
                ) : (
                    <Paper elevation={8} sx={{ width: "90%", p: 2, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                    </Paper>
                )
                }
                {openUpdate && (<UpdateCard />)}
            </Box>
        </NdcLayout>
    );
}

export default NDCErrorConConsumo;

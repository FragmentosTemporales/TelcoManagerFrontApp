import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Paper,
    Button,
    Input,
} from "@mui/material";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchDetalleOrdenConsumida } from "../api/ndcAPI";
import { Link, useParams } from "react-router-dom";

import ModuleHeader from "../components/ModuleHeader";


function NDCOrdenConConsumoDeclaradaView() {
    const { orden } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);

    const [dataConsumida, setDataConsumida] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };


    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchDetalleOrdenConsumida(orden);
            console.log(response);
            setDataConsumida(response);

        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    return (
        <MainLayout >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    py: 2,
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
                <ModuleHeader
                    title="NDC Bot - TelcoManager"
                    subtitle="Análisis de Órdenes de Trabajo con NDC"
                    divider
                />
                <Box sx={{ width: '90%', display: 'flex', justifyContent: 'start', pb: 4, }}>
                    <Button
                        component={Link}
                        to="/modulo:ndc-main"
                        variant="contained"
                        color="error"
                        sx={{
                            width: "300px",
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                            },
                            '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                            '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                        }}
                    >
                        VOLVER
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, width: "90%", mb: 3, justifyContent: "center" }}>
                    {isSubmitting ? (
                        <Paper
                            elevation={8}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                my: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                p: 4,
                            }}
                        >
                            <CircularProgress size={60} thickness={5} sx={{ color: palette.primary.main }} />
                            <Typography variant="h6" sx={{ mt: 2, color: palette.textMuted }}>
                                Cargando datos...
                            </Typography>
                        </Paper>
                    ) : (
                        <Paper
                            sx={{
                                background: palette.cardBg,
                                width: "100%",
                                my: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >

                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        width: "100%",
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        background: palette.cardBg,
                                        border: `1px solid ${palette.borderSubtle}`,
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Orden</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Región</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Cod. Material</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Desc. Material</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Cantidad</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Trabajo</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Técnico</TableCell>
                                                <TableCell size="small" align="center" sx={{ fontWeight: "bold", background: palette.primary, color: "#fff" }}>Rut Técnico</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataConsumida.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell size="small" align="center">{item.orden}</TableCell>
                                                    <TableCell size="small" align="center">{item.region}</TableCell>
                                                    <TableCell size="small" align="center">{item.material}</TableCell>
                                                    <TableCell size="small" align="center">{item.descripcion_material}</TableCell>
                                                    <TableCell size="small" align="center">{item.cantidad}</TableCell>
                                                    <TableCell size="small" align="center">{item.trabajo}</TableCell>
                                                    <TableCell size="small" align="center">{item.tecnico}</TableCell>
                                                    <TableCell size="small" align="center">{item.rut_tecnico}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>


                        </Paper>
                    )}
                </Box>

            </Box>
        </MainLayout>
    );
}

export default NDCOrdenConConsumoDeclaradaView;

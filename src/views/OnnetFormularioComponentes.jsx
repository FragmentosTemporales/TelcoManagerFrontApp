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
import { getComponenteTipoFormularioOnnet } from "../api/onnetAPI";

export default function OnnetFormularioComponentes() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [formularioActivo, setFormularioActivo] = useState(null);


    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const componentesTipos = await getComponenteTipoFormularioOnnet();
            setData(componentesTipos);
            console.log(componentesTipos);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Formulario activo cambiado:", formularioActivo);
    }, [formularioActivo]);

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
                                                onClick={() => setFormularioActivo(componente.formulario)}
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
                        </Box>
                    </Box>
                )}
            </Box>
        </MainLayout>
    );
}

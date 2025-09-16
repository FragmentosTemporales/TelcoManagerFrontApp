import {
    Alert,
    Box,
    Button,
    Typography,
    CircularProgress,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    ButtonGroup,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { getReparaciones } from "../api/calidadAPI";
import { CalidadLayout } from "./Layout";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function ReparacionesView() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);


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

    const handleClose = () => {
        setOpen(false);
    };

    const repaTable = () => (
        <Box sx={{ overflowX: "auto", width: "95%", my: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="reparaciones-table" stickyHeader>
                <TableHead>
                    <TableRow>
                        {["FECHA", "ORDEN", "TECNICO", "DESCRIPCION"].map((header) => (
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
                </TableHead>
                <TableBody>
                    {data && data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "background-color .25s",
                                    backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                                    '&:hover': { backgroundColor: palette.accentSoft },
                                }}
                            >
                                <TableCell align="center" width={"15%"}>{extractDate(row.fecha_registro)}</TableCell>
                                <TableCell align="center" width={"15%"}>{row.orden}</TableCell>
                                <TableCell align="center" width={"20%"}>{row.usuario.nombre}</TableCell>
                                <TableCell align="center" width={"50%"}>{row.descripcion}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography fontFamily="initial">No hay datos disponibles</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getReparaciones(page);
            setData(response.data);
            setPages(response.pages);
            console.log("Reparaciones data:", response.data);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al obtener las Reparaciones");
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    const getButtons = () => (
        <ButtonGroup size="small" sx={{ '& .MuiButton-root': { borderColor: palette.primaryDark } }}>
            <Button
                key="prev"
                variant="contained"
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                sx={{
                    background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                    boxShadow: "0 3px 10px -2px rgba(10,27,43,0.5)",
                    '&:hover': { background: palette.primaryDark },
                    '&:disabled': { opacity: 0.5 },
                }}
            >
                <ArrowBackIosIcon fontSize="inherit" />
            </Button>
            <Button
                key="current"
                variant="contained"
                sx={{
                    background: palette.accent,
                    color: '#fff',
                    fontWeight: 600,
                    '&:hover': { background: palette.accent },
                }}
            >
                {page}
            </Button>
            <Button
                key="next"
                variant="contained"
                onClick={() => handlePage(page + 1)}
                disabled={page === pages}
                sx={{
                    background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                    boxShadow: "0 3px 10px -2px rgba(10,27,43,0.5)",
                    '&:hover': { background: palette.primaryDark },
                    '&:disabled': { opacity: 0.5 },
                }}
            >
                <ArrowForwardIosIcon fontSize="inherit" />
            </Button>
        </ButtonGroup>
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, [page]);

    return (
        <CalidadLayout>
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
                                    title="Registros de Reparaciones"
                                    subtitle="Listado y seguimiento de reparaciones registradas"
                                    divider
                                />
                {loading ? (
                    <Paper
                        elevation={8}
                        sx={{
                            background: palette.cardBg,
                            height: "30vh",
                            width: "80%",
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
                    <Paper
                        elevation={10}
                        sx={{
                            background: palette.cardBg,
                            width: "90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "100%",
                            pb: 4,
                            borderRadius: 3,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: 'blur(4px)',
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
                        }}
                    >
                        {repaTable()}
                    </Paper>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 4 }}>
                    {getButtons()}
                </Box>
            </Box>
        </CalidadLayout>
    );
}

export default ReparacionesView;

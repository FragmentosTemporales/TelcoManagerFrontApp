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
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { getFormulariosCalidadReactiva, getFormulariosReactivosExcel } from "../api/calidadAPI";
import { extractDateOnly } from "../helpers/main";

export default function FormulariosCalidadReactiva() {
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const FetchData = async () => {
        setLoading(true);
        try {
            const response = await getFormulariosCalidadReactiva(page);
            setData(response.data);
            setPages(response.pages || 1);

            console.log("response", response);
        } catch (error) {
            setAlertType('error');
            setMessage(`Error al cargar los formularios: ${error}`);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchData();
    }, [page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const getButtons = () => (
        <>
            <Button
                key="prev"
                variant="contained"
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                sx={{
                    background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                    boxShadow: "0 3px 10px -2px rgba(10,27,43,0.5)",
                    "&:hover": { background: palette.primaryDark },
                    "&:disabled": { opacity: 0.5 },
                }}
            >
                <ArrowBackIosIcon />
            </Button>
            <Button
                key="current"
                variant="contained"
                sx={{
                    background: palette.accent,
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { background: palette.accent },
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
                    "&:hover": { background: palette.primaryDark },
                    "&:disabled": { opacity: 0.5 },
                }}
            >
                <ArrowForwardIosIcon />
            </Button>
        </>
    );

    const getExcel = async () => {
        setIsSubmitting(true);
        try {
            await getFormulariosReactivosExcel();
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const gestionInfo = () => (
        <Box
            sx={{
                width: "90%",
                mt: 3,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2
            }}
        >
            <Button
                disabled={isSubmitting}
                onClick={getExcel}
                variant="contained"
                color="error"
                sx={{ width: "300px" }} > {isSubmitting ? "Descargando..." : "DESCARGA EXCEL"} </Button>
        </Box>
    );

    const respaldoTable = () => (
        <Box sx={{ overflowX: "auto", width: "95%", my: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="reparaciones-table" stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {["FECHA", "ORDEN", "AREA RESPONSABILIDAD", "COD CIERRE", "SUB CATEGORÍA"].map((header) => (
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
                    {data && data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow
                                component={Link}
                                to={`/modulo:formulario-calidad-reactiva/${row.id}`}
                                key={index}
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "background-color .25s",
                                    backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                                    '&:hover': { backgroundColor: palette.accentSoft },
                                }}
                            >
                                <TableCell align="center" width={"15%"}>{extractDateOnly(row.fecha_registro)}</TableCell>
                                <TableCell align="center" width={"15%"} sx={{ fontWeight: "bold" }}>{row.orden ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"20%"}>{row.area_responsabilidad.descripcion ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"20%"}>{row.codigo_cierre.descripcion ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"20%"}>{row.sub_categoria.descripcion ?? "N/A"}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography fontFamily="initial">No hay datos disponibles</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );

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
                    title="Formularios Calidad Reactiva"
                    subtitle="Gestiona los formularios asociados a calidad reactiva"
                />
                {gestionInfo()}
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
                    <>
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
                            {respaldoTable()}
                        </Paper>
                        <ButtonGroup
                            size="small"
                            aria-label="pagination-button-group"
                            sx={{ p: 2, "& .MuiButton-root": { borderColor: palette.primaryDark } }}
                        >
                            {getButtons()}
                        </ButtonGroup>
                    </>)}
            </Box>

        </MainLayout>
    );
}

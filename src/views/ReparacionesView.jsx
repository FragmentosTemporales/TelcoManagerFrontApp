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
    TextField,
    Paper,
    ButtonGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { getReparaciones, getReparacionesExcel } from "../api/calidadAPI";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { MainLayout } from "./Layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ReparacionesView() {
    const authState = useSelector((state) => state.auth);
    const { user_id, area, permisos } = authState;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalData, setTotalData] = useState(0);

    const [filterForm, setFilterForm] = useState({
        orden: "",
        rutCliente: "",
        tipoInspeccion: "",
        resultado: "",
        rutTecnico: "",
        contrato: "",
        tipoFalta: ""
    });

    const validatePermiso = () => {
        if (permisos && permisos.length > 0) {
            const permisoAuditoria = permisos.find((permiso) => permiso.moduloID === 21)
            return !permisoAuditoria.edit
        }
    }

    useEffect(() => {validatePermiso()}, [permisos]);

    const handlePage = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
        }
    };

    const extractDate = (rawString) => {
        const normalized = rawString.replace(/(\.\d{3})\d+$/, "$1");
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return rawString; // fallback si el parse falla

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${day}-${month}-${year}`;
    };

    const handleClose = () => {
        setOpen(false);
    };

    const repaTable = () => (
        <Box sx={{ overflowX: "auto", width: "95%", my: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="reparaciones-table" stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {["FECHA", "ORDEN", "CLIENTE", "INSPECTOR", "TECNICO", "RUT TECNICO", "INSPECCION", "RESULTADO"].map((header) => (
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
                                to={`/modulo:repa/${row.id}`}
                                key={index}
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "background-color .25s",
                                    backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                                    '&:hover': { backgroundColor: palette.accentSoft },
                                }}
                            >
                                <TableCell align="center" width={"13%"}>{extractDate(row.fecha_registro)}</TableCell>
                                <TableCell align="center" width={"12%"} sx={{ fontWeight: "bold" }}>{row.orden ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"12%"}>{row.rutCliente ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"13%"}>{row.nombre ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"13%"}>{row.tecnico ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"12%"}>{row.rutTecnico ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"13%"}>{row.tipoInspeccion ?? "N/A"}</TableCell>
                                <TableCell align="center" width={"12%"}>{row.resultado ?? "N/A"}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <Typography fontFamily="initial">No hay datos disponibles</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );

    const filterCard = () => (
        <Paper
            elevation={10}
            sx={{
                width: "90%",
                my: 3,
                py: 4,
                textAlign: "center",
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                borderRadius: 3,
                backdropFilter: "blur(6px)",
                boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
            }}
        >

            <form>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 3,
                    }}
                >
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", alignItems: "center", mt: 1 }}>
                        <TextField
                            id="orden-input"
                            label="Orden"
                            variant="standard"
                            value={filterForm.orden || ""}
                            onChange={(event) => {
                                setFilterForm((prev) => ({
                                    ...prev,
                                    orden: event.target.value,
                                }));
                            }}
                            sx={{ minWidth: 200 }}
                            size="small"
                        />
                        <TextField
                            id="rutCliente-input"
                            label="Cliente"
                            variant="standard"
                            value={filterForm.rutCliente || ""}
                            onChange={(event) => {
                                setFilterForm((prev) => ({
                                    ...prev,
                                    rutCliente: event.target.value,
                                }));
                            }}
                            sx={{ minWidth: 200 }}
                            size="small"
                        />
                        <TextField
                            id="rutTecnico-input"
                            label="Técnico"
                            variant="standard"
                            value={filterForm.rutTecnico || ""}
                            onChange={(event) => {
                                setFilterForm((prev) => ({
                                    ...prev,
                                    rutTecnico: event.target.value,
                                }));
                            }}
                            sx={{ minWidth: 200 }}
                            size="small"
                        />
                        <FormControl variant="standard" sx={{ minWidth: 200 }} size="small">
                            <InputLabel id="tipoInspeccion-label">Tipo Inspeccion</InputLabel>
                            <Select
                                labelId="tipoInspeccion-label"
                                id="tipoInspeccion-select"
                                value={filterForm.tipoInspeccion || ""}
                                onChange={(event) => {
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        tipoInspeccion: event.target.value,
                                    }));
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {tiposInspeccion.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ minWidth: 200 }} size="small">
                            <InputLabel id="tipoFalta-label">Tipo Falta</InputLabel>
                            <Select
                                labelId="tipoFalta-label"
                                id="tipoFalta-select"
                                value={filterForm.tipoFalta || ""}
                                onChange={(event) => {
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        tipoFalta: event.target.value,
                                    }));
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {tiposFaltas.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ minWidth: 200 }} size="small">
                            <InputLabel id="resultado-label">Resultado</InputLabel>
                            <Select
                                labelId="resultado-label"
                                id="resultado-select"
                                value={filterForm.resultado || ""}
                                onChange={(event) => {
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        resultado: event.target.value,
                                    }));
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {resultados.map((resultado) => (
                                    <MenuItem key={resultado} value={resultado}>
                                        {resultado}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ minWidth: 200 }} size="small">
                            <InputLabel id="contrato-label">Contrato</InputLabel>
                            <Select
                                labelId="contrato-label"
                                id="contrato-select"
                                value={filterForm.contrato || ""}
                                onChange={(event) => {
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        contrato: event.target.value,
                                    }));
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {contratos.map((contrato) => (
                                    <MenuItem key={contrato} value={contrato}>
                                        {contrato}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", alignItems: "center", mt: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={fetchData}
                            sx={{
                                fontWeight: 600,
                                minWidth: 200,
                                height: 40,
                                borderRadius: 2,
                                borderColor: palette.accent,
                                color: palette.accent,
                                "&:hover": { borderColor: palette.accent, background: "rgba(255,255,255,0.08)" },
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Procesando..." : "Actualizar"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClear}
                            sx={{
                                fontWeight: 600,
                                background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                                minWidth: 200,
                                height: 40,
                                borderRadius: 2,
                                boxShadow:
                                    "0 6px 16px -4px rgba(10,27,43,0.55), 0 2px 6px -2px rgba(10,27,43,0.35)",
                                "&:hover": { background: palette.primaryDark },
                            }}
                        >
                            LIMPIAR FILTROS
                        </Button>
                    </Box>

                </Box>
            </form>
        </Paper>
    );

    const getExcel = async () => {
        setIsSubmitting(true);
        try {
            await getReparacionesExcel();
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const tiposInspeccion = ["Alertas de Terreno", "Apoyo Terreno", "Auditoría en Terreno", "Autoinspección", "Avería de Infancia", "Folio", "Multa", "Otro"];

    // CREAR ARRAY CON LOS SIGUIENTES VALORES 


    const tiposFaltas = [
        "FALLA EN CONECTOR DE CAMPO", 
        "Falta de herramientas", 
        "Estado de Camioneta",
        "Clave mal aplicada",
        "Comentario deficiente",
        "Dirección mal instalada",
        "Equipos fuera de rango RSI",
        "Extensor fuera de norma",
        "FO mal rotulada enrolamiento",
        "No aplica",
        "No cuida la estética del lugar",
        "No genera ticket de desconexión",
        "No instala pasamuros",
        "No realiza estados vecinos u onfide",
        "Reutilización fuera de norma",
        "Roseta fuera de norma",
        "Ruta de Drop",
        "Técnico no capacita",
        "Utiliza pelo no asignado"
    ]
    const resultados = ["Cumple", "No Cumple"];
    const contratos = ["VTR", "MOVISTAR"]

    const handleClear = async (e) => {
        e.preventDefault();
        try {
            setFilterForm({ orden: "", rutCliente: "", tipoInspeccion: "", resultado: "" });
            setPage(1); // Reset to the first page
            const response = await getReparaciones(1, { orden: "", rutCliente: "", tipoInspeccion: "", resultado: "" })
            setData(response.data);
            setPages(response.pages);
            setMessage("Filtros limpiados.");
            setAlertType("success");
            setOpen(true);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al limpiar los filtros");
            setAlertType("error");
            setOpen(true);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [filterForm]);

    const fetchData = async () => {
        setLoading(true);
        setIsSubmitting(true);
        try {
            const response = await getReparaciones(page, filterForm);
            setData(response.data);
            setPages(response.pages);
            setTotalData(response.total_data || 0);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Error al obtener las Reparaciones");
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
        setIsSubmitting(false);
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
            <Link style={{ color: "white", textDecoration: "none" }} to="/modulo:reparacionesinfo">
                <Button
                    variant="contained"
                    disabled={validatePermiso()}
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
                    Gestionar Información
                </Button>
            </Link>

            <Button
                disabled={isSubmitting || validatePermiso()}
                onClick={getExcel}
                variant="contained"
                color="error"
                sx={{ width: "300px" }} > DESCARGA EXCEL </Button>

        </Box>
    );

    return (
        <MainLayout>
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
                        {filterCard()}
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
                    </>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 4 }}>
                    {getButtons()}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                        Página {page} de {pages} | Total de registros: {totalData}
                    </Typography>
                </Box>
            </Box>
        </MainLayout>
    );
}

export default ReparacionesView;

import {
    Alert,
    Backdrop,
    Box,
    Button,
    InputAdornment,
    Modal,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    CircularProgress,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";
import { useEffect, useState } from "react";
import { getTecnicos, avanzarTecnico, getTecnicosStats } from "../api/inventarioAPI";

export default function InventarioView() {
    const authState = useSelector((state) => state.auth);
    const { token, estacion } = authState;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statsUsers, setStatsUsers] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const [formSiguiente, setFormSiguiente] = useState({
        numDoc: null,
        estacion: null
    });

    const [filterForm, setFilterForm] = useState({
        patente: null,
        numDoc: null
    });

    const [dataFiltered, setDataFiltered] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchTecnicos = async () => {
        setLoading(true);
        try {
            const res = await getTecnicos({ "estacion": estacion }, token);
            setData(res.data);
            setDataFiltered(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        fetchStats();
    };

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const res = await getTecnicosStats(token);
            setStatsUsers(res);
            console.log(res);
        } catch (error) {
            console.error(error);
        }
        setLoadingStats(false);
    };

    const generarAvance = async () => {
        setIsSubmitting(true);
        try {
            const res = await avanzarTecnico(formSiguiente, token);
            setAlertSeverity("success");
            setMensaje(res.data.message);
            fetchTecnicos();
        } catch (error) {
            console.error(error);
            setMensaje("Error actualizando usuario");
            setAlertSeverity("error");
        }
        setOpen(true);
        setOpenModal(false);
        setIsSubmitting(false);
    };

    const functionToFilterData = () => {
        const filtered = data.filter(item => {
            return (
                (!filterForm.patente || item.patente.includes(filterForm.patente)) &&
                (!filterForm.numDoc || item.numDoc.includes(filterForm.numDoc))
            );
        });
        setDataFiltered(filtered);
    };

    const chartSetting = {
            yAxis: [
                {
                    scaleType: 'band',
                    dataKey: 'nombre',
                },
            ],
            xAxis: [
                {
                    label: 'Total',
                },
            ],
            margin: { left: 180, right: 50 },
            height: 400,
    };

    const statsCard = () => (
        <Box
            sx={{
                width: { lg: "70%", md: "90%", xs: "95%" },
                overflow: "hidden",
                backgroundColor: "white",
                textAlign: "center",
                my: 2,
                py:2,
                border: "2px solid #dfdeda",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {loadingStats ? (
                <Box sx={{ p: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <BarChart
                    dataset={statsUsers}
                    grid={{ vertical: true, horizontal: true }}
                    series={[{
                        dataKey: 'total',
                        label: 'Cantidad de técnicos por estación',
                        color: '#2a5980', // color base más claro
                        valueFormatter: (value, context) => {
                            const item = context?.dataset?.[context.dataIndex];
                            if (!item) return value;
                            return `id: ${item.id} | nombre: ${item.nombre} | total: ${item.total}`;
                        }
                    }]}
                    layout="horizontal"
                    slotProps={{
                        tooltip: {
                            renderContent: (params) => {
                                const item = params?.series?.[0]?.data?.[params.dataIndex];
                                const d = item || (params?.series?.[0]?.context?.dataset?.[params.dataIndex]);
                                if (!d) return null;
                                return (
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption">id: {d.id}</Typography><br />
                                        <Typography variant="caption">nombre: {d.nombre}</Typography><br />
                                        <Typography variant="caption" fontWeight="bold">total: {d.total}</Typography>
                                    </Box>
                                );
                            }
                        }
                    }}
                    {...chartSetting}
                />)}
        </Box>
    );

    const filterCard = () => (
        <Box
            sx={{
                width: { lg: "70%", md: "90%", xs: "95%" },
                overflow: "hidden",
                backgroundColor: "white",
                textAlign: "center",
                my: 2,
                paddingBottom: 3,
                border: "2px solid #dfdeda",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column"
            }}
        >
            <Typography variant="h5" sx={{
                fontWeight: "bold",
                borderBottom: "2px solid #dfdeda",
                width: "100%",
                py: 2
            }}>
                FILTRAR POR</Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                marginY: 2
            }}>
                <TextField
                    label="Número de Documento"
                    variant="standard"
                    value={filterForm.numDoc || ""}
                    onChange={(e) => setFilterForm({ ...filterForm, numDoc: e.target.value })}
                    sx={{ width: "30%" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Patente"
                    variant="standard"
                    value={filterForm.patente || ""}
                    onChange={(e) => setFilterForm({ ...filterForm, patente: e.target.value })}
                    sx={{ width: "30%" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    )

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalRender = () => (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "150px",
                width: "600px",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    ¿Desea avanzar de estación?
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    Al avanzar de estación, no podrá volver a visualizar la información del trabajador actual.
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: "#142a3d" }} onClick={generarAvance} disabled={isSubmitting}>
                        {isSubmitting ? "Procesando..." : "Confirmar"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

    const tecnicosTable = () => (
        <Box sx={{ overflowX: "auto", width: "95%", marginY: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {[
                            "NOMBRE",
                            "RUT",
                            "PATENTE",
                            "ESTACION",
                        ].map((header) => (
                            <TableCell
                                key={header}
                                align="left"
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#142a3d",
                                    color: "white",
                                }}
                            >
                                <Typography>{header}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataFiltered && dataFiltered.length > 0 ? (
                        dataFiltered.map((row, index) => (
                            <TableRow
                                key={index}
                                onClick={() => {
                                    setFormSiguiente({
                                        numDoc: row.numDoc,
                                        estacion: estacion
                                    }); setOpenModal(true);
                                }
                                }
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                            >
                                <TableCell align="left" width={"30%"}>{row.nombre ? row.nombre : "N/A"}</TableCell>
                                <TableCell align="left" width={"20%"}>{row.numDoc ? row.numDoc : "N/A"}</TableCell>
                                <TableCell align="left" width={"30%"}>{row.patente ? row.patente : "N/A"}</TableCell>
                                <TableCell align="left" width={"20%"}>{row.estacion ? row.estacion : "N/A"}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography>No hay datos disponibles</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )

    useEffect(() => {
        if (estacion) {
            fetchTecnicos();
        }
    }, [estacion]);

    useEffect(() => {
        functionToFilterData();
    }, [filterForm.patente, filterForm.numDoc]);

    return (
        <MainLayout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    paddingY: "70px",
                    backgroundColor: "#f5f5f5",
                }}
            >      {open && (
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    sx={{
                        width: { lg: "70%", md: "90%", xs: "95%" },
                        boxShadow: 2,
                    }}
                >
                    {mensaje}
                </Alert>
            )}
                {statsCard()}
                <Box
                    sx={{
                        width: { lg: "70%", md: "90%", xs: "95%" },
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                    }}
                >
                    <Button variant="contained" sx={{ backgroundColor: "#142a3d", width: "200px" }} onClick={() => fetchTecnicos()}>
                        Actualizar
                    </Button>
                </Box>
                {modalRender()}
                {filterCard()}

                {loading ? (
                    <Box
                        sx={{
                            backgroundColor: "white",
                            height: "30vh",
                            width: { lg: "70%", md: "90%", xs: "95%" },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            border: "2px solid #dfdeda",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 4, color: "#142a3d" }}>
                            Cargando los recursos...
                        </Typography>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            backgroundColor: "white",
                            width: { lg: "70%", md: "90%", xs: "95%" },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "100%",
                            paddingBottom: 4,
                            borderRadius: 2,
                            border: "2px solid #dfdeda",
                        }}
                    >
                        {tecnicosTable()}
                    </Box>
                )}
            </Box>
        </MainLayout>
    );
}

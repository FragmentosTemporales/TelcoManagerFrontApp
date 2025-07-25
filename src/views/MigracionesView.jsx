import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDataMigracionesProactivas, getMigracionesExcel } from "../api/despachoAPI";
import extractDate, { extractDateOnly } from "../helpers/main";
import { MainLayout } from "./Layout";

function MigracionesViewer() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [message, setMessage] = useState("");
    const [data, setData] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [total, setTotal] = useState(0);
    const [is_loading, setIsLoading] = useState(true);

    const handleClose = () => setOpen(false);

    const fetchData = async () => {
        try {
            const response = await getDataMigracionesProactivas(token, page);
            setData(response.data);
            setPages(response.pages);
            setTotal(response.total);
            setStatsData(response.stats || []);
        } catch (error) {
            console.log(error);
            setMessage(error.error || "Error al cargar los datos");
            setOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const getExcel = async () => {
        setIsSubmitting(true);
        try {
            await getMigracionesExcel(token);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePage = (newPage) => setPage(newPage);

    const getButtons = () => (
        <>
            <Button
                key="prev"
                variant="contained"
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                sx={{ background: "#0b2f6d" }}
            >
                <ArrowBackIosIcon />
            </Button>
            <Button key="current" variant="contained" sx={{ background: "#0b2f6d" }}>
                {page}
            </Button>
            <Button
                key="next"
                variant="contained"
                onClick={() => handlePage(page + 1)}
                disabled={page === pages}
                sx={{ background: "#0b2f6d" }}
            >
                <ArrowForwardIosIcon />
            </Button>
        </>
    );

    const setTableHead = () => (
        <TableHead>
            <TableRow>
                {[
                    "ID VIVIENDA",
                    "CREACION",
                    "CONTACTO",
                    "INGRESO",
                    "FECHA AGENDA",
                    "USUARIO",
                ].map((header) => (
                    <TableCell
                        key={header}
                        align="center"
                        sx={{
                            fontWeight: "bold",
                            backgroundColor: "#0b2f6d",
                            color: "white",
                        }}
                    >
                        <Typography>{header}</Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );

    const setTableBody = () => (
        <TableBody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                    >
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.id_vivienda ? row.id_vivienda : "Sin ID"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.fecha_registro ? extractDate(row.fecha_registro) : "Sin Fecha"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.contacto ? row.contacto : "Sin Contacto"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.ingreso ? row.ingreso : "Sin Ingreso"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.fecha_agenda ? row.fecha_agenda : "Sin Fecha Agenda"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {row.usuario.nombre ? row.usuario.nombre : "Sin Usuario"}
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={12} align="center">
                        <Typography fontFamily="initial">
                            No hay datos disponibles
                        </Typography>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );

    const setTableCard = () => (
        <TableContainer
            component={Paper}
            sx={{ width: "90%", height: "100%", overflow: "auto", marginTop: 2, borderRadius: 2 }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1, backgroundColor: "#0b2f6d" }}>
                <Typography
                    sx={{
                        backgroundColor: "#0b2f6d",
                        color: "white",
                        padding: 1,
                        fontStyle: "italic",
                        fontSize: "12px",
                    }}
                    align="left"
                >
                    Total de Migraciones: {total}
                </Typography>
                <Typography
                    sx={{
                        backgroundColor: "#0b2f6d",
                        color: "white",
                        padding: 1,
                        fontStyle: "italic",
                        fontSize: "12px",
                    }}
                    align="right"
                >
                    Total de Páginas: {pages}
                </Typography>
            </Box>
            <Table stickyHeader>
                {setTableHead()}
                {setTableBody()}
            </Table>
        </TableContainer>
    );

    const statsChart = () => (
        <Box sx={{
            width: "90%",
            backgroundColor: "#fff",
            borderRadius: 2,
            border: "2px solid #dfdeda",
        }}>
            <LineChart
                grid={{ vertical: true, horizontal: true }}
                xAxis={[{
                    data: statsData.map(item => extractDateOnly(item.fecha)),
                    scaleType: 'point',
                }]}
                series={[
                    {
                        data: statsData.map(item => parseInt(item.q)),
                        label: 'Cantidad de Migraciones',
                        color: '#0b2f6d'
                    },
                ]}
                height={250}
                margin={{ left: 60, right: 60, top: 60, bottom: 60 }}
            />
        </Box>
    )


    return (
        <MainLayout showNavbar={true}>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "90vh",
                height: "100%",
                width: "100%",
                overflow: "auto",
                paddingTop: "70px",
                paddingBottom: "50px",
                backgroundColor: "#f0f0f0",
            }}
        >
            {open && (
                <Alert
                    onClose={handleClose}
                    severity="info"
                    sx={{
                        width: "88%",
                        boxShadow: 2,
                    }}
                >
                    {message}
                </Alert>
            )}

            {is_loading ? (
                <Box
                    sx={{
                        width: "90%",
                        overflow: "hidden",
                        backgroundColor: "#f5f5f5",
                        boxShadow: 5,
                        borderRadius: "10px",
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                        height: "30vh",
                    }}
                >
                    <Skeleton sx={{ width: "90%", height: "100%" }} />
                </Box>
            ) : (
                <>
                    {statsChart()}
                    <Box sx={{ display: "flex", alignContent: "start", width: "90%" }}>
                        <Button disabled={isSubmitting} onClick={getExcel} variant="contained" color="error" sx={{ mt: 2, width: "250px" }}>
                            {isSubmitting ? "Descargando..." : "Descargar"}
                        </Button>
                    </Box>
                    {setTableCard()}
                    <ButtonGroup
                        size="small"
                        aria-label="pagination-button-group"
                        sx={{ p: 2 }}
                    >
                        {getButtons()}
                    </ButtonGroup>
                </>
            )}
        </Box>
        </MainLayout>
    );
}

export default MigracionesViewer;

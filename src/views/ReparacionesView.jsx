import {
    Alert,
    Box,
    Button,
    Divider,
    MenuItem,
    Rating,
    Select,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getReparaciones } from "../api/calidadAPI";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";
import { CalidadLayout } from "./Layout";

function ReparacionesView() {
    const authState = useSelector((state) => state.auth);
    const { logID } = useParams();
    const { token, area } = authState;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        <Box sx={{ overflowX: "auto", width: "95%", marginY: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {[
                            "FECHA",
                            "ORDEN",
                            "TECNICO",
                            "DESCRIPCION",
                        ].map((header) => (
                            <TableCell
                                key={header}
                                align="center"
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
                    {data && data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
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
                                <Typography>No hay datos disponibles</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getReparaciones(token, page);
            setData(response.data);
            setPages(response.pages);
            console.log("Reparaciones data:", response.data);
        } catch (error) {
            setMessage(error.message || "Error al obtener las Reparaciones");
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    const getButtons = () => (
        <>
            <Button
                key="prev"
                variant="contained"
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                sx={{ background: "#142a3d" }}
            >
                <ArrowBackIosIcon />
            </Button>
            <Button key="current" variant="contained" sx={{ background: "#142a3d" }}>
                {page}
            </Button>
            <Button
                key="next"
                variant="contained"
                onClick={() => handlePage(page + 1)}
                disabled={page === pages}
                sx={{ background: "#142a3d" }}
            >
                <ArrowForwardIosIcon />
            </Button>
        </>
    );

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <CalidadLayout>
            <Box
                sx={{
                    paddingTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    minHeight: "90vh",
                }}
            >

                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{ width: "80%", marginBottom: 2 }}
                    >
                        {message}
                    </Alert>
                )}
                {loading ? (
                    <Box
                        sx={{
                            backgroundColor: "white",
                            height: "30vh",
                            width: "80%",
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
                            width: "90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "100%",
                            paddingBottom: 4,
                            borderRadius: 2,
                            border: "2px solid #dfdeda",
                        }}
                    >
                        {repaTable()}
                    </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginY: 4 }}>
                    {getButtons()}
                </Box>
            </Box>
        </CalidadLayout>
    );
}

export default ReparacionesView;

import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    MenuItem,
    Select,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography
} from "@mui/material";
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { useEffect, useState } from "react";
import { fetchLogsSessions, fetchSessionsFamiliaMateriales } from "../api/logisticaAPI";

function NDCSessionLogs() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [familiaData, setFamiliaData] = useState([]);
    const [id, setID] = useState(null);

    const extractDate = (gmtString) => {
        const date = new Date(gmtString);

        // Restar 4 horas al tiempo
        date.setUTCHours(date.getUTCHours());

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");

        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");

        const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year} `;

        return formattedDateTime;
    };

    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchLogsSessions(token);
            console.log("Response from API:", response);
            setData(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertType("error");
            setMessage("Error al cargar los datos");
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchFamiliaData = async (sessionId) => {
        try {
            const response = await fetchSessionsFamiliaMateriales(token, sessionId);
            console.log("Response from API:", response);
            setFamiliaData(response.data);
        } catch (error) {
            console.error("Error fetching familia data:", error);
        }
    };

    const tableDataSession = () => (
        //crea una tabla con los datos de pendientes sin consumo
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1, backgroundColor: "#142a3d" }}>
                <Typography
                    sx={{
                        backgroundColor: "#142a3d",
                        color: "white",
                        padding: 1,
                        fontStyle: "italic",
                        fontSize: "12px",
                    }}
                    align="center"
                >
                    Total de Ejecuciones: {total}
                </Typography>

            </Box>
            <TableContainer>
                <Table>
                    <TableRow>
                        {[
                            "SESSION ID",
                            "HORA INICIO",
                            "HORA FINAL",
                            "DURACION (MINUTOS)",
                            "OT PROCESADAS",
                            "Q MATERIALES"
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
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                                onClick={() => setID(item.session_id)}>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.session_id}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.inicio ? extractDate(item.inicio) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.final ? extractDate(item.final) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.duracion ? item.duracion : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.total_ot ? item.total_ot : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.total_materiales ? item.total_materiales : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    useEffect(() => {
        if (id) {
            fetchFamiliaData(id);
        }
    }, [id]);

    return (
        <NdcLayout>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    paddingY: "20px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                {open && (
                    <Alert
                        onClose={handleClose}
                        severity={alertType}
                        sx={{ width: "90%", marginBottom: 2 }}
                    >
                        {message}
                    </Alert>
                )}
                <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, width: "90%", marginBottom: 2, justifyContent: "center" }}>


                    {!isSubmitting ? (
                        <Box sx={{
                            width: { lg: "60%", xs: "100%" },
                            padding: 1,
                            margin: 1,
                            backgroundColor: "white",
                            borderRadius: 2,
                            border: "2px solid #dfdeda",
                            height: "100%",
                        }}>
                            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                                REGISTRO DE EJECUCIONES - NDC
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            {data && data.length > 0 ? (
                                tableDataSession()
                            ) : null}
                        </Box>
                    ) : (
                        <Box sx={{
                            width: "90%",
                            padding: 2,
                            backgroundColor: "white",
                            borderRadius: 2,
                            border: "2px solid #dfdeda",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px"
                        }}>
                            <CircularProgress />
                        </Box>
                    )
                    }
                    {familiaData && familiaData.length > 0 ? (
                        <Box sx={{
                            width: { lg: "40%", xs: "100%" },
                            padding: 1,
                            margin: 1,
                            backgroundColor: "white",
                            borderRadius: 2,
                            border: "2px solid #dfdeda",
                            height: "100%"
                        }}>
                            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                                GRUPO DE MATERIALES
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                backgroundColor: "#142a3d",
                                                color: "white",
                                            }} align="center">SESSION ID</TableCell>
                                            <TableCell align="center" sx={{
                                                fontWeight: "bold",
                                                backgroundColor: "#142a3d",
                                                color: "white",
                                                fontSize: "12px"
                                            }} >GRUPO</TableCell>
                                            <TableCell align="center" sx={{
                                                fontWeight: "bold",
                                                backgroundColor: "#142a3d",
                                                color: "white",
                                                fontSize: "12px"
                                            }} >TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {familiaData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.session_id}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.familia}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>) : null}
                </Box>
            </Box>
        </NdcLayout>
    );
}

export default NDCSessionLogs;

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
    TableRow,
    TableCell,
    Typography
} from "@mui/material";
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { useEffect, useState } from "react";
import { fetchErroresConConsumo } from "../api/logisticaAPI";
import { extractDateOnly } from "../helpers/main";

function NDCErrorConConsumo() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState(undefined);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchData = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchErroresConConsumo(token);
            console.log("Response from API:", response);
            setData(response.pendientes);
            setTotal(response.total);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tableDataError = () => (
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
                    Total de Órdenes: {total}
                </Typography>

            </Box>
            <TableContainer>
                <Table>
                    <TableRow>
                        {[
                            "N° ORDEN",
                            "MATERIAL",
                            "FECHA",
                            "ERROR"
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
                            <TableRow key={index}>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.orden}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.material ? item.material : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.fecha_registro ? extractDateOnly(item.fecha_registro) : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.error ? item.error : 'N/A'}</TableCell>
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
        console.log(data)
    }, [data]);


    return (
        <NdcLayout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
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
                {!isSubmitting ? (
                    <Box sx={{ width: "90%", padding: 2, backgroundColor: "white", borderRadius: 2, border: "2px solid #dfdeda" }}>
                        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                            Error con Consumo de Ferretería
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        {data && data.length > 0 ? (
                            tableDataError()
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
            </Box>
        </NdcLayout>
    );
}

export default NDCErrorConConsumo;

import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { palette } from "../theme/palette";
import { useEffect, useState } from "react";
import { fetchLogsErrores } from "../api/logisticaAPI";
import { extractDateOnly } from "../helpers/main";

function NDCLogsError() {
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
            const response = await fetchLogsErrores(token);
            console.log("Response from API:", response);
            setData(response.errors);
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
            <Box sx={{ display: "flex", justifyContent: "center", p: 1, background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Typography
                    sx={{
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
                <Table stickyHeader>
                    <TableRow>
                        {[
                            "FECHA",
                            "SESSION ID",
                            "N° ORDEN",
                            "ERROR"
                        ].map((header) => (
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
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} sx={{ transition: 'background-color .25s', backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { backgroundColor: palette.accentSoft } }}>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.fecha_registro ? extractDateOnly(item.fecha_registro) : 'N/A'}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.session_id}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }} align="center">{item.orden}</TableCell>
                                <TableCell align="center" sx={{ fontSize: "12px" }} >{item.validacion ? item.validacion : 'N/A'}</TableCell>
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
                    minHeight: "100vh",
                    py: 8,
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
                {!isSubmitting ? (
                    <Paper elevation={10} sx={{ width: "90%", p: 3, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)" }}>
                        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                            Logs de Ordenes con Error
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        {data && data.length > 0 ? (
                            tableDataError()
                        ) : null}
                    </Paper>
                ) : (
                    <Paper elevation={8} sx={{ width: "90%", p: 2, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                    </Paper>
                )
                }
            </Box>
        </NdcLayout>
    );
}

export default NDCLogsError;

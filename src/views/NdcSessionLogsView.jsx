import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { NdcLayout } from "./Layout";
import { palette } from "../theme/palette";
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
                    Total de Ejecuciones: {total}
                </Typography>
            </Box>
            <TableContainer>
                <Table stickyHeader>
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
                            <TableRow
                                key={index}
                                sx={{ cursor: "pointer", transition: 'background-color .25s', backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { backgroundColor: palette.accentSoft } }}
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
                <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, width: "92%", mb: 3, justifyContent: "center" }}>
                    {!isSubmitting ? (
                        <Paper elevation={12} sx={{
                            width: { lg: "60%", xs: "100%" },
                            p: 3,
                            m: 1,
                            background: palette.cardBg,
                            borderRadius: 3,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: 'blur(4px)',
                            height: "100%",
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)"
                        }}>
                            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: 700 }}>
                                REGISTRO DE EJECUCIONES - NDC
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {data && data.length > 0 ? (
                                tableDataSession()
                            ) : null}
                        </Paper>
                    ) : (
                        <Paper elevation={8} sx={{
                            width: { lg: "60%", xs: "100%" },
                            p: 2,
                            m: 1,
                            background: palette.cardBg,
                            borderRadius: 3,
                            border: `1px solid ${palette.borderSubtle}`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}>
                            <CircularProgress />
                        </Paper>
                    )}
                    {familiaData && familiaData.length > 0 ? (
                        <Paper elevation={12} sx={{
                            width: { lg: "40%", xs: "100%" },
                            p: 3,
                            m: 1,
                            background: palette.cardBg,
                            borderRadius: 3,
                            border: `1px solid ${palette.borderSubtle}`,
                            backdropFilter: 'blur(4px)',
                            height: "100%",
                            boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)"
                        }}>
                            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: 700 }}>
                                GRUPO DE MATERIALES
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{
                                                fontWeight: 600,
                                                backgroundColor: palette.primary,
                                                color: 'white',
                                                borderBottom: `2px solid ${palette.primaryDark}`
                                            }} align="center">SESSION ID</TableCell>
                                            <TableCell align="center" sx={{
                                                fontWeight: 600,
                                                backgroundColor: palette.primary,
                                                color: 'white',
                                                fontSize: '12px',
                                                borderBottom: `2px solid ${palette.primaryDark}`
                                            }} >GRUPO</TableCell>
                                            <TableCell align="center" sx={{
                                                fontWeight: 600,
                                                backgroundColor: palette.primary,
                                                color: 'white',
                                                fontSize: '12px',
                                                borderBottom: `2px solid ${palette.primaryDark}`
                                            }} >TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {familiaData.map((item, index) => (
                                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { backgroundColor: palette.accentSoft } }}>
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }} align="center">{item.session_id}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: '12px' }} >{item.familia}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: '12px' }} >{item.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>) : null}
                </Box>
            </Box>
        </NdcLayout>
    );
}

export default NDCSessionLogs;

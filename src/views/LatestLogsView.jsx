import {
    Alert,
    Box,
    Button,
    Divider,
    MenuItem,
    Paper,
    Rating,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TableContainer,
    Chip,
    Tooltip,
    TextField,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useEffect, useState, useMemo } from "react";
import { getLatestLogs } from "../api/telcoAPI";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

export default function LatestLogsView() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [sortDir, setSortDir] = useState("asc");


    const extractDate = (gmtString) => {
        const date = new Date(gmtString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");

        const formattedDateTime = `${day}-${month}-${year}`;

        return formattedDateTime;
    };


    const extractHour = (gmtString) => {
        const date = new Date(gmtString);

        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");

        const formattedDateTime = `${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    };

    const fetchData = async () => {
        try {
            const response = await getLatestLogs();
            setData(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const filteredData = useMemo(() => {
        if (!query.trim()) return data;
        const t = query.trim().toLowerCase();
        return data.filter(item => {
            const tabla = (item.TABLA || '').toLowerCase();
            const esquema = (item.ESQUEMA || '').toLowerCase();
            return tabla.includes(t) || esquema.includes(t);
        });
    }, [data, query]);

    // Sorting logic
    const handleSort = (key) => {
        if (sortBy === key) {
            // toggle direction
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!filteredData) return [];
        const arr = [...filteredData];
        if (!sortBy) return arr;

        const getVal = (item, key) => {
            if (!item) return null;
            if (key === 'FECHA') return item.FECHA ? new Date(item.FECHA) : null;
            if (key === 'HORA') return item.FECHA ? new Date(item.FECHA).getTime() % 86400000 : null; // milliseconds since midnight
            if (key === 'REGISTROS') return Number(item.CANTIDAD_REGISTROS) || 0;
            return item[key] || '';
        };

        arr.sort((a, b) => {
            const va = getVal(a, sortBy);
            const vb = getVal(b, sortBy);

            // handle null/undefined
            if (va === null || va === undefined) return 1;
            if (vb === null || vb === undefined) return -1;

            if (va instanceof Date && vb instanceof Date) {
                return sortDir === 'asc' ? va - vb : vb - va;
            }

            if (typeof va === 'number' && typeof vb === 'number') {
                return sortDir === 'asc' ? va - vb : vb - va;
            }

            // fallback to string compare
            const sa = String(va).toLowerCase();
            const sb = String(vb).toLowerCase();
            if (sa < sb) return sortDir === 'asc' ? -1 : 1;
            if (sa > sb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return arr;
    }, [filteredData, sortBy, sortDir]);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tableHeaders = [
        { label: 'FECHA', key: 'FECHA' },
        { label: 'HORA', key: 'HORA' },
        { label: 'ESQUEMA', key: 'ESQUEMA' },
        { label: 'TABLA', key: 'TABLA' },
        { label: 'REGISTROS', key: 'REGISTROS' },
    ];

    return (
        <MainLayout>
            <Box
                sx={{
                    position: "relative",
                    paddingY: "70px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: palette.bgGradient,
                    minHeight: "80vh",
                    "::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.06), transparent 65%)",
                        pointerEvents: "none",
                    },
                }}
            >
                <ModuleHeader
                    title="Últimos Registros"
                    subtitle="Visualiza, filtra y monitorea los últimos registros de las automatizaciones en DomApp."
                />
                <Paper
                    elevation={8}
                    sx={{
                        width: {lg: "70%", xs: "90%"},
                        py: 2,
                        borderRadius: 4,
                        position: "relative",
                        background: palette.cardBg,
                        backdropFilter: "blur(6px)",
                        boxShadow:
                            "0 8px 24px -6px rgba(0,0,0,0.25), 0 2px 6px -1px rgba(0,0,0,0.15)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "center", flexDirection: "column" }}>
                        <Typography variant="h5" gutterBottom>
                            Buscar por Tabla
                        </Typography>
                    </Box>
                    <Box sx={{ width: "100%", mb: 2, display: "flex", justifyContent: "center" }}>
                        <TextField
                            label="Buscar (Tabla o Esquema)"
                            variant="standard"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            sx={{ width: "50%" }}
                        />
                    </Box>
                </Paper>
                <Box sx={{
                    width: {lg: "70%", xs: "90%"},
                    mt: 4,
                    borderRadius: 4,
                    background: palette.cardBg,
                    backdropFilter: "blur(6px)",
                    boxShadow:
                        "0 8px 24px -6px rgba(0,0,0,0.25), 0 2px 6px -1px rgba(0,0,0,0.15)",
                }}>
                    <TableContainer
                        sx={{
                            background: palette.cardBg,
                            backdropFilter: "blur(4px) saturate(160%)",
                            borderRadius: 2,
                            border: `1px solid ${palette.borderSubtle}`,
                            boxShadow:
                                "0 8px 22px -6px rgba(0,0,0,0.22), 0 4px 10px -2px rgba(0,0,0,0.12)",
                            position: "relative",
                            "&:before": {
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%)",
                                pointerEvents: "none",
                                borderRadius: 8,
                            },
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {tableHeaders.map((header) => (
                                        <TableCell
                                            key={header.key}
                                            onClick={() => handleSort(header.key)}
                                            sx={{
                                                background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
                                                color: "white",
                                                borderBottom: "none",
                                                boxShadow: "inset 0 -1px 0 0 rgba(255,255,255,0.06)",
                                                cursor: 'pointer',
                                                userSelect: 'none',
                                            }}
                                        >
                                            <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                                                <span>{header.label}</span>
                                                {sortBy === header.key && (
                                                    sortDir === 'asc' ? (
                                                        <ArrowUpward fontSize="small" />
                                                    ) : (
                                                        <ArrowDownward fontSize="small" />
                                                    )
                                                )}
                                            </span>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData && sortedData.length > 0 ? (
                                    sortedData.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                transition: "background .3s, box-shadow .3s",
                                                "&:nth-of-type(even)": { backgroundColor: "#f6f9fb" },
                                                "&:hover": {
                                                    backgroundColor: palette.accentSoft,
                                                    boxShadow: "inset 0 0 0 1px " + palette.borderSubtle,
                                                },
                                                "& td": {
                                                    borderBottom: "1px solid " + palette.borderSubtle,
                                                },
                                            }}
                                        >
                                            <TableCell align="left" sx={{ fontSize: "12px" }}>
                                                {row.FECHA
                                                    ? extractDate(row.FECHA)
                                                    : "Sin Información"}
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontSize: "12px" }}>
                                                {row.FECHA
                                                    ? extractHour(row.FECHA)
                                                    : "Sin Información"}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                sx={{ fontSize: "12px", fontWeight: "bold" }}
                                            >
                                                {row.ESQUEMA ? row.ESQUEMA : "Sin Información"}
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontSize: "12px" }}>
                                                {row.TABLA ? row.TABLA : "Sin Información"}
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontSize: "12px" }}>
                                                {row.CANTIDAD_REGISTROS ? row.CANTIDAD_REGISTROS : "Sin titulo"}
                                            </TableCell>


                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            <Typography>No hay datos disponibles</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </MainLayout>
    );
}


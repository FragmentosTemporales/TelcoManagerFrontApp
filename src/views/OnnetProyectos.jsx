import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    InputLabel,
    TextField,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { getProyectosOnnet } from "../api/onnetAPI";
import { PieChart } from '@mui/x-charts/PieChart';

export default function OnnetProyectos() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [proyectos, setProyectos] = useState([]);
    const [pages, setPages] = useState(1);
    const [count, setCount] = useState({});

    const [filterPayload, setFilterPayload] = useState({
        estado: null,
        proyecto_id: null,
    });

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getProyectosOnnet(page, filterPayload);
            console.log(res)
            setProyectos(res.data);
            setPages(res.pages);
            setCount(res.count);
        } catch (error) {
            setMessage(error);
            setAlertType("error");
            setOpen(true);
        }
        setLoading(false);
    };

    const handlePage = (newPage) => setPage(newPage);

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

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    paddingTop: "70px",
                    minHeight: '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                    title="Onnet Construcción"
                    subtitle="Lista de proyectos de construcción OnNet"
                />
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
                            elevation={10}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                border: `1px solid ${palette.borderSubtle}`,
                                borderRadius: 3,
                                backdropFilter: 'blur(6px)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{
                                    width: '100%',
                                    height: 160,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <PieChart
                                        series={[{
                                            data: [
                                                { id: 0, value: count.estado_0 || 0, label: 'No Asignado', color: '#FFA726' },
                                                { id: 1, value: count.estado_1 || 0, label: 'En Progreso', color: '#29B6F6' },
                                                { id: 2, value: count.estado_2 || 0, label: 'Completados', color: '#66BB6A' }
                                            ],
                                            highlightScope: { faded: "global", highlighted: "item" },
                                            faded: {
                                                innerRadius: 30,
                                                additionalRadius: -30,
                                                color: "gray",
                                            },
                                            innerRadius: 40,
                                            outerRadius: 80,
                                            cornerRadius: 4,
                                        }]}
                                        width={600}
                                        height={200}
                                    />
                                </Box>
                            </CardContent>
                        </Paper>

                        <Paper
                            elevation={10}
                            sx={{
                                background: palette.cardBg,
                                width: "90%",
                                mt: 2,
                                border: `1px solid ${palette.borderSubtle}`,
                                borderRadius: 3,
                                backdropFilter: 'blur(6px)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{
                                    width: '100%',
                                    minHeight: 100,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: { md: 'column', lg: 'row', xs: 'column'}
                                }}>
                                    <FormControl sx={{ minWidth: 200, mr: 2 }}>
                                        <InputLabel id="filter-estado-label">Estado</InputLabel>
                                        <Select
                                            labelId="filter-estado-label"
                                            id="filter-estado"
                                            value={filterPayload.estado || ''}
                                            label="Estado"
                                            onChange={(e) => setFilterPayload({ estado: e.target.value || null })}
                                            sx={{ minWidth: 250 }}
                                            size="small"
                                        >
                                            <MenuItem value=''><em>Todos</em></MenuItem>
                                            <MenuItem value={"0"}>No Asignado</MenuItem>
                                            <MenuItem value={"1"}>En Progreso</MenuItem>
                                            <MenuItem value={"2"}>Completados</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="ID del Proyecto"
                                        variant="outlined"
                                        value={filterPayload.proyecto_id || ''}
                                        onChange={(e) => setFilterPayload({ proyecto_id: e.target.value || null })}
                                        sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 } }}
                                        size="small"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => { setPage(1); fetchData(); }}
                                        sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 }, background: palette.primary, "&:hover": { background: palette.primaryDark } }}
                                    >
                                        Filtrar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setFilterPayload({ estado: null, proyecto_id: null });
                                            setPage(1);
                                            fetchData();
                                        }}
                                        sx={{ minWidth: 250, mr: 2, mt: { xs: 1, md: 1, lg: 0 } }}
                                    >
                                        Limpiar Filtros
                                    </Button>
                                </Box>
                            </CardContent>
                        </Paper>

                        <Divider sx={{ width: '90%', my: 2, borderColor: palette.borderSubtle }} />

                        {proyectos.length === 0 && (
                            <Typography variant="h6" sx={{ color: palette.textMuted, mt: 5 }}>
                                No se encontraron proyectos con los filtros aplicados.
                            </Typography>
                        )}
                        <Grid container spacing={2} sx={{ width: '90%', mt: 1, mb: 5 }}>
                            {proyectos.map((proyecto) => (
                                <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
                                    <Card
                                        elevation={6}
                                        component={Link}
                                        to={`/onnet/modulo/proyecto/${proyecto.proyecto_id}`}
                                        sx={{
                                            textDecoration: "none",
                                            minHeight: "40%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            position: "relative",
                                            borderRadius: 3,
                                            background: palette.cardBg,
                                            border: `1px solid ${palette.borderSubtle}`,
                                            backdropFilter: "blur(4px)",
                                            transition: "all .35s",
                                            overflow: "hidden",
                                            willChange: "transform, box-shadow",
                                            transformOrigin: "top center",
                                            mt: 0.5,
                                            '&:before': {
                                                content: '""',
                                                position: "absolute",
                                                inset: 0,
                                                background:
                                                    "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)",
                                                opacity: 0,
                                                transition: "opacity .4s",
                                                pointerEvents: "none",
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow:
                                                    "0 14px 34px -6px rgba(0,0,0,0.42), 0 6px 16px -2px rgba(0,0,0,0.30)",
                                                borderColor: palette.accent,
                                                '&:before': { opacity: 1 },
                                            },
                                            '&:active': { transform: 'translateY(-3px)', boxShadow: "0 8px 20px -8px rgba(0,0,0,0.4)" },
                                        }}
                                    >
                                        <CardHeader
                                            title={proyecto.proyecto_id}
                                            subheader={`${proyecto.estado === 0 ? 'Pendiente de asignación' :
                                                proyecto.estado === 1 ? 'Proyecto en ejecución' :
                                                    proyecto.estado === 2 ? 'Proyecto finalizado' :
                                                        proyecto.estado
                                                }`}
                                            sx={{ color: palette.primary, fontWeight: 600 }}
                                            subheaderTypographyProps={{ color: palette.textMuted }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Empresa:</strong> {proyecto.nombre || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Rut:</strong> {proyecto.rut || 'N/A'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ButtonGroup
                    size="small"
                    aria-label="pagination-button-group"
                    sx={{ p: 2, "& .MuiButton-root": { borderColor: palette.primaryDark } }}
                >
                    {getButtons()}
                </ButtonGroup>
            </Box>
        </MainLayout>
    );
}

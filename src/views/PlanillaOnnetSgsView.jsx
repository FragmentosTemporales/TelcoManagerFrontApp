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
import { useEffect, useState } from "react";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";
import { MainLayout } from "./Layout";
import { getPlantillaQuickBaseSGS } from "../api/calidadAPI";

function PlanillaOnnetSGSView() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [alertType, setAlertType] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [id_qb, setId_qb] = useState(null);
    const [pro, setPro] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getExcel = async () => {
        if (!id_qb || !pro) {
            setMessage('Por favor, completa ambos campos antes de descargar.');
            setAlertType('warning');
            setOpen(true);
            return;
        }
        setIsSubmitting(true);
        try {
            await getPlantillaQuickBaseSGS(id_qb, pro);
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(undefined);
        setAlertType(undefined);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

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
                    title="Planilla QuickBase/SGS"
                    subtitle="Busca un proyecto y descarga la plantilla de construcción QuickBase/SGS"
                    divider
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
                            <Box sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 4
                            }}>
                                <TextField
                                    size="small"
                                    label="ID QUICKBASE"
                                    variant="outlined"
                                    value={id_qb}
                                    onChange={(e) => setId_qb(e.target.value)}
                                    sx={{
                                        width: "300px",
                                        my: 3,
                                        mx: 1,
                                        borderRadius: 1
                                    }}
                                />
                                <TextField
                                    size="small"
                                    label="PRO-XXXXX"
                                    variant="outlined"
                                    value={pro}
                                    onChange={(e) => setPro(e.target.value)}
                                    sx={{
                                        width: "300px",
                                        my: 3,
                                        mx: 1,
                                        borderRadius: 1
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={getExcel}
                                    disabled={isSubmitting}
                                    sx={{
                                        width: "300px",
                                        my: 3,
                                        ml: { xs: 0, sm: 2 },
                                        borderRadius: 1,
                                        background: palette.primary,
                                        '&:hover': {
                                            background: palette.primaryDark,
                                        },
                                    }}
                                >
                                    Descargar
                                </Button>
                            </Box>

                        </Paper>
                    </>
                )}
            </Box>
        </MainLayout>
    );
}

export default PlanillaOnnetSGSView;

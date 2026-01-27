import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Modal,
    Paper,
    Typography,
    Fade,
    Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

export default function FormulariosCalidadReactiva() {
    const [alertType, setAlertType] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <MainLayout showNavbar={true}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    my: 4,
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
                    title="Formularios Calidad Reactiva"
                    subtitle="Gestiona los formularios asociados a calidad reactiva"
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

                        </Paper>

                    </>)}
            </Box>

        </MainLayout>
    );
}

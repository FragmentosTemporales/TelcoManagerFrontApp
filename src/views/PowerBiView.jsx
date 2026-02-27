import {
    Box,
    Button,
    Divider,
    FormControl,
    LinearProgress,
    MenuItem,
    Modal,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    TableHead,
    TextField,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { getBiToken } from "../api/authAPI";
import { useParams, Link } from "react-router-dom";

function PowerBiView() {
    const { report_id } = useParams();
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportId, setReportId] = useState(null);


    useEffect(() => {
        const fetchBiToken = async () => {
            try {
                setLoading(true);
                const token = await getBiToken()
                setAccessToken(token.bi_token);
            } catch (error) {
                console.error("Error fetching Power BI token:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBiToken();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (report_id) {
            setReportId(report_id);
        }
    }, [report_id]);

    return (
        <MainLayout showNavbar={false}>
            <Box
                sx={{
                    py: 2, // Menor margen vertical
                    border: `1px solid ${palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '98vh',
                    background: palette.bgGradient,
                    position: 'relative',
                    width: '100%',
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.06), transparent 65%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                {/* Botón volver absoluto y redondo */}
                <Link to="/modulo:power-bi" style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '50%',
                            minWidth: 0,
                            width: 48,
                            height: 48,
                            boxShadow: 2,
                            p: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(80,80,80,0.35)',
                            color: '#fff',
                            transition: 'background 0.2s',
                            '&:hover': {
                                background: 'rgba(80,80,80,0.55)',
                            },
                        }}
                    >
                        {/* Flecha hacia atrás SVG */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 19L9.5 12L15.5 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </Link>
                {(!loading && accessToken) ? (
                    <Box
                        sx={{
                            width: { xs: '100%', md: '99%' },
                            height: 'calc(95vh)', // Menor margen vertical
                            maxWidth: '100%',
                            minHeight: '99%', // Menor altura mínima
                            position: 'relative',
                            background: '#fff2',
                            overflow: 'hidden',
                            '& > div': {
                                height: '100% !important',
                            },
                        }}
                    >
                        <PowerBIEmbed
                            embedConfig={{
                                type: 'report',
                                id: reportId,
                                embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=d1753f40-5314-4159-8c3a-a1e59ea00c2c`,
                                accessToken: accessToken,
                                tokenType: models.TokenType.Aad,
                                settings: {
                                    layoutType: models.LayoutType.FitToWidth,
                                    panes: {
                                        filters: { expanded: false, visible: false },
                                    },
                                    background: models.BackgroundType.Default,
                                },
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            background: '#fff3',
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: palette.textPrimary }}>
                            Cargando reporte...
                        </Typography>
                        <LinearProgress sx={{ width: '100%' }} />
                    </Box>
                )}
            </Box>
        </MainLayout>
    );
}

export default PowerBiView;

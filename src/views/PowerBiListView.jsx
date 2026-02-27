import {
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  FormControl,
  LinearProgress,
  MenuItem,
  Modal,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import { getBiListQuery } from "../api/authAPI";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLoad, onLoading } from "../slices/reportesSlice";
import SearchIcon from '@mui/icons-material/Search';

function PowerBiListView() {
  const reportesState = useSelector((state) => state.reportes);
  const dispatch = useDispatch();

  const { data, is_load } = reportesState;
  const safeData = Array.isArray(data) ? data : [];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    const fetchBiToken = async () => {
      dispatch(onLoading());
      try {
        const data = await getBiListQuery();
        dispatch(onLoad(data.reportes));
      } catch (error) {
        console.error("Error fetching Power BI token:", error);
      } finally {
      }
    };
    { !data && fetchBiToken() }

    window.scrollTo(0, 0);
  }, []);


  const accesosFiltrados = safeData.filter((acceso) => {
    const term = searchTerm.toLowerCase();
    return (
      acceso.hashTag?.toLowerCase().includes(term) ||
      acceso.nombre?.toLowerCase().includes(term)
    );
  });

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          py: 10,
          px: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: palette.bgGradient,
          overflow: "hidden",
          '::before': {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.06), transparent 65%)",
            pointerEvents: "none",
          },
        }}
      >
        <Fade in timeout={1000}>
          <Box sx={{ width: "100%", maxWidth: 1320, mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              Panel Principal de Reportes
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "rgba(255,255,255,0.8)", maxWidth: 760 }}
            >
              Selecciona un reporte para comenzar. Acceso filtrado de acuerdo a tus permisos.
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ width: "100%", maxWidth: 1320, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar reporte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                color: '#fff',
                transition: 'all 0.3s',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: palette.accent,
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.6)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>


        {is_load && data && data.length > 0 ? (
          <Grid
            container
            rowSpacing={{ xs: 5, sm: 6, md: 7 }}
            columnSpacing={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }}
            sx={{
              width: "100%",
              maxWidth: { xs: 1320, lg: 1460, xl: 1600 },
              mb: 14,
              transition: 'max-width .4s ease'
            }}
            alignItems="stretch"
          >
            {accesosFiltrados.map((acceso, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                <Paper
                  component={Link}
                  to={`/modulo:power-bi/${acceso.rpt}`}
                  elevation={10}
                  sx={{
                    textDecoration: "none",
                    minHeight: "70%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    p: 2.5,
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
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: palette.primary,
                        textAlign: "start",
                        marginBottom: 0.5,
                      }}
                    >
                      {acceso.hashTag}
                    </Typography>
                    <Typography
                      variant="body"
                      sx={{
                        color: palette.textMuted,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textAlign: "start",
                        marginBottom: 0.5,
                      }}
                    >
                      {acceso.nombre}
                    </Typography>

                    <Divider sx={{ my: 1.5, borderColor: palette.borderSubtle }} />

                    <Typography
                      variant="body"
                      sx={{ color: palette.textMuted, fontSize: "0.85rem", textAlign: "start" }}
                    >
                      {acceso.descri}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
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
              Cargando información...
            </Typography>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export default PowerBiListView;

import { Box, Divider, Grid, Typography, Paper, Fade, TextField, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";
import { useEffect, useState } from "react";
import { palette } from "../theme/palette";
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const authState = useSelector((state) => state.auth);
  const { permisos } = authState;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const secciones = [
    {
      head: "Gestión de Tickets",
      title: "Gestiona los tickets de soporte",
      link: "/modulo:gestion-ticketera",
      moduloID: 26,
    },
    {
      head: "ONNET PROYECTOS CONSTRUCCIÓN",
      title: "Gestiona los proyectos de construcción OnNet",
      link: "/onnet/modulo/proyectos",
      moduloID: 26,
    },
    {
      head: "NDC_Bot Manager",
      title: "Gestiona la automatización del NDC Bot",
      link: "/modulo:ndc/session-logs",
      moduloID: 2,
    },
    {
      head: "Monitoreo Telcomanager",
      title: "Visualiza estadísticas de consultas Log Query para Telcomanager",
      link: "/modulo:log-query",
      moduloID: 26,
    },
    {
      head: "Registro de Reparaciones",
      title: "Visualiza las reparaciones realizadas",
      link: "/modulo:reparaciones",
      moduloID: 21,
    },
    {
      head: "Registros DomApp",
      title: "Visualiza, filtra y monitorea los últimos registros de las automatizaciones en DomApp.",
      link: "/modulo:ultimos-logs",
      moduloID: 26,
    },
    {
      head: "Lista de Proyectos Consolidados",
      title: "Gestiona y visualiza Proyectos",
      link: "/proyectos-onnet",
      moduloID: 24,
    },
    {
      head: "Lista de Proyectos Link VNO",
      title: "Gestiona y visualiza Proyectos Correspondientes a Link VNO",
      link: "/proyectos-link-vno",
      moduloID: 24,
    },
    // {
    //   head: "Gestion de Proyectos",
    //   title: "Gestiona tus proyectos y tareas",
    //   link: "/modulo:proyecto-interno",
    //   moduloID: 26,
    // },
    // {
    //   head: "Migraciones Proactivas",
    //   title: "Vista de Migraciones Proactivas",
    //   link: "/modulo:migraciones-proactivas",
    //   moduloID: 27,
    // },
    {
      head: "Reversa",
      title: "Listado de Reversas Pendientes",
      link: "/modulo:reversa",
      moduloID: 2,
    },
    {
      head: "Amonestaciones",
      title: "Listado de Solicitudes de Amonestación",
      link: "/modulo:solicitudes",
      moduloID: 3,
    },
    {
      head: "Gestión Formularios AST",
      title: "Espacio para gestionar los formulario AST",
      link: "/form-ast-list",
      moduloID: 7,
    },
    {
      head: "Mis Solicitudes",
      title: "Revisa el estado de tus solicitudes de Amonestación",
      link: "/mis-solicitudes",
      moduloID: 20,
    },
    {
      head: "Respaldos Calidad",
      title: "Revisa la lista de respaldos",
      link: "/modulo:respaldos",
      moduloID: 1028,
    },
    {
      head: "Crear Ticket",
      title: "Crear Ticket para Soporte Estadístico",
      link: "/modulo:ticketera",
      moduloID: 25,
    },
    // {
    //   head: "Crear Migraciones Proactivas",
    //   title: "Crear Migraciones Proactivas ",
    //   link: "/modulo:create-migracion-proactiva",
    //   moduloID: 27,
    // },
    {
      head: "Agendamiento",
      title: "Gestiona despachos y agendamientos",
      link: "/agendamientos",
      moduloID: 19,
    },
    {
      head: "Gestión Totem",
      title: "Espacio para gestión de atención",
      link: "/totem",
      moduloID: 13,
    },
    {
      head: "Objetivos OnNet",
      title: "Espacio para definir los objetivos por zona",
      link: "/objetivos",
      moduloID: 5,
    },
    {
      head: "Gestión Bodega RM",
      title:
        "Espacio para gestión de atención en bodega en la Región Metropolitana",
      link: "/bodegaRM",
      moduloID: 10,
    },
    {
      head: "Gestión Bodega Quinta",
      title: "Espacio para gestión de atención en bodega de la V Región",
      link: "/bodegaQuinta",
      moduloID: 12,
    },
    {
      head: "Gestión Supervisor",
      title: "Espacio para gestión de técnicos",
      link: "/supervisor",
      moduloID: 14,
    },
    // {
    //   head: "Carga Planilla Construcción",
    //   title: "Espacio para cargar planilla de construcción",
    //   link: "/carga-construccion",
    //   moduloID: 6,
    // },
    // {
    //   head: "Gestión Inventario",
    //   title: "Gestiona lista de asistentes a inventario",
    //   link: "/modulo:inventario",
    //   moduloID: 28,
    // },
  ];

  const accesos = secciones.filter((seccion) =>
    permisos.some(
      (permiso) => permiso.moduloID === seccion.moduloID && permiso.access
    )
  );

  const accesosFiltrados = accesos.filter((acceso) =>
    acceso.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
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
              Panel Principal
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "rgba(255,255,255,0.8)", maxWidth: 760 }}
            >
              Selecciona un módulo para comenzar. Acceso filtrado de acuerdo a tus permisos.
            </Typography>
          </Box>
        </Fade>
        
        <Box sx={{ width: "100%", maxWidth: 1320, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar módulo..."
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

        {accesos && accesos.length > 0 ? (
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
                  to={acceso.link}
                  elevation={10}
                  sx={{
                    textDecoration: "none",
                    minHeight: "70%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    p: 2.5,
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
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: palette.primary,
                        mb: 1,
                        textAlign: "center"
                      }}
                    >
                      {acceso.head}
                    </Typography>
                    <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                    <Typography
                      variant="body2"
                      sx={{ color: palette.textMuted, fontSize: "0.85rem", textAlign: "center" }}
                    >
                      {acceso.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={6}
            sx={{
              px: 5,
              py: 6,
              borderRadius: 4,
              background: palette.cardBg,
              border: `1px solid ${palette.borderSubtle}`,
              backdropFilter: "blur(4px)",
              textAlign: "center",
              maxWidth: 520,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary }}>
              Sin accesos disponibles
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5, color: palette.textMuted }}>
              No se encontraron módulos asociados a tus permisos. Contacta a un administrador si esto es un error.
            </Typography>
          </Paper>
        )}
      </Box>
    </MainLayout>
  );
}

export default Home;

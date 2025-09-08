import { Box, Divider, Grid, Typography, Paper, Chip, Fade } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";
import { useEffect } from "react";
import { palette } from "../theme/palette";

function Home() {
  const authState = useSelector((state) => state.auth);
  const { permisos } = authState;

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
    // {
    //   head: "Mis Proyectos Asignados",
    //   title: "Revisa la lista de proyectos asignados a tu empresa",
    //   link: "/modulo:proyectos-asignados",
    //   moduloID: 4,
    // },
    {
      head: "Lista de Proyectos Consolidados",
      title: "Gestiona y visualiza Proyectos",
      link: "/proyectos-onnet",
      moduloID: 24,
    },
    {
      head: "Registros DomApp",
      title: "Visualiza, filtra y monitorea los últimos registros de las automatizaciones en DomApp.",
      link: "/modulo:ultimos-logs",
      moduloID: 26,
    },

    {
      head: "Gestion de Proyectos",
      title: "Gestiona tus proyectos y tareas",
      link: "/modulo:proyecto-interno",
      moduloID: 26,
    },
    {
      head: "Migraciones Proactivas",
      title: "Vista de Migraciones Proactivas",
      link: "/modulo:migraciones-proactivas",
      moduloID: 27,
    },
    {
      head: "Reversa",
      title: "Listado de Reversas Pendientes",
      link: "/modulo:reversa",
      moduloID: 2,
    },

    // {
    //   head: "Creación de Reparaciones",
    //   title: "Carga las pruebas de las reparaciones realizadas",
    //   link: "/modulo:registro-reparacion",
    //   moduloID: 4,
    // },
    // {
    //   head: "Registro de Reparaciones",
    //   title: "Visualiza las reparaciones realizadas",
    //   link: "/modulo:reparaciones",
    //   moduloID: 4,
    // },

    {
      head: "NDC_Bot Manager",
      title: "Gestiona la automatización del NDC Bot",
      link: "/modulo:ndc/session-logs",
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
      head: "Crear Ticket",
      title: "Crear Ticket para Soporte Estadístico",
      link: "/modulo:ticketera",
      moduloID: 25,
    },
    {
      head: "Crear Migraciones Proactivas",
      title: "Crear Migraciones Proactivas ",
      link: "/modulo:create-migracion-proactiva",
      moduloID: 27,
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
      head: "Gestión Totem",
      title: "Espacio para gestión de atención",
      link: "/totem",
      moduloID: 13,
    },
    {
      head: "Gestión Supervisor",
      title: "Espacio para gestión de técnicos",
      link: "/supervisor",
      moduloID: 14,
    },
    {
      head: "Agendamiento",
      title: "Gestiona despachos y agendamientos",
      link: "/agendamientos",
      moduloID: 19,
    },
    {
      head: "Carga Planilla Construcción",
      title: "Espacio para cargar planilla de construcción",
      link: "/carga-construccion",
      moduloID: 6,
    },
    {
      head: "Monitoreo Telcomanager",
      title: "Visualiza estadísticas de consultas Log Query para Telcomanager",
      link: "/modulo:log-query",
      moduloID: 26,
    },
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
        <Fade in timeout={600}>
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
        {accesos && accesos.length > 0 ? (
          <Grid
            container
            rowSpacing={{ xs: 5, sm: 6, md: 7 }}
            columnSpacing={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }}
            // Mantener 3 columnas en pantallas grandes y permitir que el ancho de cada card crezca
            sx={{
              width: "100%",
              maxWidth: { xs: 1320, lg: 1460, xl: 1600 },
              mb: 14,
              transition: 'max-width .4s ease'
            }}
            alignItems="stretch"
          >
            {accesos.map((acceso, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                <Paper
                  component={Link}
                  to={acceso.link}
                  elevation={10}
                  sx={{
                    textDecoration: "none",
                    height: "100%",
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
                    <Chip
                      label={acceso.head}
                      size="small"
                      sx={{
                        mb: 1.5,
                        fontWeight: 600,
                        bgcolor: palette.accentSoft,
                        color: palette.primary,
                        letterSpacing: 0.3,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: palette.primary,
                        mb: 1,
                      }}
                    >
                      {acceso.head}
                    </Typography>
                    <Divider sx={{ mb: 1.5, borderColor: palette.borderSubtle }} />
                    <Typography
                      variant="body2"
                      sx={{ color: palette.textMuted, fontSize: "0.85rem" }}
                    >
                      {acceso.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      color: palette.accent,
                      fontWeight: 500,
                      letterSpacing: 0.5,
                      opacity: 0.9,
                      transition: "opacity .3s",
                      '.MuiPaper-root:hover &': { opacity: 1 },
                    }}
                  >
                    Ingresar →
                  </Typography>
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

import { Box, Divider, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";
import { useEffect } from "react";

function Home() {
  const authState = useSelector((state) => state.auth);
  const { permisos } = authState;

  const secciones = [
    {
      head: "Gestión de Tickets",
      title: "Gestiona los tickets de soporte",
      link: "/modulo:gestion-ticketera",
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
    {
      head: "NDC_Bot Manager",
      title: "Gestiona la automatización del NDC Bot",
      link: "/modulo:ndc/pendientes-sin-consumo",
      moduloID: 2,
    },
    {
      head: "Amonestaciones",
      title: "Listado de Solicitudes de Amonestación",
      link: "/modulo:solicitudes",
      moduloID: 3,
    },
    {
      head: "Área de Creación",
      title: "Espacio para crear nuevos usuarios",
      link: "/createzone",
      moduloID: 4,
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
      head: "Lista de Proyectos Consolidados",
      title: "Gestiona y visualiza Proyectos",
      link: "/proyectos-onnet",
      moduloID: 24,
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
      link: "/modulo:log-query/log-query-stats",
      moduloID: 26,
    }
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "90vh",
          paddingY: "60px",
          backgroundColor: "#f0f0f0",
        }}
      >
        {accesos && accesos.length > 0 ? (
          <Grid
            container
            spacing={2}
            sx={{ width: "90%" }}
            justifyContent="center"
            alignItems="center"
          >
            {accesos.map((acceso, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    height: {
                      lg: "100px",
                      md: "150px",
                      sm: "180px",
                      xs: "100px",
                    },
                    borderRadius: 2,
                    border: "2px solid #dfdeda",
                    backgroundColor: "white",
                    flexDirection: "column",
                    textDecoration: "none",
                    padding: 2,
                    position: "relative",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
                    },
                  }}
                  component={Link}
                  to={acceso.link}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {acceso.head}
                  </Typography>
                  <Divider sx={{ my: 1, backgroundColor: "#dfdeda" }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {acceso.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </MainLayout>
  );
}

export default Home;

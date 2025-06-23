import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import UploadIcon from "@mui/icons-material/Upload";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import BarChartIcon from "@mui/icons-material/BarChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import BallotIcon from "@mui/icons-material/Ballot";
import DvrIcon from "@mui/icons-material/Dvr";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const authState = useSelector((state) => state.auth);
  const { permisos } = authState;

  const secciones = [
    {
      head: "Reportes",
      icono: <BarChartIcon />,
      title: "Vista de Reportes",
      link: "/modulo:charts",
      moduloID: 1,
    },
    {
      head: "Reversa",
      icono: <FlipCameraAndroidIcon />,
      title: "Listado de Reversas Pendientes",
      link: "/modulo:reversa",
      moduloID: 2,
    },
    {
      head: "Reparaciones",
      icono: <FlipCameraAndroidIcon />,
      title: "Creación de Reparaciones",
      link: "/modulo:crear-reparacion",
      moduloID: 1,
    },
    {
      head: "Amonestaciones",
      icono: <FormatListBulletedIcon />,
      title: "Listado de Solicitudes de Amonestación",
      link: "/modulo:solicitudes",
      moduloID: 3,
    },
    {
      head: "Mis Solicitudes",
      icono: <FormatListBulletedIcon />,
      title: "Revisa el estado de tus solicitudes de Amonestación",
      link: "/mis-solicitudes",
      moduloID: 20,
    },
    {
      head: "Área de Creación",
      icono: <AccountBoxIcon />,
      title: "Espacio de Creación",
      link: "/createzone",
      moduloID: 4,
    },
    {
      head: "Objetivos OnNet",
      icono: <SportsScoreIcon />,
      title: "Espacio para definir los objetivos por zona",
      link: "/objetivos",
      moduloID: 5,
    },
    {
      head: "Asignados OnNet General",
      icono: <BallotIcon />,
      title: "Espacio para visualizar Proyectos Asignados",
      link: "/asignados",
      moduloID: 11,
    },
    {
      head: "Gestión Formularios AST",
      icono: <DvrIcon />,
      title: "Espacio para gestionar los formulario AST",
      link: "/form-ast-list",
      moduloID: 7,
    },
    {
      head: "Gestión Bodega RM",
      icono: <InventoryIcon />,
      title:
        "Espacio para gestión de atención en bodega en la Región Metropolitana",
      link: "/bodegaRM",
      moduloID: 10,
    },
    {
      head: "Gestión Bodega Quinta",
      icono: <InventoryIcon />,
      title: "Espacio para gestión de atención en bodega de la V Región",
      link: "/bodegaQuinta",
      moduloID: 12,
    },
    {
      head: "Gestión Totem",
      icono: <AutoAwesomeMosaicIcon />,
      title: "Espacio para gestión de atención",
      link: "/totem",
      moduloID: 13,
    },
    {
      head: "Gestión Supervisor",
      icono: <AssignmentIndIcon />,
      title: "Espacio para gestión de técnicos",
      link: "/supervisor",
      moduloID: 14,
    },
    {
      head: "Chat Soporte",
      icono: <ContactSupportIcon />,
      title: "Espacio para consulta y soporte técnico",
      link: "/chatbot",
      moduloID: 15,
    },
    {
      head: "Agendamiento",
      icono: <NewspaperIcon />,
      title: "Gestiona despachos y agendamientos",
      link: "/agendamientos",
      moduloID: 19,
    },
    {
      head: "Buscador de Ordenes",
      icono: <SearchIcon />,
      title: "Buscador de Ordenes de Trabajo",
      link: "/orden_info",
      moduloID: 19,
    },
    {
      head: "Auditorías",
      icono: <NewspaperIcon />,
      title: "Gestiona y crea auditorías",
      link: "/auditorias",
      moduloID: 21,
    },
    {
      head: "Lista de Auditorías",
      icono: <NewspaperIcon />,
      title: "Gestiona y visualiza auditorías",
      link: "/all_auditorias",
      moduloID: 22,
    },
    {
      head: "Lista de Proyectos Consolidados",
      icono: <NewspaperIcon />,
      title: "Gestiona y visualiza Proyectos",
      link: "/proyectos-onnet",
      moduloID: 24,
    },
    {
      head: "Carga Planilla Construcción",
      icono: <UploadIcon />,
      title: "Espacio para cargar planilla de construcción",
      link: "/carga-construccion",
      moduloID: 6,
    },
    {
      head: "Crear Ticket",
      icono: <ConfirmationNumberIcon />,
      title: "Crear Ticket para Soporte Estadístico",
      link: "/modulo:ticketera",
      moduloID: 25,
    },
  ];

  const accesos = secciones.filter((seccion) =>
    permisos.some(
      (permiso) => permiso.moduloID === seccion.moduloID && permiso.access
    )
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
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
                    md: "180px",
                    sm: "180px",
                    xs: "150px",
                  },
                  boxShadow: 2,
                  backgroundColor: "white",
                  flexDirection: "column",
                  textDecoration: "none",
                  padding: 2,
                  position: "relative",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  },
                }}
                component={Link}
                to={acceso.link}
              >
                <Typography
                  variant="h6"
                  sx={{
                    paddingLeft: 1,
                    justifyContent: "start",
                    display: "flex",
                    width: "90%",
                  }}
                  fontWeight="bold"
                >
                  #{acceso.head}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    justifyContent: "start",
                    display: "flex",
                    width: "90%",
                    paddingLeft:1,
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
  );
}

export default Home;

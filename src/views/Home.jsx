import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import NewspaperIcon from '@mui/icons-material/Newspaper';
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
      body: "Acá encontrarás los diferentes reportes gestionados en PowerBI",
      moduloID: 1,
    },
    {
      head: "Reversa",
      icono: <FlipCameraAndroidIcon />,
      title: "Listado de Reversas Pendientes",
      link: "/modulo:reversa",
      body: "Acá encontrarás la lista de reversas pendientes y entregadas",
      moduloID: 2,
    },
    {
      head: "Reparaciones",
      icono: <FlipCameraAndroidIcon />,
      title: "Creación de Reparaciones",
      link: "/modulo:crear-reparacion",
      body: "Acá podrás crear un registro de reparación para una orden de trabajo",
      moduloID: 1,
    },
    {
      head: "Amonestaciones",
      icono: <FormatListBulletedIcon />,
      title: "Listado de Solicitudes de Amonestación",
      link: "/modulo:solicitudes",
      body: "Acá encontrarás la lista de todas las Amonestaciones solicitadas y sus estados.",
      moduloID: 3,
    },
    {
      head: "Mis Solicitudes",
      icono: <FormatListBulletedIcon />,
      title: "Revisa el estado de tus solicitudes de Amonestación",
      link: "/mis-solicitudes",
      body: "Acá encontrarás la lista de Amonestaciones asociadas a tu usuario.",
      moduloID: 20,
    },
    {
      head: "Área de Creación",
      icono: <AccountBoxIcon />,
      title: "Espacio de Creación",
      link: "/createzone",
      body: "Acá podrás crear Usuarios y editar preferencias",
      moduloID: 4,
    },
    {
      head: "Objetivos OnNet",
      icono: <SportsScoreIcon />,
      title: "Espacio para definir los objetivos por zona",
      link: "/objetivos",
      body: "Acá podrás definir los objetivos mensuales según la zona a elegir",
      moduloID: 5,
    },
    /*
        {
      head: "Asignados OnNet",
      icono: <BallotIcon />,
      title: "Espacio para visualizar Proyectos Asignados",
      link: "/asignados-user",
      body: "Acá podrás gestionar los proyectos asignados a tu Usuario",
      moduloID: 6,
    },
    */
    {
      head: "Asignados OnNet General",
      icono: <BallotIcon />,
      title: "Espacio para visualizar Proyectos Asignados",
      link: "/asignados",
      body: "Acá podrás gestionar los proyectos asignados a los diferentes usuarios.",
      moduloID: 11,
    },
    {
      head: "Gestión Formularios AST",
      icono: <DvrIcon />,
      title: "Espacio para gestionar los formulario AST",
      link: "/form-ast-list",
      body: "Acá podrás gestionar los formularios enviados por los trabajadores",
      moduloID: 7,
    },
    {
      head: "Gestión Bodega RM",
      icono: <InventoryIcon />,
      title:
        "Espacio para gestión de atención en bodega en la Región Metropolitana",
      link: "/bodegaRM",
      body: "Acá podrás ver los números de atención y gestionar procesos internos",
      moduloID: 10,
    },
    {
      head: "Gestión Bodega Quinta",
      icono: <InventoryIcon />,
      title: "Espacio para gestión de atención en bodega de la V Región",
      link: "/bodegaQuinta",
      body: "Acá podrás ver los números de atención y gestionar procesos internos",
      moduloID: 12,
    },
    {
      head: "Gestión Totem",
      icono: <AutoAwesomeMosaicIcon />,
      title: "Espacio para gestión de atención",
      link: "/totem",
      body: "Acá podrás ver los números de atención y gestionar procesos internos",
      moduloID: 13,
    },
    {
      head: "Gestión Supervisor",
      icono: <AssignmentIndIcon />,
      title: "Espacio para gestión de técnicos",
      link: "/supervisor",
      body: "Acá podrás ver el estado de los técnicos y gestionar sus procesos",
      moduloID: 14,
    },
    {
      head: "Chat Soporte",
      icono: <ContactSupportIcon />,
      title: "Espacio para consulta y soporte técnico",
      link: "/chatbot",
      body: "Acá podrás realizar preguntas a un chat destinado al apoyo para técnicos",
      moduloID: 15,
    },
    {
      head: "Agendamiento",
      icono: <NewspaperIcon />,
      title: "Gestiona despachos y agendamientos",
      link: "/agendamientos",
      body: "Acá podrás gestionar órdenes de trabajo y agendamientos",
      moduloID: 19,
    },
    {
      head: "Buscador de Ordenes",
      icono: <SearchIcon />,
      title: "Buscador de Ordenes de Trabajo",
      link: "/orden_info",
      body: "Acá podrás buscar órdenes de trabajo y gestiones por número de orden",
      moduloID: 19,
    },
    {
      head: "Auditorías",
      icono: <NewspaperIcon />,
      title: "Gestiona y crea auditorías",
      link: "/auditorias",
      body: "Acá podrás gestionar, crear y visualizar auditorías",
      moduloID: 21,
    },
    {
      head: "Lista de Auditorías",
      icono: <NewspaperIcon />,
      title: "Gestiona y visualiza auditorías",
      link: "/all_auditorias",
      body: "Acá podrás gestionar, crear y visualizar todas las auditorías realizadas",
      moduloID: 22,
    },
    {
      head: "Lista de Proyectos Consolidados",
      icono: <NewspaperIcon />,
      title: "Gestiona y visualiza Proyectos",
      link: "/proyectos-onnet",
      body: "Acá podrás visualizar los proyectos consolidados de OnNet",
      moduloID: 24,
    },
    {
      head: "Carga Planilla Construcción",
      icono: <UploadIcon />,
      title: "Espacio para cargar planilla de construcción",
      link: "/carga-construccion",
      body: "Acá podrás enviar la planilla de construcción para su procesamiento y carga a DB",
      moduloID: 6,
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
              <Card
                sx={{
                  minHeight: "150px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "20px",
                  position: "relative",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardHeader
                  title={
                    <Typography
                      fontWeight="bold"
                      sx={{ fontFamily: "initial", fontSize: "14px" }}
                    >
                      {acceso.head}
                    </Typography>
                  }
                  avatar={acceso.icono}
                  sx={{
                    background: "#0b2f6d",
                    color: "white",
                    textAlign: "end",
                  }}
                />
                <Link to={acceso.link} style={{ textDecoration: "none" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      fontSize={"18px"}
                      fontWeight={"bold"}
                      fontFamily={"initial"}
                      sx={{ fontFamily: "initial", fontSize: "14px", textAlign: "center" }}
                    >
                      {acceso.title}
                    </Typography>

                    <CardActions
                      sx={{ display: "flex", justifyContent: "center" }}
                    ></CardActions>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}

export default Home;

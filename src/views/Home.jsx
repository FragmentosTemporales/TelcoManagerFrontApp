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
import BarChartIcon from "@mui/icons-material/BarChart";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SportsScoreIcon from '@mui/icons-material/SportsScore';
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
      link: "/charts",
      body: "Acá encontrarás los diferentes reportes gestionados en PowerBI",
      estado: false,
      moduloID: 1,
    },
    {
      head: "Reversa",
      icono: <FlipCameraAndroidIcon />,
      title: "Listado de Reversas Pendientes",
      link: "reversa",
      body: "Acá encontrarás la lista de reversas pendientes y entregadas",
      estado: true,
      moduloID: 2,
    },
    {
      head: "Amonestaciones",
      icono: <FormatListBulletedIcon />,
      title: "Listado de Solicitudes de Amonestación",
      link: "/solicitudes",
      body: "Acá encontrarás la lista de Amonestaciones solicitadas",
      estado: true,
      moduloID: 3,
    },
    {
      head: "Área de Creación",
      icono: <AccountBoxIcon />,
      title: "Espacio de Creación",
      link: "/createzone",
      body: "Acá podrás crear Usuarios y editar preferencias",
      estado: true,
      moduloID: 4,
    },
    {
      head: "Objetivos OnNet",
      icono: <SportsScoreIcon />,
      title: "Espacio para definir los objetivos por zona",
      link: "/objetivos",
      body: "Acá podrás definir los objetivos mensuales según la zona a elegir",
      estado: false,
      moduloID: 5,
    },
  ];

  const accesos = secciones.filter((seccion) => 
    permisos.some(permiso => permiso.moduloID === seccion.moduloID && permiso.access)
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
        <Grid container spacing={2} sx={{ width: "80%" }}>
          {accesos.map((acceso, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  minHeight: "250px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 0,
                }}
              >
                <CardHeader
                  title={
                    <Typography fontWeight="bold" sx={{fontFamily:'monospace'}} >{acceso.head}</Typography>
                  }
                  avatar={acceso.icono}
                  sx={{
                    background: "#0b2f6d",
                    color: "white",
                    textAlign: "end",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    fontSize={"18px"}
                    fontWeight={"bold"}
                    fontFamily={'monospace'}
                    sx={{ minHeight: "60px", textAlign: "center" }}
                  >
                    {acceso.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily={'monospace'}
                    sx={{
                      color: "text.secondary",
                      p: 2,
                      minHeight: "60px",
                      textAlign: "center",
                    }}
                  >
                    {acceso.body}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily={'monospace'}
                    sx={{
                      p: 2,
                      minHeight: "10px",
                      textAlign: "center",
                    }}
                  >
                    {acceso.estado ? "Funcionando" : "Modo Prueba"}
                  </Typography>
                  <CardActions
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Link to={acceso.link}>
                      <Button
                        variant="contained"
                        color="info"
                        sx={{ width: "200px" }}
                      >
                        IR
                      </Button>
                    </Link>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}

export default Home;

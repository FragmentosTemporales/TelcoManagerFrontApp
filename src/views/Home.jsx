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
import SettingsIcon from '@mui/icons-material/Settings';
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import BallotIcon from "@mui/icons-material/Ballot";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DvrIcon from '@mui/icons-material/Dvr';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { onLoad, onLoading, setMessage } from "../slices/proyectosSlice";
import {
  onLoad as onLoadAsignados,
  onLoading as onLoadingAsignados,
} from "../slices/asignadosSlice";

import {
  getProyectos,
  getAsignados,
  getaLLAsignados,
} from "../api/proyectoAPI";
import { useEffect, useState } from "react";

function Home() {
  const authState = useSelector((state) => state.auth);
  const proyectoState = useSelector((state) => state.proyectos);
  const { permisos, token, empresa } = authState;
  const { data: dataProyecto } = proyectoState;

  const dispatch = useDispatch();

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
      estado: true,
      moduloID: 5,
    },
    {
      head: "Asignados OnNet",
      icono: <BallotIcon />,
      title: "Espacio para visualizar Proyectos Asignados",
      link: "/asignados",
      body: "Acá podrás gestionar los proyectos asignados",
      estado: true,
      moduloID: 6,
    },
    {
      head: "Gestión Formularios AST",
      icono: <DvrIcon />,
      title: "Espacio para gestionar los formulario AST",
      link: "/form-ast-list",
      body: "Acá podrás gestionar los formularios enviados por los trabajadores",
      estado: true,
      moduloID: 7,
    },
    {
      head: "Prevencion AST",
      icono: <FormatListNumberedIcon/>,
      title: "Espacio para completar formulario AST",
      link: "/form-ast",
      body: "Acá podrás completar tu formulario y enviarlo directamente a la base de datos",
      estado: true,
      moduloID: 8,
    }
  ];

  const accesos = secciones.filter((seccion) =>
    permisos.some(
      (permiso) => permiso.moduloID === seccion.moduloID && permiso.access
    )
  );

  const fetchData = async () => {
    if (dataProyecto == null) {
      try {
        dispatch(onLoading());
        const res = await getProyectos(token);
        dispatch(onLoad(res));
      } catch (error) {
        dispatch(setMessage("Información no encontrada."));
      }
    }
  };

  const fetchAsignados = async () => {
    try {
      dispatch(onLoadingAsignados());
      const res = await getAsignados(token, 1);
      dispatch(onLoadAsignados(res));
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
    }
  };

  const fetchAllAsignados = async () => {
    try {
      dispatch(onLoadingAsignados());
      const res = await getaLLAsignados(token, 1);
      dispatch(onLoadAsignados(res));
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (empresa) {
      if (empresa.empresaID == 1) {
        fetchAllAsignados();
      } else {
        fetchAsignados();
      }
    }
  }, [empresa]);

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
          sx={{ width: "80%" }}
          justifyContent="center"
          alignItems="center"
        >
          {accesos.map((acceso, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  minHeight: "400px",
                  maxWidth: "400px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "0px",
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
                      sx={{ fontFamily: "initial" }}
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
                      sx={{ minHeight: "80px", textAlign: "center" }}
                    >
                      {acceso.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily={"initial"}
                      sx={{
                        color: "text.secondary",
                        p: 2,
                        minHeight: "80px",
                        textAlign: "center",
                      }}
                    >
                      {acceso.body}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily={"initial"}
                      sx={{
                        p: 2,
                        minHeight: "20px",
                        textAlign: "center",
                      }}
                    >
                      {acceso.estado ? "Funcionando" : "Modo Prueba"}
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

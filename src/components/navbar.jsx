import {
  Box,
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  Tooltip,
  Badge,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import BarChartIcon from "@mui/icons-material/BarChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../slices/authSlice";
import { getNotificaciones } from "../api/notificacionesAPI";
import { onLoad, onLoading } from "../slices/notificacionSlice";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Whatsapp from "./wsp";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const notificacionState = useSelector((state) => state.notificacion);
  const { token, nombre } = authState;
  const { data } = notificacionState;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nameBar, setNameBar] = useState(null);
  const [badgelen, setBadgelen] = useState(0);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    {
      to: "/notificaciones",
      label: (
        <Badge badgeContent={badgelen} color="primary">
          <MailIcon />
        </Badge>
      ),
      title: "NOTIFICACIONES",
    },
    { to: "/", label: <BarChartIcon />, title: "REPORTES" },
    {
      to: "/solicitudes",
      label: <FormatListBulletedIcon />,
      title: "SOLICITUDES",
    },
    { to: "/create", label: <NoteAddIcon />, title: "CREAR SOLICITUD" },
    { to: "/reversa", label: <FlipCameraAndroidIcon />, title: "MENU REVERSA" },
  ];

  const getFirstName = (nombre) => {
    if (!nombre) return "";
    return nombre.split(" ")[0];
  };

  const fetchData = async () => {
    try {
      dispatch(onLoading());
      const res = await getNotificaciones(token);
      dispatch(onLoad(res));
    } catch (error) {
      console.error("Error fetching notificaciones:", error);
    }
  };

  useEffect(() => {
    if (nombre) {
      setNameBar(getFirstName(nombre));
    }
  }, [nombre]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (data) {
      const list = [];
      for (const item of data) {
        if (item.read === false) {
          list.push(item);
        }
      }
      setBadgelen(list.length);
    }
  }, [data]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ background: "#0b2f6d" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {token && (
            <>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{
                    width: 300,
                    background: "#0b2f6d",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List sx={{ flexGrow: 1, pt: 1 }}>
                    {menuItems.map((item, index) => (
                      <ListItem key={index}>
                        <Tooltip title={item.title} placement="left">
                          <Button
                            variant="contained"
                            color="info"
                            sx={{ width: "100%", p: 1 }}
                          >
                            <Link
                              to={item.to}
                              style={{
                                color: "white",
                                textDecoration: "none",
                                width: "100%",
                                height: "100%",
                                fontWeight: "bold",
                              }}
                            >
                              {item.label}
                            </Link>
                          </Button>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ p: 1 }}>
                    <Button
                      variant="contained"
                      color="info"
                      sx={{ width: "100%", height: "40px", fontWeight: "bold" }}
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                    >
                      CERRAR SESION
                    </Button>
                  </Box>
                </Box>
              </Drawer>

              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="body1" sx={{ fontWeight: "bold", pr: 2 }}>
                ¡Hola, {nameBar}!
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Whatsapp/>
    </Box>
  );
}

export default Navbar;

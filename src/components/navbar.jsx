import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Tooltip,
  Badge,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { getNotificaciones } from "../api/notificacionesAPI";
import { onLoad, onLoading } from "../slices/notificacionSlice";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const notificacionState = useSelector((state) => state.notificacion);
  const { token, nombre } = authState;
  const { data } = notificacionState;
  const [nameBar, setNameBar] = useState(null);
  const [badgelen, setBadgelen] = useState(0);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };

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
              <Link
                to={"/"}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    height: "40px",
                    width: "40px",
                    fontWeight: "bold",
                    background: "#124fb9",
                    borderRadius: "10px",
                    border: "1px solid #1b86ff"
                  }}
                >
                  <Tooltip title="Aplicaciones" placement="right">
                    <AppsIcon />
                  </Tooltip>
                </Button>
              </Link>

              <Link
                to="/notificaciones"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Tooltip title="Ver Notificaciones" placement="left">
                  <Badge badgeContent={badgelen} color="primary">
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "initial" }}
                    >
                      ¡Hola, {nameBar}!
                    </Typography>
                  </Badge>
                </Tooltip>
              </Link>
              <Box>
                <Tooltip title="Cerrar Sesión" placement="left">
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      height: "40px",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      border:'1px solid #ff4e32'
                    }}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </Button>
                </Tooltip>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

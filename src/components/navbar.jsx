import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { Link } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };

  return (
    <AppBar position="fixed" sx={{ background: "#0b2f6d", height: "60px" }}>
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
                  background: "#0b2f6d",
                }}
              >
                <Tooltip title="Aplicaciones" placement="right">
                  <AppsIcon />
                </Tooltip>
              </Button>
            </Link>

            <Box>
              <Tooltip title="Configuraciones" placement="left">
                <Link to={"/configuraciones"}>
                  <Button
                    variant="contained"
                    sx={{
                      height: "40px",
                      width: "40px",
                      fontWeight: "bold",
                      background: "#0b2f6d",
                    }}
                  >
                    <SettingsIcon />
                  </Button>
                </Link>
              </Tooltip>

              <Button
                variant="contained"
                color="error"
                sx={{
                  height: "40px",
                  width: "200px",
                  fontWeight: "bold",
                }}
                onClick={handleLogout}
              >
                <LogoutIcon />
                <Typography sx={{ marginLeft: "10px", fontWeight: "bold" }}>
                  Cerrar sesion
                </Typography>
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

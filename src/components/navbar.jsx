import { AppBar, Box, Button, Toolbar, Tooltip, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import WidgetsIcon from '@mui/icons-material/Widgets';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { nombre } = authState;
  const [userName, setUserName] = useState(undefined);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };

  const nameSetter = (name) => {
    const firstName = name.split(" ")[0];
    const lowerCaseName = firstName.toLowerCase();
    const capitalizedName = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
    return capitalizedName;
  };

  useEffect(() => {
    const userName = nameSetter(nombre);
    setUserName(userName);
  }, [nombre]);

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#142a3d", height: "60px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <>
            <Box sx={{ display: "flex", minWidth: "200px", justifyContent: "center", alignItems: "center" }}>
              <Link
                to="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <WidgetsIcon sx={{ fontSize: "30px" }} />
              </Link>
            </Box>

            <Box sx={{ display: "flex", minWidth: "200px", justifyContent: "center" }}>
              <Tooltip title="Configuraciones" placement="left">
                <Link to={"/configuraciones"}>
                  <Button
                    variant="contained"
                    sx={{
                      height: "40px",
                      width: "40px",
                      fontWeight: "bold",
                      background: "#124fb9",
                      borderRadius: 10,
                    }}
                  >
                    <SettingsIcon />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="Cerrar Sesión" placement="left">
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    height: "40px",
                    width: "40px",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    borderRadius: 10,
                  }}
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                </Button>
              </Tooltip>

            </Box>

          </>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

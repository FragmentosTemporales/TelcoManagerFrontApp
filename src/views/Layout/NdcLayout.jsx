import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";

function NdcLayout({ children, showNavbar = true }) {
  // selected almacena cuál de las opciones está activa para resaltar la pestaña correspondiente
  const [selected, setSelected] = useState(1);
  const location = useLocation();

  // Sincroniza el estado seleccionado con la URL actual (ej: al refrescar página o navegar externamente)
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("pendientes-sin-consumo")) setSelected(1);
    else if (path.includes("error-con-consumo")) setSelected(2);
    else if (path.includes("logs-errors")) setSelected(3);
  }, [location.pathname]);

  return (
    <>
      {showNavbar && <Navbar />}
      <Box sx={{ background: "#142a3d", height: "60px", marginTop: "60px" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Link
            to="/modulo:ndc/pendientes-sin-consumo"
            style={{
              color: "white",
              textDecoration: "none",
              width: "30%",
              display: "flex",
              justifyContent: "center",
            }}
              onClick={() => setSelected(1)}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                border: selected === 1 ? "2px solid #dfdeda" : "none",
                background: "#2d5e89",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontFamily="monospace"
                sx={{ color: "white", textAlign: "center" }}
              >
                PENDIENTES SIN CONSUMO
              </Typography>
            </Box>
          </Link>
          <Link
            to="/modulo:ndc/error-con-consumo"
            style={{
              color: "white",
              textDecoration: "none",
              width: "30%",
            }}
              onClick={() => setSelected(2)}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                border: selected === 2 ? "2px solid #dfdeda" : "none",
                background: "#2d5e89",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontFamily="monospace"
                sx={{ color: "white", textAlign: "center" }}
              >
                ERROR CON CONSUMO
              </Typography>
            </Box>
          </Link>
          <Link
            to="/modulo:ndc/logs-errors"
            style={{
              color: "white",
              textDecoration: "none",
              width: "30%",
            }}
              onClick={() => setSelected(3)}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                border: selected === 3 ? "2px solid #dfdeda" : "none",
                background: "#2d5e89",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontFamily="monospace"
                sx={{ color: "white", textAlign: "center" }}
              >
                ORDENES CON ERROR
              </Typography>
            </Box>
          </Link>
        </Toolbar>
      </Box>
      <Box>{children}</Box>
    </>
  );
}

export default NdcLayout;

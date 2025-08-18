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

function CalidadLayout({ children, showNavbar = true }) {
  const [selected, setSelected] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("modulo:reparaciones")) setSelected(1);
    else if (path.includes("error-stock-consumo")) setSelected(2);
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
            to="/modulo:reparaciones"
            style={{
              color: "white",
              textDecoration: "none",
              width: "20%",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => setSelected(1)}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                borderRadius: 5,
                border: selected === 1 ? "2px solid #dfdeda" : "none",
                background: selected === 1 ? "#ff9800" : "#2d5e89",
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
                REGISTRO REPARACIONES
              </Typography>
            </Box>
          </Link>
          <Link
            to="/modulo:ndc/pendientes-sin-consumo"
            style={{
              color: "white",
              textDecoration: "none",
              width: "20%",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => setSelected(2)}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                borderRadius: 5,
                border: selected === 2 ? "2px solid #dfdeda" : "none",
                background: selected === 2 ? "#ff9800" : "#2d5e89",
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
                REGISTRO INCIDENCIAS
              </Typography>
            </Box>
          </Link>
        </Toolbar>
      </Box>
      <Box>{children}</Box>
    </>
  );
}

export default CalidadLayout;

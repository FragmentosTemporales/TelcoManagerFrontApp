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
import { palette } from "../../theme/palette";

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
      <Box
        sx={{
          background: palette.bgGradient,
          height: "60px",
          marginTop: "60px",
          position: 'relative',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              "radial-gradient(circle at 15% 35%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 85% 65%, rgba(255,255,255,0.08), transparent 65%)",
            pointerEvents: 'none'
          }
        }}
      >
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
                borderRadius: 3,
                border: selected === 1 ? `2px solid ${palette.accent}` : `1px solid ${palette.primaryDark}`,
                background: selected === 1
                  ? `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 90%)`
                  : `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 90%)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'relative',
                overflow: 'hidden',
                transition: "all .35s",
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
                  opacity: 0,
                  transition: 'opacity .4s'
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 24px -6px rgba(0,0,0,0.45)',
                  '&:before': { opacity: .9 }
                },
                '&:active': { transform: 'translateY(-2px)' }
              }}
            >
              <Typography
                variant="subtitle1"
                fontFamily="monospace"
                sx={{ color: '#fff', textAlign: "center", fontWeight: 600, letterSpacing: 0.5 }}
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
                borderRadius: 3,
                border: selected === 2 ? `2px solid ${palette.accent}` : `1px solid ${palette.primaryDark}`,
                background: selected === 2
                  ? `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 90%)`
                  : `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 90%)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'relative',
                overflow: 'hidden',
                transition: "all .35s",
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
                  opacity: 0,
                  transition: 'opacity .4s'
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 24px -6px rgba(0,0,0,0.45)',
                  '&:before': { opacity: .9 }
                },
                '&:active': { transform: 'translateY(-2px)' }
              }}
            >
              <Typography
                variant="subtitle1"
                fontFamily="monospace"
                sx={{ color: '#fff', textAlign: "center", fontWeight: 600, letterSpacing: 0.5 }}
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

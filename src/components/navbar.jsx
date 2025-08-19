import { AppBar, Box, Button, Toolbar, Tooltip, Typography, IconButton, Divider } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import WidgetsIcon from '@mui/icons-material/Widgets';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { Link } from "react-router-dom";
import { palette } from "../theme/palette";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };


  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: 64,
          background: `linear-gradient(145deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
          boxShadow: "0 4px 12px -2px rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid rgba(255,255,255,0.08)`
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 64,
            px: { xs: 1.5, sm: 3 },
            gap: 2,
          }}
        >
          {/* Brand / Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <IconButton
              component={Link}
              to="/"
              size="small"
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(4px)',
                transition: 'all .3s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <WidgetsIcon fontSize="medium" />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: .5,
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.35)'
              }}
            >
              Telco Manager
            </Typography>
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Configuraciones" arrow>
              <IconButton
                component={Link}
                to="/configuraciones"
                sx={{
                  color: palette.primary,
                  backgroundColor: palette.accentSoft,
                  border: `1px solid ${palette.borderSubtle}`,
                  transition: 'all .3s',
                  '&:hover': {
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px -2px rgba(0,0,0,0.25)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem light sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            <Tooltip title="Cerrar Sesión" arrow>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  transition: 'all .3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

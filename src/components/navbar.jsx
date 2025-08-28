import { AppBar, Box, Button, Toolbar, Tooltip, Typography, IconButton, Divider } from "@mui/material";
import WidgetsIcon from '@mui/icons-material/Widgets';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { Link, useNavigate } from "react-router-dom";
import { palette } from "../theme/palette";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token_expires_at = useSelector((s) => s.auth?.token_expires_at);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };

  // Watch token expiry and force navigation to login when it expires.
  useEffect(() => {
    let logoutTimer = null;
    let warnTimer = null;
    let tickInterval = null;

    if (!token_expires_at) return;

    const remaining = token_expires_at - Date.now();
    if (remaining <= 0) {
      // already expired -> immediate logout + navigate
      dispatch(setLogout());
      dispatch(domsetLogout());
      navigate('/login', { replace: true });
      return;
    }

    // Schedule a warning 10 seconds before expiry. If less than 10s remain, show immediately.
    const timeToWarn = remaining - 10 * 1000;
    if (timeToWarn <= 0) {
      setShowExpiryWarning(true);
    } else {
      warnTimer = setTimeout(() => setShowExpiryWarning(true), timeToWarn);
    }

    // Keep a ticking seconds-left counter while the warning is visible (or once started).
    const startTick = () => {
      // set initial value immediately
      setSecondsLeft(Math.max(0, Math.ceil((token_expires_at - Date.now()) / 1000)));
      tickInterval = setInterval(() => {
        const s = Math.max(0, Math.ceil((token_expires_at - Date.now()) / 1000));
        setSecondsLeft(s);
        if (s <= 0) {
          clearInterval(tickInterval);
        }
      }, 1000);
    };

    // If we already showed the warning immediately, start the tick.
    if (timeToWarn <= 0) startTick();

    // When the warning becomes visible (either now or later) ensure ticking starts.
    const warnObserver = () => {
      if (!tickInterval) startTick();
    };

    // fallback: observe showExpiryWarning change via a short timeout hook —
    // we'll also start ticking when the warnTimer fires by wrapping setShowExpiryWarning above.

    // schedule logout at expiry time
    logoutTimer = setTimeout(() => {
      dispatch(setLogout());
      dispatch(domsetLogout());
      try {
        navigate('/login', { replace: true });
      } catch (e) {
        // ignore navigation errors in non-router contexts
      }
    }, remaining);

    // if the warning will fire later, make sure to start ticking when it does by overriding the setter
    if (warnTimer) {
      // wrap the warn timer so it also starts the tick interval when warning shows
      clearTimeout(warnTimer);
      warnTimer = setTimeout(() => {
        setShowExpiryWarning(true);
        warnObserver();
      }, timeToWarn);
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      if (warnTimer) clearTimeout(warnTimer);
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [token_expires_at, dispatch, navigate]);

  // Ensure a safe seconds-left ticker when the warning is visible. This keeps
  // the UI updated even if the main effect didn't start the interval.
  useEffect(() => {
    let interval = null;
    if (showExpiryWarning && token_expires_at) {
      setSecondsLeft(Math.max(0, Math.ceil((token_expires_at - Date.now()) / 1000)));
      interval = setInterval(() => {
        const s = Math.max(0, Math.ceil((token_expires_at - Date.now()) / 1000));
        setSecondsLeft(s);
        if (s <= 0) clearInterval(interval);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showExpiryWarning, token_expires_at]);


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
      <Snackbar
        open={showExpiryWarning}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setShowExpiryWarning(false)}
      >
        <Alert
          severity="warning"
          sx={{ width: '100%' }}
          onClose={() => setShowExpiryWarning(false)}
        >
          {secondsLeft !== null
            ? `Su sesión expira en ${secondsLeft} segundo${secondsLeft === 1 ? '' : 's'}`
            : 'Su sesión está por expirar'}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Navbar;

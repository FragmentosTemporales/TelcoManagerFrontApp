import {
  Alert,
  Box,
  Checkbox,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LockIcon from "@mui/icons-material/Lock";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLogin } from "../api/authAPI";
import { onLoad, onLoading, setMessage, setLogout } from "../slices/authSlice";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";

function Login() {
  const { message } = useSelector((state) => state.auth);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ correo: "", clave: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setForm(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  // If a token is already stored and not expired, navigate to home.
  // If token exists but is expired, clear auth state to avoid stale login.
  useEffect(() => {
    const token = authState?.token;
    const expiresAt = authState?.token_expires_at ? Number(authState.token_expires_at) : null;
    if (token && expiresAt && expiresAt > Date.now() + 1000) {
      navigate("/");
    } else if (token && expiresAt && expiresAt <= Date.now()) {
      dispatch(setLogout());
    }
    // Only re-run when token or its expiry changes
  }, [authState?.token, authState?.token_expires_at, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(onLoading());
    const payload = { correo: form.correo, clave: form.clave };

    try {
      const response = await onLogin(payload);
      dispatch(onLoad(response));
      if (rememberMe) {
        localStorage.setItem("credentials", JSON.stringify(form));
      } else {
        localStorage.removeItem("credentials");
      }
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      dispatch(setMessage(error));
      setIsSubmitting(false);
      setOpen(true);
    }
  };

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  // Navigation after login handled by login flow; no direct token watch required here

  return (
    <MainLayout showNavbar={false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 2,
          background: palette.bgGradient,
          position: "relative",
          overflow: "hidden",
          '::before': {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 60%)",
            pointerEvents: "none",
          },
        }}
      >
        {open && (
          <Box sx={{ width: "100%", maxWidth: 420, mb: 2 }}>{renderAlert()}</Box>
        )}
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 420,
            px: 5,
            pt: 5,
            pb: 6,
            borderRadius: 4,
            position: "relative",
            background: palette.cardBg,
            backdropFilter: "blur(6px)",
            boxShadow:
              "0 8px 24px -6px rgba(0,0,0,0.25), 0 2px 6px -1px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                color: palette.primary,
              }}
            >
              Dominion Telco
            </Typography>
            <Typography variant="body2" sx={{ color: palette.textMuted, mt: 0.5 }}>
              Inicia sesión para continuar
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                required
                size="small"
                fullWidth
                id="correo"
                label="Correo"
                type="email"
                name="correo"
                variant="outlined"
                value={form.correo}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize="small" sx={{ color: palette.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: "white",
                    transition: "box-shadow .25s, background-color .25s",
                    '&:hover': { bgcolor: "#fafafa" },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${palette.accentSoft}`,
                      '& fieldset': { borderColor: palette.accent },
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <TextField
                required
                fullWidth
                size="small"
                id="clave"
                label="Clave"
                type="password"
                name="clave"
                variant="outlined"
                value={form.clave}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: palette.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: "white",
                    transition: "box-shadow .25s, background-color .25s",
                    '&:hover': { bgcolor: "#fafafa" },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${palette.accentSoft}`,
                      '& fieldset': { borderColor: palette.accent },
                    },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                userSelect: "none",
              }}
            >
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                color="primary"
                size="small"
                sx={{
                  p: 0.5,
                  '&.Mui-checked': { color: palette.primary },
                }}
              />
              <Typography variant="body2" sx={{ color: palette.textMuted }}>
                Recordar usuario
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
              sx={{
                py: 1.1,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                letterSpacing: 0.3,
                borderRadius: 2.5,
                background: `linear-gradient(145deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                boxShadow: "0 4px 12px -2px rgba(10,27,43,0.5)",
                transition: "all .3s",
                '&:hover': {
                  background: palette.primaryDark,
                  boxShadow: "0 6px 16px -4px rgba(10,27,43,0.6)",
                },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              {isSubmitting ? "Cargando..." : "Ingresar"}
            </Button>
            <Divider sx={{ mt: 4, mb: 0, opacity: 0.5 }} />
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "center", mt: 2, color: palette.textMuted }}
            >
              © {new Date().getFullYear()} Dominion Telco. Todos los derechos reservados.
            </Typography>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
}

export default Login;

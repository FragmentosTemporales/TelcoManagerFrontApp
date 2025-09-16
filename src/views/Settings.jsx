import {
  Alert,
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Paper,
  Fade,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { updatePass } from "../api/authAPI";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";

function Settings() {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [form, setForm] = useState({
    clave: "",
    new_clave: "",
    new_clave_2: "",
  });
  const [errors, setErrors] = useState({
    new_clave: "",
    new_clave_2: "",
  });

  const validatePassword = (name, value) => {
    const isValidLength = value.length >= 8 && value.length <= 20;
    const isValidCharacters = /^[A-Za-z0-9@#$%^&*]+$/.test(value);

    if (!isValidLength) {
      return "La contraseña debe tener entre 8 y 20 caracteres.";
    }
    if (!isValidCharacters) {
      return "La contraseña solo puede contener letras, números y @#$%^&*.";
    }
    return "";
  };

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(domsetLogout());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "new_clave" || name === "new_clave_2") {
      const error = validatePassword(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (errors.new_clave || errors.new_clave_2) {
      setMessage("Corrige los errores en el formulario antes de continuar.");
      setSeverity("error");
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    if (form.new_clave !== form.new_clave_2) {
      setMessage("Las contraseñas no coinciden.");
      setSeverity("error");
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { clave: form.clave, new_clave: form.new_clave };
  await updatePass(payload);
      setMessage("Contraseña actualizada con éxito.");
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        handleLogout();
      }, 1800);
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar la contraseña.");
      setSeverity("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const renderAlert = () => (
    <Alert onClose={() => setOpen(false)} severity={severity} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh', // asegurar uso completo de la vista para evitar hueco
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
          background: palette.bgGradient,
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Fade in timeout={600}>
          <Paper
            elevation={12}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 520,
              p: { xs: 4, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255,255,255,0.92)',
              border: `1px solid ${palette.borderSubtle}`,
              backdropFilter: 'blur(6px) saturate(160%)',
              boxShadow: '0 10px 28px -6px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
                pointerEvents: 'none'
              }
            }}
          >
            {open && (
              <Fade in={open} timeout={400}>
                <Box>{renderAlert()}</Box>
              </Fade>
            )}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                color: palette.primary,
                letterSpacing: 0.5,
                mb: 0.5
              }}
            >
              Configuración de Contraseña
            </Typography>
            <Divider sx={{ mb: 3, borderColor: palette.borderSubtle }} />
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  required
                  label="Contraseña Actual"
                  id="clave"
                  type="password"
                  name="clave"
                  variant="outlined"
                  size="medium"
                  value={form.clave}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <TextField
                  required
                  label="Contraseña Nueva"
                  id="new_clave"
                  type="password"
                  name="new_clave"
                  variant="outlined"
                  size="medium"
                  value={form.new_clave}
                  onChange={handleChange}
                  error={Boolean(errors.new_clave)}
                  helperText={errors.new_clave || '8-20 caracteres. Letras, números y @#$%^&*'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <TextField
                  required
                  label="Repite Contraseña Nueva"
                  id="new_clave_2"
                  type="password"
                  name="new_clave_2"
                  variant="outlined"
                  size="medium"
                  value={form.new_clave_2}
                  onChange={handleChange}
                  error={Boolean(errors.new_clave_2)}
                  helperText={errors.new_clave_2 || (form.new_clave_2 && form.new_clave !== form.new_clave_2 ? 'No coincide con la nueva contraseña' : 'Repite para confirmar')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 1,
                    py: 1.2,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    fontSize: '0.95rem',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                    boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)`,
                      boxShadow: '0 10px 24px -4px rgba(0,0,0,0.5)'
                    }
                  }}
                  fullWidth
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </Stack>
            </form>
            <Typography variant="caption" sx={{ display: 'block', mt: 2.25, mb: 0.25, textAlign: 'center', color: palette.textMuted }}>
              Se cerrará la sesión tras una actualización exitosa.
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </MainLayout>
  );
}

export default Settings;

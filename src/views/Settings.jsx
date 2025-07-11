import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { updatePass } from "../api/authAPI";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";

function Settings() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
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
      const response = await updatePass(payload, token);
      setMessage("Contraseña actualizada con éxito.");
      setSeverity("success");
      setOpen(true);

      // Agregar un retraso antes de llamar a handleLogout
      setTimeout(() => {
        handleLogout();
      }, 2000); // Retraso de 2 segundos (2000 ms)
    } catch (error) {
      setMessage("Error al actualizar la contraseña.");
      setSeverity("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const renderAlert = () => (
    <Alert
      onClose={() => setOpen(false)}
      severity={severity}
      sx={{ marginBottom: 3 }}
    >
      {message}
    </Alert>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      {open && renderAlert()}
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          paddingTop: "25px",
          paddingBottom: "40px",
          backgroundColor: "white",
          boxShadow: "2",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "start",
            marginLeft: 2,
            marginBottom: 2,
          }}>
          Configuración de Contraseña
          </Typography>
        <form onSubmit={handleSubmit}>

          <Box sx={{ mb: 2, mt: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              required
              size="small"
              label="Contraseña Actual"
              sx={{ minWidth: "350px" }}
              id="clave"
              type="password"
              name="clave"
              variant="outlined"
              value={form.clave}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 2, mt: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              required
              size="small"
              label="Contraseña Nueva"
              sx={{ minWidth: "350px" }}
              id="new_clave"
              type="password"
              name="new_clave"
              variant="outlined"
              value={form.new_clave}
              onChange={handleChange}
              error={Boolean(errors.new_clave)}
              helperText={errors.new_clave}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 2, mt: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              required
              size="small"
              label="Repite Contraseña Nueva"
              sx={{ minWidth: "350px" }}
              id="new_clave_2"
              type="password"
              name="new_clave_2"
              variant="outlined"
              value={form.new_clave_2}
              onChange={handleChange}
              error={Boolean(errors.new_clave_2)}
              helperText={errors.new_clave_2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ background: "#0b2f6d", width: "350px", mt: 2 }}
            >
              <Typography sx={{ color: "white" }} fontStyle={"Bold"}>
                {isSubmitting ? "Cargando..." : "Actualizar"}
              </Typography>
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Settings;

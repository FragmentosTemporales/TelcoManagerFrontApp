import {
  Alert,
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { updatePass } from "../api/authAPI";
import { setLogout } from "../slices/authSlice";
import { domsetLogout } from "../slices/dominionSlice";
import { MainLayout } from "./Layout";

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
    <MainLayout showNavbar={true}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
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
          borderRadius: 2,
          border: "2px solid #dfdeda"
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
          }}>
          Configuración de Contraseña
          </Typography>
          <Divider sx={{ margin: 1 }} />
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              sx={{ background: "#142a3d", width: "350px", mt: 2 , borderRadius: 2}}
            >
              <Typography sx={{ color: "white" }} fontStyle={"Bold"}>
                {isSubmitting ? "Cargando..." : "Actualizar"}
              </Typography>
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </MainLayout>
  );
}

export default Settings;

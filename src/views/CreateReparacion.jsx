import {
  Alert,
  Box,
  Button,
  InputLabel,
  TextField,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createRegistroReparacion } from "../api/calidadAPI";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function CreateReparacionView() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [form, setForm] = useState({
    orden: "",
    img_1: null,
    descripcion: "",
    userID: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación 1: 'orden' debe iniciar con "1-3"
    if (!form.orden.startsWith("1-3")) {
      setAlertSeverity("error");
      setMessage('El campo "Orden" debe iniciar con "1-3".');
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    // Validación 2 y 3: Archivos deben ser imágenes y pesar menos de 5MB
    const imageFields = ["img_1"];
    for (let field of imageFields) {
      const file = form[field];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setAlertSeverity("error");
          setMessage("Solo se permiten archivos de imagen.");
          setOpen(true);
          setIsSubmitting(false);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setAlertSeverity("error");
          setMessage("Cada imagen debe pesar menos de 5MB.");
          setOpen(true);
          setIsSubmitting(false);
          return;
        }
      }
    }

    const formData = new FormData();
    formData.append("orden", form.orden);
    formData.append("descripcion", form.descripcion);
    formData.append("userID", user_id);

    if (form.img_1) {
      formData.append("img_1", form.img_1);
    }


    try {
      const response = await createRegistroReparacion(formData, token);
      setAlertSeverity("success");
      setMessage("Formulario creado exitosamente.");
    } catch (error) {
      setAlertSeverity("error");
      setMessage(
        "Error al crear el formulario. Por favor, inténtelo de nuevo."
      );
    } finally {
      setForm({
        orden: "",
        img_1: null,
        descripcion: "",
        userID: user_id,
      });
      setOpen(true);
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          pt: { xs: 10, md: 10 },
          pb: 10,
          minHeight: "100vh",
          background: palette.bgGradient,
          position: "relative",
          '::before': {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
            pointerEvents: "none",
          },
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity={alertSeverity}
            sx={{
              mb: 3,
              width: { xs: "90%", sm: "70%", md: "50%" },
              boxShadow: 4,
              borderRadius: 3,
              background: palette.cardBg,
              border: `1px solid ${palette.borderSubtle}`,
            }}
          >
            {message}
          </Alert>
        )}
        <ModuleHeader
          title="Registro de Reparación"
          subtitle="Crear nuevo registro fotográfico de reparación"
          divider
        />
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
            px: { xs: 3, md: 6 },
            pt: 5,
            pb: 6,
            background: palette.cardBg,
            border: `1px solid ${palette.borderSubtle}`,
            borderRadius: 4,
            backdropFilter: "blur(6px)",
            boxShadow:
              "0 12px 32px -12px rgba(0,0,0,0.38), 0 6px 12px -4px rgba(0,0,0,0.26)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "80%" }}
            encType="multipart/form-data"
          >
            <Box sx={{ mb: 3 }}>
              <InputLabel id="orden-label" sx={{ fontWeight: 500, color: palette.primary }}>
                Orden de Trabajo
              </InputLabel>
              <TextField
                fullWidth
                size="small"
                required
                id="orden"
                type="text"
                name="orden"
                variant="standard"
                value={form.orden}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root:before': { borderColor: palette.borderSubtle },
                  '& .MuiInputBase-root:hover:before': { borderColor: palette.accent },
                  '& .MuiInputBase-root.Mui-focused:after': { borderColor: palette.accent },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputLabel id="descripcion-label" sx={{ fontWeight: 500, color: palette.primary }}>
                Descripción
              </InputLabel>
              <TextField
                fullWidth
                size="small"
                required
                id="descripcion"
                type="text"
                name="descripcion"
                variant="standard"
                value={form.descripcion}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root:before': { borderColor: palette.borderSubtle },
                  '& .MuiInputBase-root:hover:before': { borderColor: palette.accent },
                  '& .MuiInputBase-root.Mui-focused:after': { borderColor: palette.accent },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputLabel id="img_1-label" sx={{ fontWeight: 500, color: palette.primary }}>
                Registro 1
              </InputLabel>
              <TextField
                required
                size="small"
                fullWidth
                id="img_1"
                type="file"
                name="img_1"
                variant="standard"
                onChange={handleFileChange}
                sx={{
                  '& .MuiInputBase-root:before': { borderColor: palette.borderSubtle },
                  '& .MuiInputBase-root:hover:before': { borderColor: palette.accent },
                  '& .MuiInputBase-root.Mui-focused:after': { borderColor: palette.accent },
                }}
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: `linear-gradient(145deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                  fontWeight: 600,
                  width: "200px",
                  borderRadius: 2.5,
                  mt: 2,
                  letterSpacing: 0.5,
                  textTransform: "none",
                  boxShadow: "0 6px 16px -4px rgba(10,27,43,0.55),0 2px 6px -2px rgba(10,27,43,0.35)",
                  '&:hover': { background: palette.primaryDark },
                  '&:disabled': { opacity: 0.6 },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Crear"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
}

export default CreateReparacionView;
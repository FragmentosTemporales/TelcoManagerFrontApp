import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createRegistroReparacion } from "../api/despachoAPI";
import { MainLayout } from "./Layout";

function CreateReparacionView() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [form, setForm] = useState({
    orden: "",
    img_1: null,
    ticket: "",
    userID: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    formData.append("ticket", form.ticket);
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
        ticket: "",
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
          justifyContent: "center",
          background: "white",
          alignItems: "center",
          pt: 8,
          height: "90vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {open && (
          <Alert onClose={handleClose} severity={alertSeverity} sx={{ marginBottom: 3 }}>
            {message}
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 2,
            width: "50%",
            paddingTop: 4,
            paddingBottom: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: "bold", color: "#142a3d" }}
          >
            CREAR REGISTRO DE REPARACIÓN
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ width: "80%" }}
            encType="multipart/form-data"
          >

            <Box sx={{ mb: 2 }}>
              <InputLabel id="orden-label">Orden de Trabajo</InputLabel>
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
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="orden-label">Ticket</InputLabel>
              <TextField
                fullWidth
                size="small"
                required
                id="ticket"
                type="text"
                name="ticket"
                variant="standard"
                value={form.ticket}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="img_1-label">Registro 1</InputLabel>
              <TextField
                required
                size="small"
                fullWidth
                id="img_1"
                type="file"
                name="img_1"
                variant="standard"
                onChange={handleFileChange}
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#142a3d", fontWeight: "bold", width: "200px", borderRadius: "0px", marginTop: "20px" }}
                disabled={isSubmitting} // Deshabilitar el botón cuando isSubmitting es true
              >
                {isSubmitting ? "Procesando..." : "Crear"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default CreateReparacionView;
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { sendPlantillaConstruccion } from "../api/onnetAPI";

function LoadConstruccion() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [form, setForm] = useState({
    file: null,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    setForm({
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (form.file) {
      formData.append("file", form.file);
    }
    try {
      const response = await sendPlantillaConstruccion(formData, token);
      setAlertType("success");
      setMessage(response.message);
      setOpen(true);
    } catch (error) {
      // Manejo de error específico si el archivo está abierto por otro proceso
      let errorMsg = error?.message || error;
      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("used by another process") ||
          errorMsg.includes("no se puede obtener acceso al archivo") ||
          errorMsg.includes("Failed to load"))
      ) {
        errorMsg =
          "No se pudo cargar el archivo porque está abierto en otra aplicación. Por favor, cierre el archivo e intente nuevamente.";
      }
      setMessage(errorMsg);
      setAlertType("error");
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const componente_carga = () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          height: "200px",
          width: "500px",
          boxShadow: 2,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "80%" }}
          encType="multipart/form-data"
        >
          <Box sx={{ mb: 2 }}>
            <InputLabel id="file-label">Archivo</InputLabel>
            <TextField
              required
              fullWidth
              id="file"
              type="file"
              name="file"
              variant="standard"
              onChange={handleFileChange}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#0b2f6d", fontWeight: "bold", pt: 1, pb: 1, width: "100%" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Cargar"}
            </Button>
          </Box>
        </form>
      </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{ mb: 3, width: "90%" }}
        >
          {message}
        </Alert>
      )}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          padding: 8,
          marginBottom: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {componente_carga()}
      </Box>
    </Box>
  );
}

export default LoadConstruccion;

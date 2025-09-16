import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  InputLabel,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { sendPlantillaConstruccion } from "../api/onnetAPI";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";

function LoadConstruccion() {
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
  const response = await sendPlantillaConstruccion(formData);
      setAlertType("success");
      setMessage(response.message);
      setOpen(true);
    } catch (error) {
      console.error(error);
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

  const gradient = palette.bgGradient;
  const glass = {
    position: "relative",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.80) 100%)",
    backdropFilter: "blur(14px)",
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: 3,
    boxShadow: "0 8px 28px -4px rgba(0,0,0,0.25)",
    overflow: "hidden",
    "::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
      pointerEvents: "none",
      mixBlendMode: "overlay",
    },
  };
  const primaryBtn = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 2,
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    "&:hover": { background: palette.primaryDark },
  };

  const componente_carga = () => (
    <Card sx={{ ...glass, width: "100%", maxWidth: 520 }}>
      <CardHeader
        titleTypographyProps={{ fontSize: 18, fontWeight: "bold" }}
        title="Carga de Planilla de Construcción"
        sx={{
          background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
          color: "#fff",
          py: 1.5,
          textAlign: "center",
        }}
      />
      <CardContent sx={{ pt: 3 }}>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          style={{ width: "100%" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <InputLabel id="file-label">Archivo</InputLabel>
              <TextField
                required
                fullWidth
                id="file"
                type="file"
                name="file"
                variant="standard"
                onChange={handleFileChange}
                inputProps={{ accept: ".xlsx,.xls,.csv" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ ...primaryBtn, py: 1.2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Cargar"}
              </Button>
              {isSubmitting && <LinearProgress />}
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          pt: '70px', // offset navbar
          width: '100%',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: gradient,
          position: 'relative',
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{
              position: 'absolute',
              top: 90,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 520,
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 2
            }}
          >
            {message}
          </Alert>
        )}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {componente_carga()}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default LoadConstruccion;

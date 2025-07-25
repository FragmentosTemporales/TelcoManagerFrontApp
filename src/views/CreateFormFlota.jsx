import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  TextField,
  Typography
} from "@mui/material";
import FeedIcon from '@mui/icons-material/Feed';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createFormFlota } from "../api/formsAPI";
import { onLoad, onLoading, setMessage } from "../slices/formSlice";

function FormFlota() {
  const {logID} = useParams()
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const formState = useSelector((state) => state.form);
  const { message } = formState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    logID: logID,
    fechaEvento: "",
    patente: "",
    modeloVehiculo: "",
    velocidad: "",
    ubicacion: "",
    fechaAsignacion: "",
    file: null,
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
      file: e.target.files[0],
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(onLoading());
  
    const formData = new FormData();
    formData.append("logID", form.logID);
    formData.append("fechaEvento", form.fechaEvento);
    formData.append("patente", form.patente);
    formData.append("modeloVehiculo", form.modeloVehiculo);
    formData.append("velocidad", form.velocidad);
    formData.append("ubicacion", form.ubicacion);
    formData.append("fechaAsignacion", form.fechaAsignacion);
  
    if (form.file) {
      formData.append("file", form.file);
    }
  
    try {
      const response = await createFormFlota(formData, token);
      dispatch(onLoad(response));
      setOpen(true);
      navigate("/modulo:solicitudes");
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 3,
        height: "90vh",
        background: "#f5f5f5",
      }}
    >
      {open && (
        <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
          {message}
        </Alert>
      )}
      <Card
        sx={{
          borderRadius: 2,
          width: "50%",
          overflow: "auto",
          border: "2px solid #dfdeda",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold">
              FORMULARIO FLOTA
            </Typography>
          }
          avatar={<FeedIcon/>}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "80%" }} encType="multipart/form-data">
            <Box sx={{ mb: 2 }}>
              <InputLabel id="fechaEvento-label">Fecha Evento</InputLabel>
              <TextField
                fullWidth
                required
                id="fechaEvento"
                type="date"
                name="fechaEvento"
                variant="standard"
                value={form.fechaEvento}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="patente-label">Patente Vehículo</InputLabel>
              <TextField
                fullWidth
                required
                id="patente"
                type="text"
                name="patente"
                variant="standard"
                value={form.patente}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="modeloVehiculo-label">Modelo Vehículo</InputLabel>
              <TextField
                fullWidth
                required
                id="modeloVehiculo"
                type="text"
                name="modeloVehiculo"
                variant="standard"
                value={form.modeloVehiculo}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="velocidad-label">Velocidad</InputLabel>
              <TextField
                fullWidth
                required
                id="velocidad"
                type="text"
                name="velocidad"
                variant="standard"
                value={form.velocidad}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="ubicacion-label">Dirección/Ubicación del evento</InputLabel>
              <TextField
                fullWidth
                required
                id="ubicacion"
                type="text"
                name="ubicacion"
                variant="standard"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="fechaAsignacion-label">Fecha Asignación</InputLabel>
              <TextField
                fullWidth
                required
                id="fechaAsignacion"
                type="date"
                name="fechaAsignacion"
                variant="standard"
                value={form.fechaAsignacion}
                onChange={handleChange}
              />
            </Box>

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
                  sx={{ background: "#0b2f6d", fontWeight: "bold", width: "200px" }}
                  disabled={isSubmitting}  // Deshabilitar el botón cuando isSubmitting es true
                >
                  {isSubmitting ? "Procesando..." : "Crear"}
                </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FormFlota;

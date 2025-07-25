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
  import { createFormCalidad } from "../api/formsAPI";
  import { onLoad, onLoading, setMessage } from "../slices/formSlice";
  
  function FormCalidad() {
    const {logID} = useParams()
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const formState = useSelector((state) => state.form);
    const { message } = formState;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const [form, setForm] = useState({
      logID: logID,
      fechaEvento: "",
      fechaAuditoria: "",
      ubicacion: "",
      nPeticion: "",
      declaracion: "",
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
      formData.append("fechaAuditoria", form.fechaAuditoria);
      formData.append("ubicacion", form.ubicacion);
      formData.append("nPeticion", form.nPeticion);
      formData.append("declaracion", form.declaracion);
    
      if (form.file) {
        formData.append("file", form.file);
      }
    
      try {
        const response = await createFormCalidad(formData, token);
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
        height: "95vh",
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
              FORMULARIO CALIDAD
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
                <InputLabel id="fechaAuditoria-label">Fecha Auditoría</InputLabel>
                <TextField
                  fullWidth
                  required
                  id="fechaAuditoria"
                  type="date"
                  name="fechaAuditoria"
                variant="standard"
                  value={form.fechaAuditoria}
                  onChange={handleChange}
                />
              </Box>
  
              <Box sx={{ mb: 2 }}>
                <InputLabel id="modeloVehiculo-label">Ubicación</InputLabel>
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
                <InputLabel id="nPeticion-label">N° Petición</InputLabel>
                <TextField
                  fullWidth
                  required
                  id="nPeticion"
                  type="text"
                  name="nPeticion"
                variant="standard"
                  value={form.nPeticion}
                  onChange={handleChange}
                />
              </Box>
  
              <Box sx={{ mb: 2 }}>
                <InputLabel id="declaracion-label">Declaración / Descripción</InputLabel>
                <TextField
                  fullWidth
                  required
                  id="declaracion"
                  type="text"
                  name="declaracion"
                variant="standard"
                  value={form.declaracion}
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
  
  export default FormCalidad;
  
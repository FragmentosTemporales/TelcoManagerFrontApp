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
import { createFormPrevencion } from "../api/formsAPI";
import { onLoad, onLoading, setMessage } from "../slices/formSlice";

function FormPrevencion() {
  const { logID } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const formState = useSelector((state) => state.form);
  const { message } = formState;
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [form, setForm] = useState({
    logID: logID,
    fechaAuditoria: "",
    auditor: "",
    ubicacion: "",
    detalleEppAuditado: "",
    fechaEntregaEpp: "",
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
    formData.append("fechaAuditoria", form.fechaAuditoria);
    formData.append("auditor", form.auditor);
    formData.append("ubicacion", form.ubicacion);
    formData.append("detalleEppAuditado", form.detalleEppAuditado);
    formData.append("fechaEntregaEpp", form.fechaEntregaEpp);
    formData.append("declaracion", form.declaracion);

    if (form.file) {
      formData.append("file", form.file);
    }

    try {
      const response = await createFormPrevencion(formData, token);
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
          height: "100%",
          overflow: "auto",
          border: "2px solid #dfdeda",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold">
              FORMULARIO PREVENCION
            </Typography>
          }
          avatar={<FeedIcon/>}
          sx={{
            background: "#142a3d",
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
          <form
            onSubmit={handleSubmit}
            style={{ width: "80%" }}
            encType="multipart/form-data"
          >
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
              <InputLabel id="auditor-label">Auditor</InputLabel>
              <TextField
                fullWidth
                required
                id="auditor"
                type="text"
                name="auditor"
                variant="standard"
                value={form.auditor}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="ubicacion-label">Dirección/Ubicación</InputLabel>
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
              <InputLabel id="detalleEppAuditado-label">
                Epp Auditado
              </InputLabel>
              <TextField
                fullWidth
                required
                id="detalleEppAuditado"
                type="text"
                name="detalleEppAuditado"
                variant="standard"
                value={form.detalleEppAuditado}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="fechaEntregaEpp-label">
                Fecha Entrega EPP
              </InputLabel>
              <TextField
                fullWidth
                required
                id="fechaEntregaEpp"
                type="date"
                name="fechaEntregaEpp"
                variant="standard"
                value={form.fechaEntregaEpp}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="declaracion-label">Declaración</InputLabel>
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
                  sx={{ background: "#142a3d", fontWeight: "bold", width: "200px" }}
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

export default FormPrevencion;

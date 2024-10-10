import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  InputLabel,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createUser } from "../api/authAPI";

function UserForm() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    numDoc: "",
    clave: "",
    admin: false,
  });

  const handleClose = () => setOpen(false);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckBox = (e) => {
    setForm({
      ...form,
      admin: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = form;

    try {
      const res = await createUser(payload, token);
      setMessage(res.message);
      setOpen(true);
      setForm({
        nombre: "",
        correo: "",
        numDoc: "",
        clave: "",
        admin: false,
      });
      setIsSubmitting(false);
    } catch (error) {
      setMessage(error);
      setIsSubmitting(false);
      setOpen(true);
    }
  };

  return (
    <Box
    sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      {open && renderAlert()}
      <Card
        sx={{
          borderRadius: "0px",
          width: {lg:"50%", xs:"90%", md:"70%"},
          height: "580px",
          overflow: "auto",
          boxShadow: 5,
          textAlign: "center",
        }}
      >
        <CardHeader
          title="CREAR USUARIO"
          sx={{
            backgroundColor: "#0b2f6d",
            color: "white",
            padding: "10px",
            borderBottom: "1px solid #ddd",
            fontWeight: "bold",
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "80%" }}>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="auditor-label">Nombre</InputLabel>
              <TextField
                fullWidth
                required
                id="nombre"
                type="text"
                name="nombre"
                variant="outlined"
                value={form.nombre}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="auditor-label">Correo</InputLabel>
              <TextField
                fullWidth
                required
                id="correo"
                type="email"
                name="correo"
                variant="outlined"
                value={form.correo}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="auditor-label">Rut</InputLabel>
              <TextField
                fullWidth
                required
                id="numDoc"
                type="text"
                name="numDoc"
                variant="outlined"
                value={form.numDoc}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="auditor-label">Clave</InputLabel>
              <TextField
                fullWidth
                required
                id="clave"
                type="text"
                name="clave"
                variant="outlined"
                value={form.clave}
                onChange={handleChange}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.admin}
                  onChange={handleCheckBox}
                  name="admin"
                  color="primary"
                />
              }
              label="Administrador" // Etiqueta del checkbox
              sx={{ mb: 2 }}
            />

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                disabled={isSubmitting}
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

export default UserForm;

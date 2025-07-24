import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createUser } from "../api/authAPI";
import { getEmpresas } from "../api/authAPI";

function UserForm() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [dataEmpresa, setDataEmpresas] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    numDoc: "",
    clave: "",
    empresaID: 1,
    planta: true,
  });

  const handleClose = () => setOpen(false);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    const res = await getEmpresas(token);
    const empresas = res.map((item) => ({
      value: item.empresaID,
      label: item.nombre,
    }));
    setDataEmpresas(empresas);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
        empresaID: 1,
        planta: true,
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
        display: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
        height: "85vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {open && renderAlert()}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {dataEmpresa.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "90%", sm: "80%", md: "60%" },
              backgroundColor: "#fff",
              borderRadius: 2,
              border: "2px solid #dfdeda",
              pt: 3,
              pb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              CREAR USUARIO
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "80%" }}>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="auditor-label" >
                  Nombre
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="nombre"
                  type="text"
                  name="nombre"
                  size="small"
                  variant="standard"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <InputLabel id="auditor-label">
                  Correo
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="correo"
                  type="email"
                  name="correo"
                  size="small"
                  variant="standard"
                  value={form.correo}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="auditor-label">
                  Rut
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="numDoc"
                  type="text"
                  name="numDoc"
                  size="small"
                  variant="standard"
                  value={form.numDoc}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="auditor-label">
                  Clave
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="clave"
                  type="text"
                  name="clave"
                  size="small"
                  variant="standard"
                  value={form.clave}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="empresa-label">
                  Empresa
                </InputLabel>
                <Select
                  labelId="empresa-label"
                  id="empresaID"
                  name="empresaID"
                  value={form.empresaID}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  variant="standard"
                  label="Empresa"
                  fontFamily="initial"
                >
                  {dataEmpresa.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontFamily: "initial" }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="planta-label">
                  Contrato
                </InputLabel>
                <Select
                  fullWidth
                  required
                  id="planta"
                  name="planta"
                  size="small"
                  variant="standard"
                  value={form.planta}
                  onChange={handleChange}
                  label="Planta"
                  fontFamily="initial"
                >
                  <MenuItem value={true} sx={{ fontFamily: "initial" }}>
                    Planta
                  </MenuItem>
                  <MenuItem value={false} sx={{ fontFamily: "initial" }}>
                    Externo
                  </MenuItem>
                </Select>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: "200px",
                  }}
                  disabled={isSubmitting}
                >
                  <Typography>
                    {isSubmitting ? "Procesando..." : "Crear"}
                  </Typography>
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default UserForm;

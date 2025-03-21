import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createUser } from "../api/authAPI";
import { getEmpresas } from "../api/proyectoAPI";

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
    empresa: "",
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
        empresa: "",
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
      }}
    >
      {open && renderAlert()}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {dataEmpresa.length > 0 ? (
          <Card
            sx={{
              borderRadius: "10px",
              width: { lg: "50%", xs: "90%", md: "70%" },
              overflow: "auto",
              boxShadow: 5,
              textAlign: "center",
            }}
          >
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  CREAR USUARIO
                </Typography>
              }
              avatar={<AccountBoxIcon />}
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
              <form onSubmit={handleSubmit} style={{ width: "80%" }}>
                <Box sx={{ mb: 2 }}>
                  <InputLabel
                    id="auditor-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Nombre
                  </InputLabel>
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
                  <InputLabel
                    id="auditor-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Correo
                  </InputLabel>
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
                  <InputLabel
                    id="auditor-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Rut
                  </InputLabel>
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
                  <InputLabel
                    id="auditor-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Clave
                  </InputLabel>
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
                <Box sx={{ mb: 2 }}>
                  <InputLabel
                    id="empresa-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Empresa
                  </InputLabel>
                  <Select
                    labelId="empresa-label"
                    id="empresa"
                    name="empresa"
                    value={form.empresa} // Aquí usas el valor de 'externo' en lugar de 'form.planta'
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
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
                  <InputLabel
                    id="planta-label"
                    sx={{ fontFamily: "initial" }}
                  >
                    Contrato
                  </InputLabel>
                  <Select
                    fullWidth
                    required
                    id="planta"
                    name="planta"
                    variant="outlined"
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
                    sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                    disabled={isSubmitting}
                  >
                    <Typography sx={{ fontFamily: "initial" }}>
                      {isSubmitting ? "Procesando..." : "Crear"}
                    </Typography>
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
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

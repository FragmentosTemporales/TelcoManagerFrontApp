import { Alert, Box, Button, CircularProgress, InputLabel, MenuItem, TextField, Select, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createUser, getEmpresas } from "../api/authAPI";
import palette from "../theme/palette";

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
  const res = await createUser(payload);
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

  const gradientBtn = {
    background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 100%)`,
    color: '#fff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: 0.3,
    px: 3,
    py: 1.2,
    borderRadius: 3,
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    '&:hover': {
      background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)`,
      boxShadow: '0 10px 28px rgba(0,0,0,0.28)'
    }
  };

  const cardSx = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: '94%', sm: '80%', md: '55%' }, px: { xs: 3, md: 6 }, py: 5,
    border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, backdropFilter: 'blur(10px)', borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden'
  };

  const fieldBox = { mb: 2, '& .MuiInputLabel-root': { fontWeight: 600 } };

  return (
    <Box sx={{ position: 'relative', p:2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: palette.bgGradient }}>

      {open && renderAlert()}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {dataEmpresa.length > 0 ? (
          <Box sx={cardSx}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 4, background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 60%)`, WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 0.5 }}>
              CREAR USUARIO
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box sx={fieldBox}>
                <InputLabel id="nombre-label">Nombre</InputLabel>
                <TextField fullWidth required id="nombre" type="text" name="nombre" size="small" variant="standard" value={form.nombre} onChange={handleChange} />
              </Box>
              <Box sx={fieldBox}>
                <InputLabel id="correo-label">Correo</InputLabel>
                <TextField fullWidth required id="correo" type="email" name="correo" size="small" variant="standard" value={form.correo} onChange={handleChange} />
              </Box>
              <Box sx={fieldBox}>
                <InputLabel id="rut-label">Rut</InputLabel>
                <TextField fullWidth required id="numDoc" type="text" name="numDoc" size="small" variant="standard" value={form.numDoc} onChange={handleChange} />
              </Box>
              <Box sx={fieldBox}>
                <InputLabel id="clave-label">Clave</InputLabel>
                <TextField fullWidth required id="clave" type="text" name="clave" size="small" variant="standard" value={form.clave} onChange={handleChange} />
              </Box>
              <Box sx={fieldBox}>
                <InputLabel id="empresa-label">Empresa</InputLabel>
                <Select labelId="empresa-label" id="empresaID" name="empresaID" value={form.empresaID} onChange={handleChange} fullWidth size="small" variant="standard">
                  {dataEmpresa.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={fieldBox}>
                <InputLabel id="planta-label">Contrato</InputLabel>
                <Select fullWidth required id="planta" name="planta" size="small" variant="standard" value={form.planta} onChange={handleChange}>
                  <MenuItem value={true}>Planta</MenuItem>
                  <MenuItem value={false}>Externo</MenuItem>
                </Select>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button type="submit" disabled={isSubmitting} sx={gradientBtn}>
                  {isSubmitting ? 'Procesando...' : 'Crear'}
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default UserForm;

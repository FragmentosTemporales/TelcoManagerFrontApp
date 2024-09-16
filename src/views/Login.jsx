import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLogin } from "../api/authAPI";
import { onLoad, onLoading, setMessage } from "../slices/authSlice";

function Login() {
  const { message } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ correo: "", clave: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(onLoading());
    const payload = { correo: form.correo, clave: form.clave };

    try {
      const response = await onLogin(payload);
      dispatch(onLoad(response));
      navigate("/");
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {open && renderAlert()}
      <Card sx={{ width: "30%", borderRadius: "0px", boxShadow: 5, minWidth: "450px" }}>
        <CardHeader
          title="Iniciar Sesión"
          sx={{
            backgroundColor: "#0b2f6d",
            color: "white",
            padding: "16px",
            borderBottom: "1px solid #ddd",
            textAlign: "center",
          }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <TextField
                required
                sx={{ minWidth: "400px" }}
                id="correo"
                label="Correo"
                type="email"
                name="correo"
                variant="outlined"
                value={form.correo}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <TextField
                required
                sx={{ minWidth: "400px" }}
                id="clave"
                label="Clave"
                type="password" // Mantenido como 'password'
                name="clave"
                variant="outlined"
                value={form.clave}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" sx={{ background: "#0b2f6d" }}>
                Enviar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;

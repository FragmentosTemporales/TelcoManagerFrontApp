import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  InputAdornment,
  Typography
} from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLogin } from "../api/authAPI";
import { onLoginDominion } from "../api/dominionAPI";
import { onLoad, onLoading, setMessage } from "../slices/authSlice";
import { domLoadAuth } from "../slices/dominionSlice";

function Login() {
  const { message } = useSelector((state) => state.auth);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ correo: "", clave: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(onLoading());
    const payload = { correo: form.correo, clave: form.clave };

    try {
      const response = await onLogin(payload);
      dispatch(onLoad(response));
      navigate("/");

      const usuario = response.usuario

      const payload2 = { username: usuario.numDoc, password: form.clave };

      const res = await onLoginDominion(payload2)
      dispatch(domLoadAuth(res));

    } catch (error) {
      dispatch(setMessage(error));
      setIsSubmitting(false);
      setOpen(true);
    }
  };

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  useEffect(()=>{
    if (token && token != null){
      navigate("/")
    }
  },[token])

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
      <Card sx={{ width: {lg:"30%", md:"70%", xs:"90%" }, borderRadius: "0px", boxShadow: 5, minWidth: "450px" }}>
      <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              INICIAR SESION
            </Typography>
          }

          sx={{
            background: "#0b2f6d",
            color: "white",
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <TextField
                required
                sx={{ minWidth: "400px" }}
                id="clave"
                label="Clave"
                type="password"
                name="clave"
                variant="outlined"
                value={form.clave}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ background: "#0b2f6d" }}>
              {isSubmitting ? "Cargando..." : "Ingresar"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;

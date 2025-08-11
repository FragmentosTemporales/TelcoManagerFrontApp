import {
  Alert,
  Box,
  Checkbox,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LockIcon from "@mui/icons-material/Lock";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLogin } from "../api/authAPI";
import { onLoad, onLoading, setMessage } from "../slices/authSlice";
import { MainLayout } from "./Layout";

function Login() {
  const { message } = useSelector((state) => state.auth);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ correo: "", clave: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setForm(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
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
      if (rememberMe) {
        localStorage.setItem("credentials", JSON.stringify(form));
      } else {
        localStorage.removeItem("credentials");
      }
      setTimeout(() => {
        navigate("/");
      }, 1000);
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

  useEffect(() => {
    if (token && token != null) {
      navigate("/");
    }
  }, [token]);

  return (
    <MainLayout showNavbar={false}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {open && renderAlert()}
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          paddingTop: "25px",
          paddingBottom: "40px",
          backgroundColor: "white",
          border: "2px solid #dfdeda",
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2, mt: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              required
              size="small"
              sx={{ minWidth: "350px" }}
              id="correo"
              label="Correo"
              type="email"
              name="correo"
              variant="standard"
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
              sx={{ minWidth: "350px" }}
              id="clave"
              size="small"
              label="Clave"
              type="password"
              name="clave"
              variant="standard"
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
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberMeChange}
              color="primary"
            />
            <Typography>Recordar usuario</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                background: "#142a3d",
                width: "200px",
                borderRadius: 2,
              }}
            >
              {isSubmitting ? "Cargando..." : "Ingresar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </MainLayout>
  );
}

export default Login;

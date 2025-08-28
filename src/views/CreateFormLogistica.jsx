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
  import { useState } from "react";
  import FeedIcon from '@mui/icons-material/Feed';
  import { useDispatch, useSelector } from "react-redux";
  import { useParams, useNavigate } from "react-router-dom";
  import { createFormLogistica } from "../api/formsAPI";
  import { palette } from "../theme/palette";
  import { onLoad, onLoading, setMessage } from "../slices/formSlice";
  
  function FormLogistica() {
    const {logID} = useParams()
  const authState = useSelector((state) => state.auth);
    const formState = useSelector((state) => state.form);
    const { message } = formState;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const [form, setForm] = useState({
      logID: logID,
      fechaEvento: "",
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
    
      if (form.file) {
        formData.append("file", form.file);
      }
    
      try {
  const response = await createFormLogistica(formData);
        dispatch(onLoad(response));
        setOpen(true);
        navigate("/modulo:solicitudes");
      } catch (error) {
        dispatch(setMessage(error));
        setOpen(true);
      }
    };
  
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', py: 6, background: palette.bgGradient, position: 'relative', '::before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(150deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 65%)', pointerEvents: 'none' } }}>
        {open && (
          <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
            {message}
          </Alert>
        )}
        <Card sx={{ width: '55%', maxWidth: 880, borderRadius: 4, overflow: 'hidden', background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(6px)', boxShadow: '0 18px 42px -16px rgba(0,0,0,0.55), 0 8px 16px -6px rgba(0,0,0,0.35)' }}>
          <CardHeader title={<Typography fontWeight={700} letterSpacing={.5}>FORMULARIO LOGISTICA</Typography>} avatar={<FeedIcon/>} sx={{ background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`, color: 'white' }} />
  
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
                  id="fechaEvento"
                  type="date"
                  name="fechaEvento"
                  variant="standard"
                  value={form.fechaEvento}
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
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primary} 85%)`, fontWeight: 600, width: 220, borderRadius: 3, letterSpacing: .6, boxShadow: '0 6px 18px -6px rgba(0,0,0,0.55)', '&:hover': { background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primaryDark} 90%)` } }}>
                  {isSubmitting ? "Procesando..." : "Crear"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }
  
  export default FormLogistica;
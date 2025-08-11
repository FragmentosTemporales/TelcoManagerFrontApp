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
  import { onLoad, onLoading, setMessage } from "../slices/formSlice";
  
  function FormLogistica() {
    const {logID} = useParams()
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
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
        const response = await createFormLogistica(formData, token);
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
          overflow: "auto",
          border: "2px solid #dfdeda",
        }}
      >
          <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              FORMULARIO LOGISTICA
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
  
  export default FormLogistica;
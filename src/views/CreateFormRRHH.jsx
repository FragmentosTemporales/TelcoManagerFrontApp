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
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams, useNavigate } from "react-router-dom";
  import { createFormRRHH } from "../api/formsAPI";
  import { onLoad, onLoading, setMessage } from "../slices/formSlice";
  
  function FormRRHH() {
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
      fechaMarcaje: "",
      fechaSubidaDocumento: "",
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
      formData.append("fechaMarcaje", form.fechaMarcaje);
      formData.append("fechaSubidaDocumento", form.fechaSubidaDocumento);
    
      if (form.file) {
        formData.append("file", form.file);
      }
    
      try {
        const response = await createFormRRHH(formData, token);
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
          background: "white",
          alignItems: "center",
          pt: 8,
          height: "100%",
        }}
      >
        {open && (
          <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
            {message}
          </Alert>
        )}
        <Card
          sx={{
            borderRadius: "10px",
            width: "50%",
            height: "100%",
            overflow: "auto",
            boxShadow: 5,
          }}
        >
          <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              FORMULARIO RRHH
            </Typography>
          }
          avatar={<FeedIcon/>}
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
            <form onSubmit={handleSubmit} style={{ width: "80%" }} encType="multipart/form-data">
              <Box sx={{ mb: 2 }}>
                <InputLabel id="fechaMarcaje-label">Fecha Marcaje</InputLabel>
                <TextField
                  fullWidth
                  id="fechaMarcaje"
                  type="date"
                  name="fechaMarcaje"
                  variant="outlined"
                  value={form.fechaMarcaje}
                  onChange={handleChange}
                />
              </Box>
  
              <Box sx={{ mb: 2 }}>
                <InputLabel id="fechaSubidaDocumento-label">Fecha Subida Documento</InputLabel>
                <TextField
                  fullWidth
                  id="fechaSubidaDocumento"
                  type="date"
                  name="fechaSubidaDocumento"
                  variant="outlined"
                  value={form.fechaSubidaDocumento}
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
                  variant="outlined"
                  onChange={handleFileChange}
                />
              </Box>
  
              <Box sx={{ textAlign: "center" }}>
              <Button
                  type="submit"
                  variant="contained"
                  sx={{ background: "#0b2f6d", fontWeight: "bold" }}
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
  
  export default FormRRHH;
  
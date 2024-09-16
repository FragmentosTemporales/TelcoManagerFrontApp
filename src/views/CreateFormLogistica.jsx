import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    InputLabel,
    TextField,
  } from "@mui/material";
  import { useState } from "react";
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
        navigate("/solicitudes");
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
            borderRadius: "0px",
            width: "50%",
            height: "100%",
            overflow: "auto",
            boxShadow: 5,
          }}
        >
          <CardHeader
            title="Formulario Logística"
            sx={{ background: "#0b2f6d", color: "white" }}
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
                  variant="outlined"
                  value={form.fechaEvento}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="file-label">Archivo</InputLabel>
                <TextField
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
                  sx={{ background: "#0b2f6d" }}
                >
                  Crear
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }
  
  export default FormLogistica;
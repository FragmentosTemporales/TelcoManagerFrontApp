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
import { createCCPA } from "../api/ccpaAPI";
import { onLoad, onLoading, setMessage } from "../slices/ccpaSlice";

function FormCCPA() {
  const authState = useSelector((state) => state.auth);
  const ccpaState = useSelector((state) => state.ccpa);
  const { token } = authState;
  const { message } = ccpaState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    descri: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(onLoading());
    const payload = {
      centroCostoPrincipalActividadID: form.centroCostoPrincipalActividadID,
      descri: form.descri,
    };
    try {
      const response = await createCCPA(payload, token);
      dispatch(onLoad(response));
      setOpen(true);
      setForm({
        centroCostoPrincipalActividadID: "",
        descri: "",
      });
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
      overflow: "auto",
      height: "100%",
      width: "100%",
      paddingTop: 1,
      paddingBottom: 2,
    }}
  >
      {open == true ? (
        <Alert
          onClose={() => {
            handleClose();
          }}
          severity="info"
          sx={{ marginBottom: 3 }}
        >
          {message}
        </Alert>
      ) : null}
      <Card
        sx={{
          borderRadius: "0px",
          width: "50%",
          height: "240px",
          overflow: "auto",
        }}
      >
        <CardHeader
          title="Formulario Centro Costo Principal Actividad"
          sx={{ background: "#003f5c", color: "white" }}
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <form onSubmit={handleSubmit} style={{width:'80%'}}>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="descri-select">Descripción</InputLabel>
              <TextField
                fullWidth
                required
                id="descri"
                type="text"
                name="descri"
                variant="outlined"
                value={form.descri}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="success">
                Crear
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
export default FormCCPA;

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
import { createArea } from "../api/areaAPI";
import { onLoad, onLoading, setMessage } from "../slices/areaSlice";

function FormArea() {
  const authState = useSelector((state) => state.auth);
  const areaState = useSelector((state) => state.area);
  const { token } = authState;
  const { message } = areaState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    descri: "",
    hab: true,
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
      areaID: form.areaID,
      descri: form.descri,
      hab: form.hab,
    };
    try {
      const response = await createArea(payload, token);
      dispatch(onLoad(response));
      setOpen(true);
      setForm({
        descri: "",
        hab: true,
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
        height: "260px",
        width: "100%",
        paddingTop: 1,
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
          boxShadow:5
        }}
      >
        <CardHeader
          title="Formulario Area"
          sx={{ background: "#0b2f6d", color: "white" }}
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
            <Button type="submit" variant="contained" sx={{background:'#0b2f6d'}}>
                Crear
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
export default FormArea;

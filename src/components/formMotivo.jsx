import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMotivo } from "../api/motivoAPI";
import { getArea } from "../api/areaAPI";
import { onLoad, onLoading } from "../slices/areaSlice";
import { setMessage } from "../slices/motivoSlice";

function FormMotivo() {
  const authState = useSelector((state) => state.auth);
  const areaState = useSelector((state) => state.area);
  const motivoState = useSelector((state) => state.motivo);
  const { token } = authState;
  const { is_loading, is_load, message } = areaState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    areaID: "",
    descri: "",
    hab: true,
  });
  const [options, setOptions] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      dispatch(onLoading());
      const res = await getArea(token);
      dispatch(onLoad(res));

      const transformedOptions = res.map((item) => ({
        value: item.areaID,
        label: item.descri,
      }));
      setOptions(transformedOptions);
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(onLoading());
    const payload = {
      areaID: form.areaID,
      motivoID: form.motivoID,
      descri: form.descri,
      hab: form.hab,
    };
    try {
      const response = await createMotivo(payload, token);
      console.log(response)
      dispatch(onLoad(response));
      setOpen(true);
      setForm({
        areaID: "",
        descri: "",
        hab: true,
      });
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      {open && (
        <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
          {message}
        </Alert>
      )}
      <Card
        sx={{
          borderRadius: "0px",
          width: "50%",
          height: "340px",
          overflow: "auto",
          boxShadow: 5,
        }}
      >
        <CardHeader
          title="Formulario Motivo"
          sx={{ background: "#0b2f6d", color: "white" }}
        />
        {!is_loading && is_load && (
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form onSubmit={handleSubmit} style={{ width: "80%" }}>
              <Box sx={{ mb: 2 }}>
                <InputLabel id="area-select-label">Área Asociada</InputLabel>
                <TextField
                  select
                  label="Área"
                  name="areaID"
                  variant="filled"
                  value={form.areaID}
                  onChange={handleChange}
                  sx={{ minWidth: "100%" }}
                >
                  {options.length > 0 ? (
                    options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      Opciones no cargadas
                    </MenuItem>
                  )}
                </TextField>
              </Box>

              <Box sx={{ mb: 2 }}>
                <InputLabel id="descri-label">Descripción</InputLabel>
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
        )}
      </Card>
    </Box>
  );
}

export default FormMotivo;

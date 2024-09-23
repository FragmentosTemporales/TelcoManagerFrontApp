import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSolicitud } from "../api/solicitudAPI";
import { getSubMotivoList } from "../api/smAPI";
import areaData from "../data/areaData";
import {
  prevencionData,
  calidadData,
  operacionesData,
  logisticaData,
  recursoshumanosData,
  flotaData,
} from "../data/motivoData";
import personaData from "../data/personaData";

import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";

function FormSolicitud() {
  const authState = useSelector((state) => state.auth);
  const solicitudState = useSelector((state) => state.solicitud);
  const navigate = useNavigate();
  const { token, user_id } = authState;
  const { message } = solicitudState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    personaID: "",
    userID: "",
    motivoID: "",
    areaID: "",
    submotivoID: null,
  });
  const [motivoOptions, setMotivoOptions] = useState([]);
  const [personaOptions, setPersonaOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchSubMotivo = async (ID) => {
    try {
      const res = await getSubMotivoList(token, ID);
      const transformedOptions = res.map((item) => ({
        value: item.submotivoID,
        label: item.descri,
      }));
      setSmOptions(transformedOptions);
    } catch (error) {
      console.log(error);
    }
  };


  const setMotivoData = () => {
    if (form.areaID && form.areaID != "") {
      switch (form.areaID) {
        case "1":
          const transformedOptions = prevencionData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions);
          break;

        case "2":
          const transformedOptions2 = calidadData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions2);
          break;

        case "3":
          const transformedOptions3 = operacionesData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions3);
          break;

        case "4":
          const transformedOptions4 = logisticaData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions4);
          break;

        case "5":
          const transformedOptions5 = recursoshumanosData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions5);
          break;

        case "6":
          const transformedOptions6 = flotaData.map((item) => ({
            value: item.motivoID,
            label: item.descri,
          }));
          setMotivoOptions(transformedOptions6);
          break;

        default:
          console.log("Area no reconocida");
          break;
      }
    } else {
      console.log("No hay estado disponible en dataGestiones[0]");
    }
  };

  const fetchArea = async () => {
    try {
      const transformedOptions = areaData.map((item) => ({
        value: item.areaID,
        label: item.descri,
      }));
      setAreaOptions(transformedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPersona = async () => {
    try {
      const transformedOptions = personaData.map((item) => ({
        value: item.personaID,
        label: item.nombre,
      }));
      setPersonaOptions(transformedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(onLoading());
    const payload = {
      personaID: form.personaID,
      userID: form.userID,
      motivoID: form.motivoID,
      areaID: form.areaID,
      submotivoID: form.submotivoID,
    };
    try {
      const response = await createSolicitud(payload, token);
      dispatch(onLoad(response));
      setOpen(true);
      setForm({
        personaID: "",
        userID: "",
        motivoID: "",
        areaID: "",
        submotivoID: null,
      });
      navigate(response.path);
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchArea();
    fetchPersona();
  }, []);

  useEffect(() => {
    {
      form.motivoID != "" ? fetchSubMotivo(form.motivoID) : null;
    }
  }, [form.motivoID]);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id || "",
    }));
  }, [user_id]);

  useEffect(()=>{
    if (form.areaID && form.areaID != ""){
      setMotivoData()
    }
  },[form.areaID])

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
          height: "530px",
          overflow: "auto",
          boxShadow: 5,
        }}
      >
        <CardHeader
          title="Formulario Solicitud"
          sx={{ background: "#0b2f6d", color: "white" }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "80%" }}>
            <Box sx={{ mb: 2 }}>
              <InputLabel id="area-select-label">Area</InputLabel>
              <Autocomplete
                options={areaOptions}
                getOptionLabel={(option) => option.label}
                value={
                  areaOptions.find((option) => option.value === form.areaID) ||
                  null
                }
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    areaID: newValue ? newValue.value : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Area"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="persona-select-label">
                Persona a amonestar
              </InputLabel>
              <Autocomplete
                options={personaOptions}
                getOptionLabel={(option) => option.label}
                value={
                  personaOptions.find(
                    (option) => option.value === form.personaID
                  ) || null
                }
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    personaID: newValue ? newValue.value : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Persona"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="motivo-select-label">Motivo Asociado</InputLabel>
              <Autocomplete
                options={motivoOptions}
                getOptionLabel={(option) => option.label}
                value={
                  motivoOptions.find(
                    (option) => option.value === form.motivoID
                  ) || null
                }
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    motivoID: newValue ? newValue.value : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Motivo"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel id="motivo-select-label">
                Submotivo Asociado
              </InputLabel>
              <Autocomplete
                options={smOptions}
                getOptionLabel={(option) => option.label}
                value={
                  smOptions.find(
                    (option) => option.value === form.submotivoID
                  ) || null
                }
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    submotivoID: newValue ? newValue.value : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Submotivo"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                disabled={isSubmitting} // Deshabilitar el botón cuando isSubmitting es true
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

export default FormSolicitud;

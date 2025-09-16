import { Alert, Autocomplete, Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSolicitud } from "../api/solicitudAPI";
import {
  motivoData17,
  motivoData18,
  motivoData19,
  motivoData20,
  motivoData22,
  motivoData24,
  motivoData26,
  motivoData27
} from "../data/submotivoData";
import areaData from "../data/areaData";
import {
  prevencionData,
  calidadData,
  operacionesData,
  logisticaData,
  recursoshumanosData,
  flotaData,
} from "../data/motivoData";
import { getPersona } from "../api/personaAPI";

import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";
import palette from "../theme/palette";

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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const setSubmotivoData = () => {
    if (form.motivoID && form.motivoID != "") {
      switch (form.motivoID) {
        case "17":
          const transformedOptions = motivoData17.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions);
          break;

        case "18":
          const transformedOptions2 = motivoData18.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions2);
          break;

        case "19":
          const transformedOptions3 = motivoData19.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions3);
          break;

        case "20":
          const transformedOptions4 = motivoData20.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions4);
          break;

        case "22":
          const transformedOptions5 = motivoData22.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions5);
          break;

        case "24":
          const transformedOptions6 = motivoData24.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions6);
          break;

        case "26":
          const transformedOptions7 = motivoData26.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions7);
          break;

        case "27":
          const transformedOptions8 = motivoData27.map((item) => ({
            value: item.submotivoID,
            label: item.descri,
          }));
          setSmOptions(transformedOptions8);
          break;

        default:
          console.log("motivoID no reconocida");
          break;
      }
    } else {
      console.log("No hay submotivos disponible");
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
      console.log("No hay motivos disponible");
    }
  };

  const fetchPersonas = async () => {
    setIsLoading(true);
    try {
      const response = await getPersona(token);
      setData(response);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const fetchArea = async () => {
    try {
      const transformedOptions = areaData.map((item) => ({
        value: item.areaID,
        label: item.descri,
      }));
      setAreaOptions(transformedOptions);
    } catch (error) {
      console.error(error);
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
  const response = await createSolicitud(payload);
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
      console.error(error);
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchArea();
  }, []);

  useEffect(() => {
    {
      form.motivoID != "" ? setSubmotivoData() : null;
    }
  }, [form.motivoID]);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id || "",
    }));
  }, [user_id]);

  useEffect(() => {
    if (form.areaID && form.areaID != "") {
      setMotivoData();
    }
  }, [form.areaID]);

  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const transformedOptions = data.map((item) => ({
        value: item.personaID,
        label: item.RUT + " " + item.Nombre,
      }));
      setPersonaOptions(transformedOptions);
    }
  }, [data]);

  const gradientBtn = {
    background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 100%)`,
    color: '#fff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: 0.3,
    px: 3,
    py: 1.2,
    borderRadius: 3,
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    '&:hover': {
      background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)`,
      boxShadow: '0 10px 28px rgba(0,0,0,0.28)'
    }
  };

  const fieldBox = { mb: 2, '& .MuiInputLabel-root': { fontWeight: 600 } };

  const cardSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: { xs: '95%', sm: '80%', md: '60%' },
    px: { xs: 3, md: 6 },
    py: 5,
    border: `1px solid ${palette.borderSubtle}`,
    background: palette.cardBg,
    backdropFilter: 'blur(10px)',
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '40vh', width: '100%', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', background: palette.bgGradient }}>
      {/* decorative overlays */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: -120, left: -80, width: 300, height: 300, borderRadius: '50%', background: `${palette.accent}22`, filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: -140, right: -100, width: 360, height: 360, borderRadius: '50%', background: `${palette.primary}1f`, filter: 'blur(90px)' }} />
      </Box>

      {open && (
        <Alert onClose={handleClose} severity="info" sx={{ mb: 3, fontWeight: 500, backdropFilter: 'blur(6px)', background: `${palette.cardBg}aa`, border: `1px solid ${palette.borderSubtle}` }}>
          {message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ ...cardSx, justifyContent: 'center', minHeight: 420 }}>
          <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: '260px', borderRadius: 3 }} />
        </Box>
      ) : (
        <Box sx={cardSx}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 60%)`, WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 0.5 }}>
            CREAR SOLICITUD DE AMONESTACION
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={fieldBox}>
              <Autocomplete
                options={areaOptions}
                variant="standard"
                size="small"
                getOptionLabel={(option) => option.label}
                value={areaOptions.find((option) => option.value === form.areaID) || null}
                onChange={(event, newValue) => {
                  setForm({ ...form, areaID: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => <TextField {...params} label="Area" fullWidth />}
              />
            </Box>

            <Box sx={fieldBox}>
              <Autocomplete
                options={personaOptions}
                variant="standard"
                size="small"
                getOptionLabel={(option) => option.label}
                value={personaOptions.find((option) => option.value === form.personaID) || null}
                onChange={(event, newValue) => {
                  setForm({ ...form, personaID: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => <TextField {...params} label="Persona" fullWidth />}
              />
            </Box>

            <Box sx={fieldBox}>
              <Autocomplete
                options={motivoOptions}
                getOptionLabel={(option) => option.label}
                variant="standard"
                size="small"
                value={motivoOptions.find((option) => option.value === form.motivoID) || null}
                onChange={(event, newValue) => {
                  setForm({ ...form, motivoID: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => <TextField {...params} label="Motivo" fullWidth />}
              />
            </Box>

            <Box sx={fieldBox}>
              <Autocomplete
                options={smOptions}
                variant="standard"
                size="small"
                getOptionLabel={(option) => option.label}
                value={smOptions.find((option) => option.value === form.submotivoID) || null}
                onChange={(event, newValue) => {
                  setForm({ ...form, submotivoID: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => <TextField {...params} label="Submotivo" fullWidth />}
              />
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button type="submit" disabled={isSubmitting} sx={gradientBtn}>
                {isSubmitting ? 'Procesando...' : 'Crear'}
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
}

export default FormSolicitud;

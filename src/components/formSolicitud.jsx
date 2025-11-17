import { Alert, Autocomplete, Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSolicitud } from "../api/solicitudAPI";
import { getPersona } from "../api/personaAPI";
import { getAreaMotivos } from "../api/solicitudAPI";

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
  const [personaOptions, setPersonaOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newAreaOptions, setNewAreaOptions] = useState([]);
  
  const [allMotivos, setAllMotivos] = useState([]);
  const [allSubmotivos, setAllSubmotivos] = useState([]);

  const [filteredMotivos, setFilteredMotivos] = useState([]);
  const [filteredSubmotivos, setFilteredSubmotivos] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchPersonas = async () => {
    setIsLoading(true);
    try {
      const response = await getPersona(token);

      const res = await getAreaMotivos();

      let dataArray;
      if (typeof res === 'string') {
        const sanitizedRes = res.replace(/:\s*NaN/g, ': null');
        dataArray = JSON.parse(sanitizedRes);
      } else {
        dataArray = res?.data || res;
      }
      
      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        const uniqueAreas = dataArray.reduce((acc, item) => {
          if (!acc.find(area => area.value === item.areaID)) {
            acc.push({
              value: item.areaID,
              label: item.area
            });
          }
          return acc;
        }, []);

        setNewAreaOptions(uniqueAreas);

        const uniqueMotivos = dataArray.reduce((acc, item) => {
          if (!acc.find(motivo => motivo.value === item.motivoID)) {
            acc.push({
              value: item.motivoID,
              label: item.motivo,
              areaID: item.areaID
            });
          }
          return acc;
        }, []);
        
        setAllMotivos(uniqueMotivos);

        const uniqueSubmotivos = dataArray.reduce((acc, item) => {
          if (item.submotivo && item.submotivoID !== null) {
            if (!acc.find(sm => sm.value === item.submotivoID)) {
              acc.push({
                value: item.submotivoID,
                label: item.submotivo,
                motivoID: item.motivoID
              });
            }
          }
          return acc;
        }, []);
        
        setAllSubmotivos(uniqueSubmotivos);
      }

      setData(response);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
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
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id || "",
    }));
  }, [user_id]);

  useEffect(() => {
    if (form.areaID && allMotivos.length > 0) {
      const motivosFiltrados = allMotivos.filter(motivo => motivo.areaID === form.areaID);
      setFilteredMotivos(motivosFiltrados);
      
      if (form.motivoID && !motivosFiltrados.find(m => m.value === form.motivoID)) {
        setForm(prev => ({ ...prev, motivoID: '', submotivoID: null }));
      }
    } else {
      setFilteredMotivos([]);
    }
  }, [form.areaID, allMotivos]);

  useEffect(() => {
    if (form.motivoID && allSubmotivos.length > 0) {
      const submotivosFiltrados = allSubmotivos.filter(sm => sm.motivoID === form.motivoID);
      setFilteredSubmotivos(submotivosFiltrados);
      
      if (form.submotivoID && !submotivosFiltrados.find(sm => sm.value === form.submotivoID)) {
        setForm(prev => ({ ...prev, submotivoID: null }));
      }
    } else {
      setFilteredSubmotivos([]);
    }
  }, [form.motivoID, allSubmotivos]);

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
                options={newAreaOptions}
                variant="standard"
                size="small"
                getOptionLabel={(option) => option.label}
                value={newAreaOptions.find((option) => option.value === form.areaID) || null}
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
                options={filteredMotivos}
                getOptionLabel={(option) => option.label}
                variant="standard"
                size="small"
                value={filteredMotivos.find((option) => option.value === form.motivoID) || null}
                onChange={(event, newValue) => {
                  setForm({ ...form, motivoID: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => <TextField {...params} label="Motivo" fullWidth />}
              />
            </Box>

            <Box sx={fieldBox}>
              <Autocomplete
                options={filteredSubmotivos}
                variant="standard"
                size="small"
                getOptionLabel={(option) => option.label}
                value={filteredSubmotivos.find((option) => option.value === form.submotivoID) || null}
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

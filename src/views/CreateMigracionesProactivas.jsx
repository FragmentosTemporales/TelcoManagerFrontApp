import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  getClienteMigracion,
  createMigracion,
  getDataMigracionesComunas,
  getMigracionUnica,
  getMigracionFiltrada
} from "../api/despachoAPI";
import { MigracionLayout } from "./Layout";
import { palette } from "../theme/palette";
import { onClear } from "../slices/migracionSlice";
import ModuleHeader from "../components/ModuleHeader";

export default function CreateMigracionesProactivas() {
  const authState = useSelector((state) => state.auth);
  const { user_id } = authState;
  const migracionState = useSelector((state) => state.migraciones);
  const { id_selected } = migracionState;
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const [dataComuna, setDataComuna] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [comuna, setComuna] = useState({ comuna: "NUNOA" });
  const [migracion, setMigracion] = useState(null);

  const [id_vivienda, setIdVivienda] = useState(null);
  const [filterID, setFilterID] = useState("");

  const [form, setForm] = useState({
    id_vivienda: "",
    contacto: "",
    ingreso: "",
    estado: "",
    fecha_agenda: "",
    bloque_horario: "",
    comentario: "",
    userID: "",
  });

  const fetchComunas = async () => {
    setIsSubmitting(true);
    try {
  const response = await getDataMigracionesComunas();
      setDataComuna(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPendiente = async (id) => {
    setIsSubmitting(true);
    try {
  const response = await getMigracionUnica(id);
      setMigracion(response);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactoOptions = [
    "Sin Factibilidad",
    "Sin Contacto",
    "Contactado"
  ];

  const SinContactoOptions = ["Sin contacto"]
  const SinFactibilidadOptions = ["Ya migrado", "Sin botón migrar", "Otros"]
  const ContactadoOptions = ["Ingresada", "Pendiente Ingreso", "Cliente rechaza"]

  const PendienteIngreso = ["Ticket", "Otra llamada"];
  const ClienteRechaza = ["Bocas análogas", "Llamada anteriormente", "Otros"];

const setIngresoOpciones = () => {
    if (form.contacto && form.contacto != "") {
      switch (form.contacto) {
        case "Sin Factibilidad":
          setIngresoOptions(SinFactibilidadOptions);
          break;
        case "Sin Contacto":
          setIngresoOptions(SinContactoOptions);
          break;
        case "Contactado":
          setIngresoOptions(ContactadoOptions);
          break;

        default:
          console.log("contacto no reconocido");
          break;
      }
    } else {
      console.log("No hay submotivos disponible");
    }
  };

const setEstadoOpciones = () => {
    if (form.ingreso && form.ingreso != "") {
      switch (form.ingreso) {
        case "Pendiente Ingreso":
          setEstadoOptions(PendienteIngreso);
          break;
        case "Cliente rechaza":
          setEstadoOptions(ClienteRechaza);
          break;


        default:
          console.log("Ingreso no reconocido");
          break;
      }
    } else {
      console.log("No hay submotivos disponible");
    }
  };

  useEffect(() => {
    if (form.contacto != "") {
      setIngresoOpciones();
      // Resetear ingreso y estado cuando cambia contacto
      setForm(prevForm => ({
        ...prevForm,
        ingreso: "",
        estado: ""
      }));
      setEstadoOptions([]);
    }
  }, [form.contacto]);

  useEffect(() => {
    if (form.ingreso != "") {
      setEstadoOpciones();
    } else {
      // Resetear estado cuando ingreso está vacío
      setForm(prevForm => ({
        ...prevForm,
        estado: ""
      }));
      setEstadoOptions([]);
    }
  }, [form.ingreso]);

  const [ingresoOptions, setIngresoOptions] = useState([])
  const [estadoOptions, setEstadoOptions] = useState([])

  const franjasHorarias = ["10:00 - 13:00", "13:00 - 16:00", "16:00 - 19:00"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
  const response = await getClienteMigracion(comuna);
      setMigracion(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
  const response = await getMigracionFiltrada(filterID);
      setMigracion(response[0]);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setForm({
      id_vivienda: "",
      contacto: "",
      ingreso: "",
      fecha_agenda: "",
      bloque_horario: "",
      comentario: "",
      userID: user_id,
    });
    setMigracion(null);
    setIdVivienda(null);
  };

  const handleSendForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
  const response = await createMigracion(form);
      setAlertType("success");
      setMessage("Migración creada exitosamente.");
      setOpen(true);
      dispatch(onClear());
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      clearForm();
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (id_selected) {
      handleSubmitPendiente(id_selected);
    }
  }, [id_selected]);

  useEffect(() => {
    fetchComunas();
  }, []);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id,
    }));
  }, [user_id]);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      id_vivienda: String(id_vivienda),
    }));
  }, [id_vivienda]);

  useEffect(() => {
    if (migracion && migracion.ID_VIVIENDA) {
      setIdVivienda(migracion.ID_VIVIENDA);
    }
  }, [migracion]);

  // Forzar scroll hacia arriba al montar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <MigracionLayout showNavbar={true} id_vivienda={id_vivienda}>
  <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '110vh',
          background: palette.bgGradient,
          position: 'relative',
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        <ModuleHeader
          title="Migraciones Proactivas"
          subtitle="Búsqueda, carga y creación de migraciones proactivas"
          divider
        />

        {open && (
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{
              width: { lg: '80%', md: '80%', sm: '80%', xs: '90%' },
              mb: 2,
              mt: 2,
              background: palette.cardBg,
              backdropFilter: 'blur(6px)',
              border: `1px solid ${palette.borderSubtle}`,
              borderRadius: 3,
              boxShadow: 4
            }}
          >
            {message}
          </Alert>
        )}
  <Box
          sx={{
            width: '98%',
            height: '100%',
            background: palette.cardBg,
            mb: 2,
            border: `1px solid ${palette.borderSubtle}`,
            borderRadius: 3,
            display: 'flex',
            flexDirection: { lg: 'row', md: 'column', sm: 'column', xs: 'column' },
            boxShadow: '0 8px 26px -8px rgba(0,0,0,0.42)',
            backdropFilter: 'blur(6px)',
            overflow: 'hidden'
          }}
        >
              <Box
                sx={{
                  width: { lg: '50%', md: '100%', sm: '100%', xs: '100%' },
                  height: '100%',
                  background: 'transparent'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    p: 2,
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 600,
                    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 125%)`,
                    letterSpacing: .5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.35)'
                  }}
                >
                  {" "}
                  SELECCIONA COMUNA
                </Typography>
                <Divider />
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: {
                      lg: "row",
                      md: "row",
                      sm: "column",
                      xs: "column",
                    },
                    justifyContent: "space-around",
                  }}
                >
                  <Select
                    value={comuna.comuna}
                    onChange={(e) => setComuna({ comuna: e.target.value })}
                    variant="standard"
                    size="small"
                    sx={{
                      width: { lg: "30%", md: "30%", sm: "100%", xs: "100%" },
                      marginBottom: 2,
                      borderRadius: "0px",
                    }}
                  >
                    {dataComuna.map((option) => (
                      <MenuItem key={option.COMUNA} value={option.COMUNA}>
                        {option.COMUNA}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    variant='contained'
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    sx={{
                      width: { lg: '30%', md: '30%', sm: '100%', xs: '100%' },
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 80%)`,
                      boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)',
                        mixBlendMode: 'overlay',
                        opacity: .55,
                        transition: 'opacity .4s'
                      },
                      '&:hover': { boxShadow: '0 12px 26px -6px rgba(0,0,0,0.55)', '&:before': { opacity: .85 } }
                    }}
                  >
                    <Typography variant='body1' sx={{ color: '#fff', fontWeight: 500 }}>
                      {isSubmitting ? 'Cargando...' : 'Cargar Cliente'}
                    </Typography>
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  width: { lg: '50%', md: '100%', sm: '100%', xs: '100%' },
                  height: '100%',
                  background: 'transparent'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    p: 2,
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 600,
                    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 125%)`,
                    letterSpacing: .5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.35)'
                  }}
                >
                  {" "}
                  BUSCAR POR RUT
                </Typography>
                <Divider />
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: {
                      lg: "row",
                      md: "row",
                      sm: "column",
                      xs: "column",
                    },
                    justifyContent: "space-around",
                  }}
                >
                  <TextField
                    size="small"
                    variant="standard"
                    id="rut_cliente"
                    type="text"
                    value={filterID || ""}
                    onChange={(e) => setFilterID(e.target.value)}
                    sx={{marginBottom: 2,}}
                  />
                  <Button
                    variant='contained'
                    disabled={isSubmitting}
                    onClick={handleFilter}
                    sx={{
                      width: { lg: '30%', md: '30%', sm: '100%', xs: '100%' },
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 80%)`,
                      boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)',
                        mixBlendMode: 'overlay',
                        opacity: .55,
                        transition: 'opacity .4s'
                      },
                      '&:hover': { boxShadow: '0 12px 26px -6px rgba(0,0,0,0.55)', '&:before': { opacity: .85 } }
                    }}
                  >
                    <Typography variant='body1' sx={{ color: '#fff', fontWeight: 500 }}>
                      {isSubmitting ? 'Cargando...' : 'Buscar'}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>

            {migracion && (
              <Box
                sx={{
                  width: '98%',
                  height: '100%',
                  background: palette.cardBg,
                  border: `1px solid ${palette.borderSubtle}`,
                  borderRadius: 3,
                  mb: 2,
                  boxShadow: '0 8px 26px -8px rgba(0,0,0,0.42)',
                  backdropFilter: 'blur(6px)',
                  overflow: 'hidden'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    p: 2,
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: 600,
                    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 125%)`,
                    letterSpacing: .5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.35)'
                  }}
                >
                  {" "}
                  CLIENTE SELECCIONADO
                </Typography>
                <Divider />

                <Box
                  sx={{
                    paddingLeft: 2,
                    paddingTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Cliente
                    </Typography>
                    <Typography variant="body1">
                      {migracion.Cliente ? migracion.Cliente : "No disponible"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      paddingLeft: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Rut
                    </Typography>
                  <Typography variant="body1">
                    {migracion.rut_cliente
                      ? migracion.rut_cliente
                      : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Celular
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {migracion.Celular ? 
                      migracion.Celular.split(',').map((phone, index) => {
                        const cleanPhone = phone.trim();
                        return cleanPhone ? (
                          <Typography
                            key={index}
                            component="a"
                            href={`tel:${cleanPhone}`}
                            variant="body1"
                            sx={{
                              color: '#1976d2',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              '&:hover': {
                                color: '#0d47a1'
                              }
                            }}
                          >
                            {cleanPhone}{index < migracion.Celular.split(',').length - 1 ? ',' : ''}
                          </Typography>
                        ) : null;
                      })
                      : "No disponible"
                    }
                  </Box>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Región
                  </Typography>
                  <Typography variant="body1">
                    {migracion.REGION ? migracion.REGION : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ciudad
                  </Typography>
                  <Typography variant="body1">
                    {migracion.CIUDAD ? migracion.CIUDAD : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Comuna
                  </Typography>
                  <Typography variant="body1">
                    {migracion.COMUNA ? migracion.COMUNA : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Dirección
                  </Typography>
                  <Typography variant="body1">
                    {migracion.DIRECCION ? migracion.DIRECCION : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Promoción
                  </Typography>
                  <Typography variant="body1">
                    {migracion.PROMOCION ? migracion.PROMOCION : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Internet
                  </Typography>
                  <Typography variant="body1">
                    {migracion.INTERNET ? migracion.INTERNET : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Producto Cable
                  </Typography>
                  <Typography variant="body1">
                    {migracion.PRODUCTO_CABLE
                      ? migracion.PRODUCTO_CABLE
                      : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Producto Fono
                  </Typography>
                  <Typography variant="body1">
                    {migracion.PRODUCTO_FONO
                      ? migracion.PRODUCTO_FONO
                      : "No disponible"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingBottom: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Subtipo
                  </Typography>
                  <Typography variant="body1">
                    {migracion.subtipo ? migracion.subtipo : "No disponible"}
                  </Typography>
                </Box>
              </Box>
            )}

            {id_vivienda && (
              <Box
                sx={{
                  width: "98%",
                  height: "100%",
                  backgroundColor: "#fff",
                  border: "2px solid #dfdeda",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    padding: 2,
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#142a3d",
                  }}
                >
                  MIGRACIONES
                </Typography>
                <Divider />
                <form onSubmit={handleSendForm}>
                  <Box
                    sx={{
                      mb: 2,
                      mt: 2,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      paddingLeft: 2,
                    }}
                  >
                    <InputLabel
                      htmlFor="id_vivienda"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      ID Vivienda
                    </InputLabel>
                    <TextField
                      id="id_vivienda"
                      required
                      disabled
                      type="text"
                      value={form.id_vivienda}
                      onChange={(e) =>
                        setForm({ ...form, id_vivienda: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    />
                    <InputLabel
                      htmlFor="contacto"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Contacto
                    </InputLabel>
                    <Select
                      required
                      id="contacto-select"
                      value={form.contacto}
                      onChange={(e) =>
                        setForm({ ...form, contacto: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    >
                      {contactoOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <InputLabel
                      htmlFor="ingreso"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Ingreso
                    </InputLabel>
                    <Select
                      required
                      id="ingreso-select"
                      value={form.ingreso}
                      onChange={(e) =>
                        setForm({ ...form, ingreso: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    >
                      {ingresoOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <InputLabel
                      htmlFor="estado"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Estado
                    </InputLabel>
                    <Select
                      id="estado-select"
                      value={form.estado}
                      onChange={(e) =>
                        setForm({ ...form, estado: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    >
                      {estadoOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <InputLabel
                      htmlFor="fecha_agenda"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Fecha de Agenda
                    </InputLabel>
                    <TextField
                      id="fecha_agenda"
                      type="date"
                      value={form.fecha_agenda}
                      onChange={(e) =>
                        setForm({ ...form, fecha_agenda: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    />
                    <InputLabel
                      htmlFor="bloque_horario"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Bloque Horario
                    </InputLabel>
                    <Select
                      id="franja-horaria-select"
                      value={form.bloque_horario}
                      onChange={(e) =>
                        setForm({ ...form, bloque_horario: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "80%", xs: "90%" },
                        mb: 2,
                      }}
                    >
                      {franjasHorarias.map((franja) => (
                        <MenuItem key={franja} value={franja}>
                          {franja}
                        </MenuItem>
                      ))}
                    </Select>
                    <InputLabel
                      htmlFor="comentario"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Comentario
                    </InputLabel>
                    <TextField
                      id="comentario"
                      required
                      type="text"
                      value={form.comentario}
                      onChange={(e) =>
                        setForm({ ...form, comentario: e.target.value })
                      }
                      size="small"
                      variant="standard"
                      multiline
                      rows={4}
                      sx={{
                        width: { lg: "90%", md: "90%", sm: "90%", xs: "90%" },
                        mb: 2,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mb: 2,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant='contained'
                      type='submit'
                      sx={{
                        width: '40%',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 80%)`,
                        boxShadow: '0 8px 22px -6px rgba(0,0,0,0.45)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)',
                          mixBlendMode: 'overlay',
                          opacity: .55,
                          transition: 'opacity .4s'
                        },
                        '&:hover': { boxShadow: '0 12px 30px -8px rgba(0,0,0,0.55)', '&:before': { opacity: .85 } }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creando...' : 'Crear'}
                    </Button>
                  </Box>
                </form>
              </Box>
            )}
        </Box>
      </Box>
    </MigracionLayout>
  );
}

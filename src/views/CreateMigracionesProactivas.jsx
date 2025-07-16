import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  getDataMigracionesPendientes,
  getDataMigracionesComunas,
  getMigracionUnica,
} from "../api/despachoAPI";

export default function CreateMigracionesProactivas() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [message, setMessage] = useState("");

  const [dataPendiente, setDataPendiente] = useState([]);
  const [dataComuna, setDataComuna] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [comuna, setComuna] = useState({ comuna: "NUNOA" });
  const [migracion, setMigracion] = useState(null);

  const [id_vivienda, setIdVivienda] = useState(null);

  const [form, setForm] = useState({
    id_vivienda: "",
    contacto: "",
    ingreso: "",
    fecha_agenda: "",
    bloque_horario: "",
    comentario: "",
    userID: "",
  });

  const fetchPendientes = async () => {
    setIsSubmitting(true);
    try {
      const response = await getDataMigracionesPendientes(token);
      setDataPendiente(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchComunas = async () => {
    setIsSubmitting(true);
    try {
      const response = await getDataMigracionesComunas(token);
      setDataComuna(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactoOptions = [
    "Sin Factibilidad",
    "Sin contacto",
    "Contactado",
    "Pendiente",
  ];
  const ingresoOptions = [
    "Ingresada",
    "Pendiente Ingreso",
    "Rechazada",
    "Sin Contacto",
    "Sin Factibilidad",
  ];
  const franjasHorarias = ["10:00 - 13:00", "13:00 - 16:00", "16:00 - 19:00"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await getClienteMigracion(comuna, token);
      setMigracion(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPendiente = async (e, id) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await getMigracionUnica(id, token);
      setMigracion(response);
      console.log(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
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
      const response = await createMigracion(form, token);
      fetchPendientes();
      setAlertType("success");
      setMessage("Migración creada exitosamente.");
      setOpen(true);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
      clearForm();
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  useEffect(() => {
    fetchPendientes();
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
    <Box
      sx={{
        paddingTop: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        minHeight: "90vh",
        paddingBottom: "20px",
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{
            width: { lg: "80%", md: "80%", sm: "80%", xs: "90%" },
            marginBottom: 2,
          }}
        >
          {message}
        </Alert>
      )}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: {
            lg: "row",
            md: "column",
            sm: "column",
            xs: "column",
          },
        }}
      >
        {dataPendiente && dataPendiente.length > 0 ? (
          <Box
            sx={{
              width: { lg: "20%", md: "80%", sm: "90%", xs: "90%" },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "96%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {dataPendiente.map((item) => (
                <Box
                  key={item.id_vivienda}
                  onClick={(e) => handleSubmitPendiente(e, item.id_vivienda)}
                  sx={{
                    backgroundColor: "#fff",
                    width: "98%",
                    marginBottom: 1,
                    cursor: "pointer",
                    padding: 1,
                    border: "2px solid #dfdeda",
                    borderRadius: 2,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: "#0b2f6d",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    MIGRACION PENDIENTE
                  </Typography>
                  <Typography
                    key={item.ID_VIVIENDA}
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    {" "}
                    {item.Cliente}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                    }}
                  >
                    {" "}
                    {item.Celular}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                    }}
                  >
                    {" "}
                    {item.COMUNA}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                    }}
                  >
                    {item.bloque_horario}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {item.comentario ? (
                      <>{item.comentario}</>
                    ) : (
                      "Sin Comentario"
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}

        <Box
          sx={{
            width: { lg: "80%", md: "80%", sm: "90%", xs: "90%" },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "98%",
              height: "100%",
              backgroundColor: "#fff",
              marginBottom: 2,
              border: "2px solid #dfdeda",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                padding: 2,
                color: "#0b2f6d",
                textAlign: "left",
                fontWeight: "bold",
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
                variant="contained"
                disabled={isSubmitting}
                onClick={handleSubmit}
                sx={{
                  width: { lg: "30%", md: "30%", sm: "100%", xs: "100%" },
                  borderRadius: 2,
                  backgroundColor: "#0b2f6d",
                  marginBottom: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#fff",
                  }}
                >
                  {isSubmitting ? "Cargando..." : "Cargar Cliente"}
                </Typography>
              </Button>
            </Box>
          </Box>

          {migracion && (
            <Box
              sx={{
                width: "98%",
                height: "100%",
                backgroundColor: "#fff",
                border: "2px solid #dfdeda",
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: 2,
                  textAlign: "left",
                  color: "#0b2f6d",
                  fontWeight: "bold",
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
                <Typography variant="body1">
                  {migracion.Celular ? migracion.Celular : "No disponible"}
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
                  color: "#0b2f6d",
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
                    variant="contained"
                    type="submit"
                    sx={{
                      width: "40%",
                      borderRadius: 2,
                      backgroundColor: "#0b2f6d",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando..." : "Crear"}
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

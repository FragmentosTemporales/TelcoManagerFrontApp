import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createBacklogEstado, getBacklogEstado } from "../api/backlogAPI";
import { getBacklog } from "../api/backlogAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function AgendamientoViewer() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoadingBacklog, setIsLoadingBacklog] = useState(false);
  const [isLoadingBacklogEstado, setIsLoadingBacklogEstado] = useState(false);
  const [dataBacklog, setDataBacklog] = useState(undefined);
  const [dataBacklogEstado, setDataBacklogEstado] = useState(undefined);
  const zonas = [
                        "Calera de Tango",
                        "Cerrillos",
                        "Cerro Navia",
                        "Colina",
                        "Conchali",
                        "El Bosque",
                        "El Monte",
                        "Estacion Central",
                        "Huechuraba",
                        "Independencia",
                        "La Cisterna",
                        "La Florida",
                        "La Granja",
                        "La Reina",
                        "Lampa",
                        "Las Condes",
                        "Lo Barnechea",
                        "Lo Espejo",
                        "Lo Prado",
                        "Macul",
                        "Maipu",
                        "Melipilla",
                        "Nunoa",
                        "Padre Hurtado",
                        "Pedro Aguirre Cerda",
                        "Penaflor",
                        "Penalolen",
                        "Providencia",
                        "Pudahuel",
                        "Puente Alto",
                        "Quilicura",
                        "Quinta Normal",
                        "Recoleta",
                        "Renca",
                        "San Bernardo",
                        "San Joaquin",
                        "San Miguel",
                        "Santiago Centro",
                        "Vitacura"
                      ]

  const [formGetBacklog, setFormGetBacklog] = useState({ zona_de_trabajo: "" });

  const [formBacklog, setFormBacklog] = useState({
    orden: "",
    nueva_cita: "",
    sub_clasificacion: "",
    estado_interno: "",
    comentario: "",
    userID: user_id,
  });

  const SubmitBacklockForm = async (e) => {
    e.preventDefault();
    try {
      const response = await createBacklogEstado(formBacklog, token);
      setAlertType("success");
      setMessage(response.message);
      setOpen(true);
      setFormBacklog({
        orden: "",
        nueva_cita: "",
        sub_clasificacion: "",
        estado_interno: "",
        comentario: "",
        userID: user_id,
      });
      setDataBacklogEstado(undefined);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setDataBacklog(undefined);
  };

  const fetchBacklog = async () => {
    setIsLoadingBacklog(true);
    try {
      const response = await getBacklog(formGetBacklog, token);
      setDataBacklog(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoadingBacklog(false);
  };

  const fetchBacklogEstado = async (orden) => {
    setIsLoadingBacklogEstado(true);
    try {
      const response = await getBacklogEstado(token, orden);
      setDataBacklogEstado(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoadingBacklogEstado(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeGetBacklog = (e) => {
    const { name, value } = e.target;
    setFormGetBacklog((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleChangeBacklog = (e) => {
    const { name, value } = e.target;
    setFormBacklog((prevForm) => ({ ...prevForm, [name]: value }));
  };

  useEffect(() => {
    if (dataBacklog) {
      setFormBacklog((prevForm) => ({
        ...prevForm,
        userID: user_id,
        orden: dataBacklog.orden_de_trabajo,
      }));
      fetchBacklogEstado(dataBacklog.orden_de_trabajo);
    }
  }, [dataBacklog]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        padding: 8,
      }}
    >
      {open && (
        <Alert
          severity={alertType}
          onClose={handleClose}
          sx={{ marginBottom: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* TARJETA DE INFORMACION BACKLOG */}
      <Card
        sx={{
          width: { lg: "80%", md: "100%", xs: "100%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Información cliente</Typography>}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
          }}
        />
        <CardContent sx={{ display: "grid" }}>
          {isLoadingBacklog ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : dataBacklog ? (
            <>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    width: "30%",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="zona_de_trabajo-label">
                      Zona de Trabajo
                    </InputLabel>
                    <Select
                      labelId="zona_de_trabajo-label"
                      id="zona_de_trabajo"
                      name="zona_de_trabajo"
                      value={formGetBacklog?.zona_de_trabajo || ""}
                      onChange={handleChangeGetBacklog}
                    >
                      {zonas.map((zona) => (
                        <MenuItem key={zona} value={zona}>
                          {zona}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  onClick={fetchBacklog}
                  sx={{
                    width: "200px",
                    background: "#0b2f6d",
                    borderRadius: "20px",
                  }}
                >
                  Ver Cliente
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableBody>
                    {[
                      ["Órden de Trabajo", dataBacklog.orden_de_trabajo],
                      ["Nombre", dataBacklog.Cliente],
                      ["Rut", dataBacklog.rut_cliente],
                      ["Celular", dataBacklog.Celular],
                      ["Zona", dataBacklog.zona_de_trabajo],
                      ["Dirección", dataBacklog.direccion],
                      ["Técnico", dataBacklog.tecnico],
                      ["Actividad", dataBacklog.tipo_de_actividad],
                      ["Fecha Agenda", dataBacklog.Fecha],
                      ["Franja", dataBacklog.Franja],
                      ["Código de Cierre", dataBacklog.codigo_de_cierre],
                    ].map(([label, value], index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {label}:
                        </TableCell>
                        <TableCell>
                          {value ? value : "Sin Información"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: "30%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="zona_de_trabajo-label">
                    Zona de Trabajo
                  </InputLabel>
                  <Select
                    labelId="zona_de_trabajo-label"
                    id="zona_de_trabajo"
                    name="zona_de_trabajo"
                    value={formGetBacklog?.zona_de_trabajo || ""}
                    onChange={handleChangeGetBacklog}
                  >
                    {zonas.map(
                      (zona) => (
                        <MenuItem key={zona} value={zona}>
                          {zona}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                onClick={fetchBacklog}
                sx={{
                  width: "200px",
                  background: "#0b2f6d",
                  borderRadius: "20px",
                }}
              >
                Ver Cliente
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* TARJETA PARA VER ESTADOS POR OT */}
      {dataBacklogEstado && dataBacklogEstado.length > 0 ? (
        <Card
          sx={{
            width: { lg: "80%", md: "100%", xs: "100%" },
            borderRadius: "20px",
            boxShadow: 5,
            marginTop: 2,
          }}
        >
          <CardHeader
            title={
              <Typography fontWeight="bold">
                Gestiones por Orden de Trabajo
              </Typography>
            }
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "center",
            }}
          />
          <CardContent sx={{ display: "grid" }}>
            {isLoadingBacklogEstado ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <TableContainer>
                <Table
                  sx={{
                    width: "100%",
                    display: "column",
                    justifyContent: "center",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          background: "#d8d8d8",
                          fontWeight: "bold",
                          width: "15%",
                        }}
                      >
                        ESTADO INTERNO
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          background: "#d8d8d8",
                          fontWeight: "bold",
                          width: "15%",
                        }}
                      >
                        NUEVA FECHA
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          background: "#d8d8d8",
                          fontWeight: "bold",
                          width: "30%",
                        }}
                      >
                        GESTIONADO POR
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          background: "#d8d8d8",
                          fontWeight: "bold",
                          width: "40%",
                        }}
                      >
                        COMENTARIO
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {dataBacklogEstado.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "16px", width: "15%" }} // Equal width
                      >
                        <Typography fontFamily={"initial"} variant="secondary">
                          {row.estado_interno
                            ? row.estado_interno
                            : "Sin Información"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "16px", width: "15%" }} // Equal width
                      >
                        <Typography fontFamily={"initial"} variant="secondary">
                          {row.nueva_cita
                            ? extractDate(row.nueva_cita)
                            : "Sin Información"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "16px", width: "30%" }} // Equal width
                      >
                        <Typography fontFamily={"initial"} variant="secondary">
                          {row.usuario.nombre
                            ? row.usuario.nombre
                            : "Sin Información"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "16px", width: "40%" }} // Equal width
                      >
                        <Typography fontFamily={"initial"} variant="secondary">
                          {row.comentario ? row.comentario : "Sin Información"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* TARJETA DE GESTION BACKLOG */}
      <Card
        sx={{
          width: { lg: "80%", md: "100%", xs: "100%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Gestion de Órdenes</Typography>}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
          }}
        />
        <CardContent sx={{ display: "grid" }}>
          <form onSubmit={SubmitBacklockForm}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: "40%",
                }}
              >
                <InputLabel>Orden de Trabajo</InputLabel>
                <TextField
                  required
                  id="orden"
                  type="text"
                  name="orden"
                  variant="outlined"
                  value={formBacklog.orden}
                  onChange={handleChangeBacklog}
                  sx={{ minWidth: "100%" }}
                />
              </Box>
              <Box
                sx={{
                  mb: 2,
                  width: "40%",
                }}
              >
                <InputLabel>Fecha Cita</InputLabel>
                <TextField
                  id="nueva_cita"
                  type="datetime-local"
                  name="nueva_cita"
                  variant="outlined"
                  value={formBacklog.nueva_cita}
                  onChange={handleChangeBacklog}
                  sx={{ minWidth: "100%" }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: "40%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    required
                    id="estado-interno-select"
                    value={formBacklog.estado_interno || ""}
                    onChange={(event) =>
                      setFormBacklog((prevForm) => ({
                        ...prevForm,
                        estado_interno: event.target.value,
                      }))
                    }
                  >
                    <MenuItem value="Carga otra EPS">Carga otra EPS</MenuItem>
                    <MenuItem value="Efectiva">Efectiva</MenuItem>
                    <MenuItem value="Futura">Futura</MenuItem>
                    <MenuItem value="No Efectiva">No Efectiva</MenuItem>
                    <MenuItem value="Sin Contacto">Sin Contacto</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  mb: 2,
                  width: "40%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Clasificacion</InputLabel>
                  <Select
                    id="sub-clasificacion-select"
                    value={formBacklog.sub_clasificacion || ""}
                    onChange={(event) =>
                      setFormBacklog((prevForm) => ({
                        ...prevForm,
                        sub_clasificacion: event.target.value,
                      }))
                    }
                  >
                    <MenuItem value="Cambia agenda">Cambia agenda</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                    <MenuItem value="Cliente adelanta">
                      Cliente adelanta
                    </MenuItem>
                    <MenuItem value="Cliente desiste">Cliente desiste</MenuItem>
                    <MenuItem value="Cliente mantiene agenda">
                      Cliente mantiene agenda
                    </MenuItem>
                    <MenuItem value="Orden mal generada">
                      Orden mal generada
                    </MenuItem>
                    <MenuItem value="Problema inicio más temprano">
                      Problema inicio más temprano
                    </MenuItem>
                    <MenuItem value="Trabajo ya asignado">
                      Trabajo ya asignado
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: "88%",
                }}
              >
                <InputLabel>Comentarios</InputLabel>
                <TextField
                  required
                  id="comentario"
                  type="text"
                  name="comentario"
                  variant="outlined"
                  value={formBacklog.comentario}
                  onChange={handleChangeBacklog}
                  sx={{ minWidth: "100%" }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "200px",
                  background: "#0b2f6d",
                  borderRadius: "20px",
                }}
              >
                CREAR
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* BOTON PARA VER TODOS LOS AGENDAMIENTOS */}
      <Box
        sx={{
          width: { lg: "80%", md: "100%", xs: "100%" },
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/all_agendamientos">
          <Button
            variant="contained"
            sx={{ width: "200px", background: "#0b2f6d", borderRadius: "20px" }}
          >
            Ver Todas
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
export default AgendamientoViewer;

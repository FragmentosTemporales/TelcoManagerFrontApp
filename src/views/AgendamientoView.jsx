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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const zonas_metropolitana = [
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
    "Vitacura",
  ];

  const zonas_centro = [
    "Algarrobo",
    "Calle Larga",
    "Concon",
    "Curacaví",
    "Hijuelas",
    "La Calera",
    "La Cruz",
    "Limache",
    "Los Andes",
    "Machali",
    "Panquehue",
    "Putaendo",
    "Quillota",
    "Quilpue",
    "Rancagua",
    "Rengo",
    "San Antonio",
    "San Esteban",
    "San Felipe",
    "San Fernando",
    "Santa Maria",
    "Santo Domingo",
    "Valparaiso",
    "Villa Alemana",
    "Vina Del Mar",
  ];

  const [selectedRegion, setSelectedRegion] = useState("");
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
    setIsSubmitting(true);
    const sanitizedOrden = formBacklog.orden.replace(/\s+/g, "").toUpperCase();

    // Validate that 'orden' starts with '1-'
    if (!sanitizedOrden.startsWith("1-")) {
      setAlertType("error");
      setMessage("El campo 'ORDEN DE TRABAJO' debe comenzar con '1-'.");
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      orden: sanitizedOrden,
      nueva_cita: formBacklog.nueva_cita,
      sub_clasificacion: formBacklog.sub_clasificacion,
      estado_interno: formBacklog.estado_interno,
      comentario: formBacklog.comentario,
      userID: user_id,
    };

    try {
      const response = await createBacklogEstado(payload, token);
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
    setIsSubmitting(false);
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

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setFormGetBacklog({ zona_de_trabajo: "" }); // Reset zone selection when region changes
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
        backgroundColor: "#f0f0f0",
        minHeight: "90vh",
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
      {isLoadingBacklog ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            width: { lg: "90%", md: "100%", xs: "100%" },
          }}
        >
          <CircularProgress />
        </Box>
      ) : dataBacklog ? (
        <>
          <Box
            sx={{
              textAlign: "center",
              pt: 4,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { lg: "90%", md: "100%", xs: "100%" },
              backgroundColor: "#fff",
              boxShadow: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                mb: 2,
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Selecciona la Región
              </Typography>
              <ButtonGroup variant="outlined" sx={{ mb: 4 }}>
                <Button
                  onClick={() => handleRegionSelect("metropolitana")}
                  variant={
                    selectedRegion === "metropolitana"
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    width: "200px",
                    backgroundColor:
                      selectedRegion === "metropolitana"
                        ? "#0b2f6d"
                        : "transparent",
                    color:
                      selectedRegion === "metropolitana" ? "white" : "#0b2f6d",
                    "&:hover": {
                      backgroundColor:
                        selectedRegion === "metropolitana"
                          ? "#0b2f6d"
                          : "#f0f0f0",
                    },
                  }}
                >
                  Metropolitana
                </Button>
                <Button
                  onClick={() => handleRegionSelect("centro")}
                  variant={
                    selectedRegion === "centro" ? "contained" : "outlined"
                  }
                  sx={{
                    width: "200px",
                    backgroundColor:
                      selectedRegion === "centro" ? "#0b2f6d" : "transparent",
                    color: selectedRegion === "centro" ? "white" : "#0b2f6d",
                    "&:hover": {
                      backgroundColor:
                        selectedRegion === "centro" ? "#0b2f6d" : "#f0f0f0",
                    },
                  }}
                >
                  Centro
                </Button>
              </ButtonGroup>

              {selectedRegion && (
                <FormControl fullWidth>
                  <InputLabel id="zona_de_trabajo-label">
                    Zona de Trabajo
                  </InputLabel>
                  <Select
                    size="small"
                    variant="standard"
                    labelId="zona_de_trabajo-label"
                    id="zona_de_trabajo"
                    name="zona_de_trabajo"
                    value={formGetBacklog?.zona_de_trabajo || ""}
                    onChange={handleChangeGetBacklog}
                  >
                    {(selectedRegion === "metropolitana"
                      ? zonas_metropolitana
                      : zonas_centro
                    ).map((zona) => (
                      <MenuItem key={zona} value={zona}>
                        {zona}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            <Button
              variant="outlined"
              onClick={fetchBacklog}
              sx={{
                width: "200px",
                borderRadius: "0px",
              }}
            >
              Ver Cliente
            </Button>
          </Box>
          <TableContainer
            sx={{
              width: { lg: "90%", md: "100%", xs: "100%" },
              marginTop: 2,
              boxShadow: 2,
              backgroundColor: "#fff",
            }}
          >
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
                    <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                      {label}:
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>
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
              pt: 4,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { lg: "90%", md: "100%", xs: "100%" },
              backgroundColor: "#fff",
              boxShadow: 2,
              mt: 2,
            }}
          >
          <Box
            sx={{
              mb: 2,
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Selecciona la Región
            </Typography>
            <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
              <Button
                onClick={() => handleRegionSelect("metropolitana")}
                variant={
                  selectedRegion === "metropolitana" ? "contained" : "outlined"
                }
                sx={{
                  width: "200px",
                  backgroundColor:
                    selectedRegion === "metropolitana"
                      ? "#0b2f6d"
                      : "transparent",
                  color:
                    selectedRegion === "metropolitana" ? "white" : "#0b2f6d",
                  "&:hover": {
                    backgroundColor:
                      selectedRegion === "metropolitana"
                        ? "#0b2f6d"
                        : "#f0f0f0",
                  },
                }}
              >
                Metropolitana
              </Button>
              <Button
                onClick={() => handleRegionSelect("centro")}
                variant={selectedRegion === "centro" ? "contained" : "outlined"}
                sx={{
                  width: "200px",
                  backgroundColor:
                    selectedRegion === "centro" ? "#0b2f6d" : "transparent",
                  color: selectedRegion === "centro" ? "white" : "#0b2f6d",
                  "&:hover": {
                    backgroundColor:
                      selectedRegion === "centro" ? "#0b2f6d" : "#f0f0f0",
                  },
                }}
              >
                Centro
              </Button>
            </ButtonGroup>

            {selectedRegion && (
              <FormControl fullWidth>
                <InputLabel id="zona_de_trabajo-label">
                  Zona de Trabajo
                </InputLabel>
                <Select
                  size="small"
                  variant="standard"
                  labelId="zona_de_trabajo-label"
                  id="zona_de_trabajo"
                  name="zona_de_trabajo"
                  value={formGetBacklog?.zona_de_trabajo || ""}
                  onChange={handleChangeGetBacklog}
                >
                  {(selectedRegion === "metropolitana"
                    ? zonas_metropolitana
                    : zonas_centro
                  ).map((zona) => (
                    <MenuItem key={zona} value={zona}>
                      {zona}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          <Button
            variant="outlined"
            onClick={fetchBacklog}
            sx={{
              width: "200px",
              borderRadius: "0px",
            }}
          >
            Ver Cliente
          </Button>
        </Box>
      )}

      {/* TARJETA PARA VER ESTADOS POR OT */}
      {dataBacklogEstado && dataBacklogEstado.length > 0 ? (
        <Card
          sx={{
            width: { lg: "90%", md: "100%", xs: "100%" },
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
          width: { lg: "90%", md: "100%", xs: "100%" },
          boxShadow: 2,
          marginTop: 2,
          pt: 2,
          pb: 2,
        }}
      >
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
                size="small"
                id="orden"
                type="text"
                name="orden"
                variant="standard"
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
                size="small"
                variant="standard"
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
                  size="small"
                  variant="standard"
                  id="estado-interno-select"
                  value={formBacklog.estado_interno || ""}
                  onChange={(event) =>
                    setFormBacklog((prevForm) => ({
                      ...prevForm,
                      estado_interno: event.target.value,
                    }))
                  }
                >
                  <MenuItem value="Sin Contacto">Sin Contacto</MenuItem>
                  <MenuItem value="Adelanta">Adelanta</MenuItem>
                  <MenuItem value="Confirma Visita">Confirma Visita</MenuItem>
                  <MenuItem value="Mantiene Agenda">Mantiene Agenda</MenuItem>
                  <MenuItem value="Desiste">Desiste</MenuItem>
                  <MenuItem value="Orden con Problemas">
                    Orden con Problemas
                  </MenuItem>
                  <MenuItem value="Reagenda">Reagenda</MenuItem>
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
                  disabled
                  size="small"
                  variant="standard"
                  id="sub-clasificacion-select"
                  value={formBacklog.sub_clasificacion || ""}
                  onChange={(event) =>
                    setFormBacklog((prevForm) => ({
                      ...prevForm,
                      sub_clasificacion: event.target.value,
                    }))
                  }
                ></Select>
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
                id="comentario"
                type="text"
                name="comentario"
                size="small"
                multiline
                maxRows={4}
                minRows={4}
                variant="standard"
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
              disabled={isSubmitting}
              sx={{
                width: "200px",
                background: "#0b2f6d",
                borderRadius: "0px",
              }}
            >
              {isSubmitting ? "Cargando..." : "Crear"}{" "}
            </Button>
          </Box>
        </form>
      </Card>

      {/* BOTON PARA VER TODOS LOS AGENDAMIENTOS */}
      <Box
        sx={{
          width: { lg: "90%", md: "100%", xs: "100%" },
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/all_agendamientos">
          <Button
            variant="contained"
            color="error"
            sx={{ width: "200px", borderRadius: "0px" }}
          >
            Ver Todas
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
export default AgendamientoViewer;

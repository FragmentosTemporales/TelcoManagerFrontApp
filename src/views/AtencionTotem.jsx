import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserInfo,
  getNumeros,
  getSiguiente,
  saltarNumero,
  enAtencion,
} from "../api/totemAPI";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { getReversas, updateReversas } from "../api/logisticaAPI";
import { useSelector } from "react-redux";

function AtencionTotem() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [estaciones, setEstaciones] = useState([]);
  const [selectedEstacion, setSelectedEstacion] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const [fila, setFila] = useState([]);

  const [espera, setEspera] = useState([]);
  const [atencion, setAtencion] = useState(undefined);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = atencion.Rut;
    try {
      const response = await getReversas(token, payload);
      setData(response.data.filter((item) => item.entregado !== 1));
      const formatted = response.data.map((item) => ({
        print: item.print !== undefined ? item.print : 1,
        entrega: item.entregado !== undefined ? item.entregado : 1,
        fuente: item.fuente !== undefined ? item.fuente : 1,
        id: item.id,
      }));
      setFormattedData(formatted);
      setIsSubmitting(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderBtn = () => {
    if (data && data.length > 0) {
      return (
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", width: "250px", borderRadius: "10px" }}
            onClick={handleSubmitUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar Reversa"}
          </Button>
        </Box>
      );
    } else {
      return null;
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateReversas(token, formattedData);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
    fetchData();
  };

  const handleCheckboxChange = (id, type) => {
    setFormattedData((prevFormattedData) =>
      prevFormattedData.map((item) =>
        item.id === id ? { ...item, [type]: item[type] === 1 ? 0 : 1 } : item
      )
    );
  };

  const renderTableBody = () => {
    if (data && data.length > 0) {
      return (
        <TableBody>
          {data.map((item) => {
            const formattedItem =
              formattedData.find((i) => i.id === item.id) || {};
            return (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">{item.fecha}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">{item.orden}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">{item.ANI}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">{item.equipo}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">{item.serie}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={formattedItem.entrega === 1}
                    onChange={() => handleCheckboxChange(item.id, "entrega")}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={formattedItem.fuente === 1}
                    onChange={() => handleCheckboxChange(item.id, "fuente")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              <Typography fontFamily="initial">
                No hay datos disponibles
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  const renderTableHeaders = () => (
    <TableHead>
      <TableRow>
        {[
          "FECHA",
          "ORDEN",
          "ANI",
          "EQUIPO",
          "SERIE",
          "ENTREGADO",
          "FUENTE",
        ].map((header) => (
          <TableCell
            key={header}
            align="center"
            sx={{ background: "#d8d8d8", fontWeight: "bold" }}
          >
            <Typography fontFamily="initial">{header}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTable = () => {
    if (loading) {
      return (
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <CircularProgress />
        </CardContent>
      );
    }

    // Corrige el condicional
    if (selectedEstacion && atencion) {
      return (
        <>
          <Card sx={{ borderRadius: "10px" }}>
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  LISTA DE REVERSAS PENDIENTES
                </Typography>
              }
              avatar={<PlaylistRemoveIcon />}
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "end",
              }}
            />
            <TableContainer
              component={Paper}
              sx={{ width: "100%", height: "100%", overflow: "auto" }}
            >
              <Table stickyHeader>
                {renderTableHeaders()}
                {renderTableBody()}
              </Table>
            </TableContainer>
          </Card>
          {renderBtn()}
        </>
      );
    }

    // Retorna null si no hay estación seleccionada
    return null;
  };

  useEffect(() => {
    if (token && atencion) {
      handleSubmit();
    }
  }, [atencion, token]);

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo(token);
      setEstaciones(res);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      const response = await getNumeros();
      const filteredDataEspera = response.filter(
        (item) => item.Estacion_ID === selectedEstacion.EstacionID
      );

      setFila(filteredDataEspera);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const atenderSiguiente = async () => {
    try {
      setIsSubmitting(true);
      const response = await getSiguiente(
        token,
        selectedEstacion.EstacionID,
        selectedEstacion.Modulo
      );
    } catch (error) {
      console.log(error);
    }
    fetchData();
    resetTimer();
  };

  const SaltarNumero = async () => {
    try {
      setIsSubmitting(true);
      const response = await saltarNumero(
        token,
        selectedEstacion.EstacionID,
        selectedEstacion.Modulo
      );
    } catch (error) {
      console.log(error);
    }
    fetchData();
    resetTimer();
  };

  const resetTimer = () => setTime(0);

  const formatTime = () => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getTimerGradient = () => {
    // Cambiar color si supera 7 minutos (420 segundos)
    return time > 419
      ? "linear-gradient(to right, red, darkred)"
      : "linear-gradient(to right, #124fb9, #0b2f6d)";
  };

  useEffect(() => {
    const filteredDataEspera = fila.filter(
      (item) => item.Estado === "En espera"
    );
    setEspera(filteredDataEspera);
  }, [fila]);

  useEffect(() => {
    selectedEstacion ? fetchData() : null;
  }, [selectedEstacion]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    atencion ? setIsRunning(true) : setIsRunning(false);
  }, [atencion]);

  useEffect(() => {
    if (selectedEstacion) {
      const intervalId = setInterval(() => {
        if (!atencion && espera.length == 0) {
          fetchData();
        }
      }, 3000);

      // Limpiar intervalo al desmontar o cambiar dependencia
      return () => clearInterval(intervalId);
    } else {
      // Limpiar cualquier intervalo existente si `selectedEstacion` es falso
      return () => {};
    }
  }, [selectedEstacion, atencion]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    getAtencion();
  }, [fila]);

  const getAtencion = async () => {
    try {
      if (selectedEstacion) {
        const res = await enAtencion(
          token,
          selectedEstacion.EstacionID,
          selectedEstacion.Modulo
        );
        setAtencion(res[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        marginTop: "70px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}
      >
        {!selectedEstacion ? (
          <Card
            sx={{
              width: { xs: "100%", sm: "80%", lg: "70%" },
              height: "100%",
              margin: "10px",
              borderRadius: "10px",
            }}
          >
            <CardHeader
              title={
                <Typography
                  fontWeight="bold"
                  sx={{ fontFamily: "initial", fontSize: "1.5rem" }}
                >
                  SELECCIÓN DE ESTACION
                </Typography>
              }
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "center",
                padding: "8px",
              }}
            />
            <CardContent>
              <Box>
                {estaciones.length > 0 ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{ width: "100%" }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {estaciones.map((estacion, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            minHeight: "200px",
                            maxWidth: "400px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "10px",
                            position: "relative",
                            transition:
                              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-10px)",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                            },
                          }}
                          onClick={() => {
                            setSelectedEstacion(estacion);
                          }}
                        >
                          <CardHeader
                            title={
                              <Typography
                                fontWeight="bold"
                                sx={{ fontFamily: "initial" }}
                              >
                                {estacion.CENTRO}
                              </Typography>
                            }
                            sx={{
                              background: "#0b2f6d",
                              color: "white",
                              textAlign: "center",
                            }}
                          />
                          <CardContent>
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Typography
                                variant="body1"
                                color="text.primary"
                                fontFamily={"initial"}
                              >
                                {estacion.Nombre_Estacion}
                              </Typography>
                            </Box>
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Typography
                                variant="body1"
                                color="text.primary"
                                fontFamily={"initial"}
                              >
                                Módulo #{estacion.Modulo}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay estaciones para seleccionar
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card
            sx={{
              width: { xs: "100%", sm: "80%", lg: "70%" },
              height: "100%",
              margin: "10px",
              borderRadius: "10px",
            }}
          >
            <CardHeader
              title={
                <Typography
                  fontWeight="bold"
                  sx={{ fontFamily: "initial", fontSize: "1.5rem" }}
                >
                  {selectedEstacion.CENTRO} / {selectedEstacion.Nombre_Estacion}
                </Typography>
              }
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "center",
                padding: "8px",
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedEstacion(undefined);
                  }}
                  sx={{
                    borderRadius: "10px",
                    background: "#0b2f6d",
                    width: "150px",
                  }}
                >
                  Volver
                </Button>
              </Box>

              {/* VISTA DE ATENCION */}

              <Paper
                sx={{
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop: "10px",
                  background: "#0b2f6d",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ fontFamily: "initial", fontSize: "1.5rem" }}
                >
                  EN ATENCION
                </Typography>
              </Paper>

              <Paper sx={{ borderRadius: "10px", padding: "10px" }}>
                <Box
                  sx={{
                    minHeight: "100px",
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  {atencion ? (
                    <Box sx={{ padding: "10px", borderRadius: "0px" }}>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontFamily: "initial",
                          fontSize: "2.5rem",
                        }}
                      >
                        {atencion.Numero ? atencion.Numero : "Sin Numero"}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontFamily: "initial",
                          fontSize: "1.2rem",
                        }}
                      >
                        {atencion.nombre ? atencion.nombre : "Sin Nombre"}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontFamily: "initial",
                          fontSize: "1rem",
                        }}
                      >
                        {atencion.Rut ? atencion.Rut : "Sin Rut"}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontFamily: "initial",
                          fontSize: "1rem",
                        }}
                      >
                        {atencion.Nombre_Proceso
                          ? atencion.Nombre_Proceso
                          : "Sin Proceso"}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        fontSize: "1.5rem",
                        minHeight: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Sin Información
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* CONTADOR */}

              <Paper
                sx={{
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: getTimerGradient(),
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    minWidth: "150px",
                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight="bold">{formatTime()}</Typography>
                </Box>
              </Paper>
              {/* COMANDOS */}

              <Paper
                sx={{
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: "10px",
                      width: "150px",
                    }}
                    onClick={SaltarNumero}
                  >
                    {isSubmitting ? "Procesando..." : "Saltar"}
                  </Button>
                  <Button
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      background: "#0b2f6d",
                      color: "white",
                      borderRadius: "10px",
                      width: "150px",
                    }}
                    onClick={atenderSiguiente}
                  >
                    {isSubmitting ? "Procesando..." : "Llamar"}
                  </Button>
                </Box>
              </Paper>

              {/* LISTA DE ESPERA */}

              <Paper
                sx={{
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop: "10px",
                  background: "#0b2f6d",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ fontFamily: "initial", fontSize: "1.5rem" }}
                >
                  EN ESPERA
                </Typography>
              </Paper>

              <Paper sx={{ borderRadius: "10px", padding: "10px" }}>
                <Box
                  sx={{
                    minHeight: "100px",
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  {espera.length > 0 ? (
                    <TableContainer
                      sx={{ width: "100%", height: "100%", overflow: "auto" }}
                    >
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            {["NUMERO", "NOMBRE"].map((header) => (
                              <TableCell
                                key={header}
                                align="center"
                                sx={{
                                  background: "#d8d8d8",
                                  fontWeight: "bold",
                                }}
                              >
                                <Typography fontFamily="initial">
                                  {header}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {espera.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell
                                align="center"
                                sx={{ fontSize: "12px", minHeight: "70px" }}
                              >
                                {item.Numero ? item.Numero : "Sin Numero"}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontSize: "12px", minHeight: "70px" }}
                              >
                                {item.nombre ? item.nombre : "Sin Nombre"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        fontSize: "1.5rem",
                        minHeight: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Sin Información
                    </Typography>
                  )}
                </Box>
              </Paper>
            </CardContent>
          </Card>
        )}
      </Box>
      {token && data.length > 0 ? (
        <Box
          sx={{ width: { xs: "100%", sm: "80%", lg: "70%" }, margin: "10px" }}
        >
          {renderTable()}
        </Box>
      ) : null}
    </Box>
  );
}

export default AtencionTotem;

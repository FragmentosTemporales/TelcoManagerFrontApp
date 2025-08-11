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
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserInfo,
  getNumeros,
  getSiguiente,
  saltarNumero,
  enAtencion,
} from "../api/totemAPI";
import { getReversas, updateReversas } from "../api/logisticaAPI";
import { useSelector } from "react-redux";
import { extractDateOnly } from "../helpers/main";
import { MainLayout } from "./Layout";

function AtencionTotem() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [estaciones, setEstaciones] = useState([]);
  const [selectedEstacion, setSelectedEstacion] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const [fila, setFila] = useState([]);

  const [espera, setEspera] = useState([]);
  const [atencion, setAtencion] = useState(undefined);

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
            sx={{ background: "#142a3d", width: "250px", borderRadius: "10px" }}
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
                  <Typography>{extractDateOnly(item.fecha)}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography>{item.orden}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography>{item.ANI}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography>{item.equipo}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography>{item.serie}</Typography>
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
              <Typography>
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
            sx={{ background: "#142a3d", color: "white" }}
          >
            <Typography fontWeight="bold">{header}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTable = () => {
    // Corrige el condicional
    if (selectedEstacion && atencion) {
      return (
        <Box
          sx={{
            width: "100%",
            borderRadius: 2,
            paddingBottom: 2,
          }}
        >
          <Box sx={{ margin: 2, borderRadius: 2, background: "#fff", border: "2px solid #dfdeda" }}>
            <Typography
              fontWeight="bold"
              variant="h6"
              sx={{
                textAlign: "center",
                padding: "5px",
              }}
            >
              LISTA DE REVERSAS PENDIENTES
            </Typography>
            <Box sx={{ margin: 2 }}>
              <Table stickyHeader>
                {renderTableHeaders()}
                {renderTableBody()}
              </Table>
            </Box>

          </Box>
          {renderBtn()}
        </Box>
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
      console.log("Response:", response);
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
      return () => { };
    }
  }, [selectedEstacion, atencion]);

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
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "white",
          alignItems: "center",
          marginY: "60px",
          backgroundColor: "#f5f5f5",
          minHeight: "90vh",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}
        >
          {!selectedEstacion ? (
            <Box
              sx={{
                width: { xs: "100%", sm: "80%", lg: "70%" },
                height: "100%",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {estaciones.length > 0 ? (
                <Grid
                  container
                  sx={{ width: "100%" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  {estaciones.map((estacion, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          minHeight: "150px",
                          margin: "10px",
                          backgroundColor: "#f5f5f5",
                          border: "2px solid #dfdeda",
                          borderRadius: 2,
                          cursor: "pointer",
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
                        <Typography
                          fontWeight="bold"
                          variant="h6"
                          color="text.primary"
                          sx={{
                            textAlign: "center",
                            paddingTop: 2,
                          }}
                        >
                          {estacion.CENTRO}
                        </Typography>
                        <Divider sx={{ margin: "10px 0" }} />
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {estacion.Nombre_Estacion}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Módulo #{estacion.Modulo}
                        </Typography>
                      </Box>
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
          ) : (
            <Box
              sx={{
                width: { xs: "100%", sm: "100%", lg: "100%" },
                height: "100%",
                margin: "10px",
                borderRadius: 2,
              }}
            >
              <Typography
                fontWeight="bold"
                variant="h6"
                sx={{
                  textAlign: "center",
                  background: "#142a3d",
                  color: "white",
                  margin: 1,
                  padding: 2,
                }}
              >
                {selectedEstacion.Nombre_Estacion}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  padding: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedEstacion(undefined);
                  }}
                  sx={{
                    borderRadius: 2,
                    background: "#142a3d",
                    width: "100%",
                  }}
                >
                  Volver
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { lg: "row", xs: "column" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: { lg: "50%", xs: "100%" },
                    padding: 2,
                    border: "2px solid #dfdeda",
                    height: "100%",
                    margin: 1,
                    borderRadius: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      padding: "5px",
                    }}
                  >
                    EN ATENCION
                  </Typography>
                  <Divider sx={{ margin: "10px 0" }} />
                  <Box
                    sx={{
                      minHeight: "100px",
                      width: "100%",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    {atencion ? (
                      <Box
                        sx={{
                          padding: "10px",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          variant="h3"
                          sx={{ textAlign: "center" }}
                        >
                          {atencion.Numero ? atencion.Numero : "00"}
                        </Typography>
                        <Typography
                          fontWeight="bold"
                          variant="h5"
                          sx={{ textAlign: "center" }}
                        >
                          {atencion.nombre ? atencion.nombre : "Sin Nombre"}
                        </Typography>
                        <Typography
                          fontWeight="bold"
                          variant="h6"
                          sx={{ textAlign: "center" }}
                        >
                          {atencion.Rut ? atencion.Rut : "Sin Rut"}
                        </Typography>
                        <Typography
                          fontWeight="bold"
                          variant="h6"
                          sx={{ textAlign: "center" }}
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
                    <Divider sx={{ margin: "10px 0" }} />
                  </Box>

                  {/* COMANDOS */}

                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        width: "200px",
                      }}
                      onClick={SaltarNumero}
                    >
                      {isSubmitting ? "Procesando..." : "Saltar"}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        background: "#142a3d",
                        color: "white",
                        borderRadius: 2,
                        width: "200px",
                      }}
                      onClick={atenderSiguiente}
                    >
                      {isSubmitting ? "Procesando..." : "Llamar"}
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: { lg: "50%", xs: "100%" },
                    padding: 2,
                    border: "2px solid #dfdeda",
                    height: "100%",
                    margin: 1,
                    borderRadius: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      padding: "5px",
                    }}
                  >
                    EN ESPERA
                  </Typography>
                  <Divider sx={{ margin: "10px 0" }} />
                  <Box sx={{ borderRadius: "10px" }}>
                    <Box
                      sx={{
                        minHeight: "100px",
                        width: "100%",
                        borderRadius: "10px",
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
                                      background: "#142a3d",
                                      fontWeight: "bold",
                                      color: "white",
                                    }}
                                  >
                                    <Typography fontWeight={"bold"}>
                                      {header}
                                    </Typography>
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {espera.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">
                                    <Typography
                                      fontWeight="bold"
                                      sx={{ fontSize: "12px" }}
                                    >
                                      {item.Numero ? item.Numero : "Sin Numero"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      fontWeight="bold"
                                      sx={{ fontSize: "12px" }}
                                    >
                                      {item.nombre ? item.nombre : "Sin Nombre"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography
                          fontWeight="bold"
                          variant="h6"
                          sx={{ textAlign: "center", paddingTop: 2 }}
                        >
                          SIN INFORMACION
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        {data.length > 0 && renderTable()}
      </Box>
    </MainLayout>
  );
}

export default AtencionTotem;

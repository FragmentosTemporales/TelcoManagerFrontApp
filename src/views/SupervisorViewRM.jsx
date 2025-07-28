import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getNumeros,
  darSalida,
  cancelarAtencion,
  getUserInfo,
} from "../api/totemAPI";
import { useSelector } from "react-redux";
import { MainLayout } from "./Layout";

function SupervisorViewRM() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [trabajador, setTrabajador] = useState(undefined);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [openModalSalida, setOpenModalSalida] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      const response = await getNumeros();
      const filteredData = response.filter(
        (item) => item.CENTRO == userData.CENTRO
      );
      setData(filteredData);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo(token);
      setUserData(res[0]);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  function validateSalida(trabajador) {
    if (trabajador) {
      if (trabajador.Estacion_ID === 500 || trabajador.Estacion_ID === 501) {
        return true;
      }
    }
    return false;
  }

  const handleSubmitSalida = async () => {
    try {
      setIsSubmittingModal(true);
      await darSalida(token, trabajador.Rut);
    } catch (error) {
      console.log(error);
    }
    setIsSubmittingModal(false);
    setTrabajador(undefined);
    setData([]);
    handleClose();
    fetchData();
  };

  const handleSubmitCancelar = async () => {
    try {
      setIsSubmittingModal(true);
      await cancelarAtencion(token, trabajador.Rut);
    } catch (error) {
      console.log(error);
    }
    setIsSubmittingModal(false);
    setTrabajador(undefined);
    setData([]);
    handleClose();
    fetchData();
  };

  const handleClose = () => {
    setOpenModalCancelar(false);
    setOpenModalSalida(false);
  };

  const setModalCancelar = () => (
    <>
      <Modal open={openModalCancelar} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "200px",
            width: { lg: "30%", md: "50%", sm: "80%", xs: "80%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ pt: 2 }}
          >
            ¿DESEAS CANCELAR EL NUMERO ASIGNADO?
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0b2f6d" }}
              disabled={isSubmittingModal}
              onClick={handleSubmitCancelar}
            >
              {isSubmittingModal ? "Procesando..." : "Cancelar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalSalida = () => (
    <>
      <Modal open={openModalSalida} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "200px",
            width: { lg: "30%", md: "50%", sm: "80%", xs: "80%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ pt: 2 }}
          >
            ¿DESEAS DARLE SALIDA AL TECNICO SELECCIONADO?
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0b2f6d" }}
              disabled={isSubmittingModal}
              onClick={handleSubmitSalida}
            >
              {isSubmittingModal ? "Procesando..." : "Salida"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  useEffect(() => {
    if (userData) {
      const intervalId = setInterval(() => {
        fetchData();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <MainLayout showNavbar={true}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#f5f5f5",
        alignItems: "center",
        minHeight: "90vh",
        paddingTop: "60px",
      }}
    >
      {openModalCancelar && setModalCancelar()}
      {openModalSalida && setModalSalida()}
      {isSubmitting && data.length == 0 ? (
        <Skeleton
          sx={{
            width: { lg: "50%", md: "70%", sm: "90%", xs: "90%" },
            height: "400px",
          }}
        />
      ) : (
        <Box
          sx={{
            width: { lg: "50%", md: "70%", sm: "90%", xs: "90%" },
            borderRadius: "10px",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          {trabajador ? (
            <Card
              sx={{
                borderRadius: "10px",
              }}
            >
              <CardHeader
                title={
                  <Typography
                    fontWeight="bold"
                    sx={{ fontSize: "1.5rem" }}
                  >
                    TECNICO SELECCIONADO
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "center",
                }}
              />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Nombre:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Rut:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Estación:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Centro:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Proceso:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Estado:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Atendedor:
                    </Typography>{" "}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      Número:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.nombre ? trabajador.nombre : "Sin Nombre"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Rut ? trabajador.Rut : "Sin Rut"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Estacion
                        ? trabajador.Estacion
                        : "Sin Estacion"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.CENTRO ? trabajador.CENTRO : "Sin Centro"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Proceso ? trabajador.Proceso : "Sin Proceso"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Estado ? trabajador.Estado : "Sin Estado"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Atendedor
                        ? trabajador.Atendedor
                        : "Sin Atendedor"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: "1rem",
                        paddingTop: "5px",
                        paddingBot: "5px",
                        height: "50px",
                      }}
                    >
                      {trabajador.Numero ? trabajador.Numero : "Sin Numero"}
                    </Typography>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    marginTop: "50px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ width: "150px", borderRadius: 0 }}
                    onClick={() => setOpenModalCancelar(true)}
                  >
                    CANCELAR
                  </Button>
                  <Button
                    disabled={!validateSalida(trabajador)}
                    variant="contained"
                    color="info"
                    sx={{ width: "150px", borderRadius: 0 }}
                    onClick={() => setOpenModalSalida(true)}
                  >
                    SALIDA
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : null}
          {data.length > 0 ? (
            <Card
              sx={{
                borderRadius: "10px",
                marginY: "20px",
              }}
            >
              <TableContainer
                sx={{ width: "100%", height: "100%", overflow: "auto" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["NOMBRE", "ESTACION", "ACCIONES"].map((header) => (
                        <TableCell
                          key={header}
                          align="center"
                          sx={{
                            background: "#0b2f6d",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          <Typography>{header}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "12px", minHeight: "70px" }}
                        >
                          {item.nombre ? item.nombre : "Sin Nombre"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "12px", minHeight: "70px" }}
                        >
                          {item.Estacion ? item.Estacion : "Sin Estacion"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "12px", minHeight: "70px" }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              background: "#0b2f6d",
                              color: "white",
                              borderRadius: "10px",
                            }}
                            onClick={() => {
                              setTrabajador(item);
                              window.scrollTo(0, 0);
                            }}
                          >
                            SELECCIONAR
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          ) : (
            <Typography
              fontWeight="bold"
              variant="h4"
              sx={{
                alignItems: "center",
              }}
            >
              Sin Información
            </Typography>
          )}
        </Box>
      )}
    </Box>
    </MainLayout>
  );
}

export default SupervisorViewRM;

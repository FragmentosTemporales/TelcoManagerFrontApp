import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Skeleton,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
  Typography,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUniqueSolicitud } from "../api/solicitudAPI";
import { createNotificacion } from "../api/notificacionesAPI";
import extractDate from "../helpers/main";
import { createSG } from "../api/sgAPI";
import {
  estadoData2,
  estadoData3,
  estadoData4,
  estadoData7,
  estadoData8,
} from "../data/estadoData";
import userData from "../data/userData";
import RrhhViewer from "../components/rrhhFormViewer";
import PrevencionViewer from "../components/prevencionFormViewer";
import CalidadViewer from "../components/calidadFormViewer";
import OperacionesViewer from "../components/operacionesFormViewer";
import LogisticaViewer from "../components/logisticaFormViewer";
import FlotaViewer from "../components/flotaFormViewer";

function Solicitud() {
  const { solicitud_id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const [data, setData] = useState(null);
  const [dataGestiones, setDataGestiones] = useState(null);
  const [dataForm, setDataForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(false);
  const [message, setMessage] = useState("");
  const [logID, setLogID] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    logID: logID,
    solicitudEstadoID: "",
  });

  const [notificacion, setNotificacion] = useState({
    nav_path: "",
    descri: "",
    userID: "",
  });

  const title = `SOLICITUD DE AMONESTACIÓN N° ${solicitud_id}`;
  const tableTitle = `REGISTRO DE GESTIONES`;

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data && data !== null) {
      setNotificacion({
        nav_path: `/solicitud/${solicitud_id}`,
        descri: `Tienes una nueva actualización para la amonestación con folio N° ${solicitud_id}`,
        userID: "",
      });
    }
  }, [data]);

  useEffect(()=>{
    console.log(notificacion)
  },[notificacion])

  const fetchData = async () => {
    try {
      const res = await getUniqueSolicitud(token, solicitud_id);
      setData(res);
      setDataGestiones(res.gestiones);
      setDataForm(res.form);
      setLogID(res.logID);
      setIsLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      setMessage("Error al cargar la información");
      setOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { logID, solicitudEstadoID } = form;
    const { nav_path, descri, userID } = notificacion;
    try {
      const response = await createSG({ logID, solicitudEstadoID }, token);
      const notifRes = await createNotificacion({ nav_path, descri, userID}, token)
      console.log(notifRes)
      setMessage(response.message);
      setOpen(true);
      fetchData();
    } catch (error) {
      setMessage("Error al crear la gestión.");
      setOpen(true);
    }
  };

  const setDataOptions = () => {
    if (dataGestiones[0] && dataGestiones[0].estado) {
      switch (dataGestiones[0].estado) {
        case "ENVIADA A RRHH":
          const transformedOptions = estadoData2.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions);
          break;

        case "EVALUACION LEGAL":
          const transformedOptions2 = estadoData3.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions2);
          break;

        case "PENDIENTE FIRMA EMPLEADOR":
          const transformedOptions3 = estadoData4.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions3);
          break;

        case "LICENCIA MEDICA":
          const transformedOptions4 = estadoData7.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions4);
          break;

        case "VACACIONES":
          const transformedOptions5 = estadoData7.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions5);
          break;

        case "PENDIENTE FIRMA TRABAJADOR":
          const transformedOptions6 = estadoData7.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions6);
          break;

        case "SOLICITUD DE ANULACION":
          const transformedOptions7 = estadoData8.map((item) => ({
            value: item.solicitudEstadoID,
            label: item.descri,
          }));
          setOptions(transformedOptions7);
          break;

        default:
          console.log("Estado no reconocido");
          break;
      }
    } else {
      console.log("No hay estado disponible en dataGestiones[0]");
    }
  };

  const setFormViewer = () => {
    if (data?.form !== "None") {
      switch (data.areaID) {
        case 1:
          return <PrevencionViewer data={data.form} />;
        case 2:
          return <CalidadViewer data={data.form} />;
        case 3:
          return <OperacionesViewer data={data.form} />;
        case 4:
          return <LogisticaViewer data={data.form} />;
        case 5:
          return <RrhhViewer data={data.form} />;
        case 6:
          return <FlotaViewer data={data.form} />;
        default:
          console.log("Formulario no reconocido");
      }
    } else {
      console.log("No hay Formulario para mostrar");
    }
  };

  useEffect(() => {
    fetchData();
  }, [solicitud_id]);

  useEffect(() => {
    if (logID !== undefined) {
      setForm((prevForm) => ({
        ...prevForm,
        logID: logID,
      }));
    }
  }, [logID]);

  useEffect(() => {
    const transformedOptions = userData.map((item) => ({
      value: item.userID,
      label: item.nombre,
    }));
    setUsers(transformedOptions);
  }, []);

  useEffect(() => {
    if (dataGestiones && dataGestiones.length > 0) {
      setDataOptions();
    }
  }, [dataGestiones]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        overflow: "auto",
        padding: 8,
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ mb: 3, width: "90%" }}
        >
          {message}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={"800px"}
            height={"70%"}
            sx={{ p: 3, m: 3 }}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "90%",
              maxWidth: "800px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              borderRadius: "0",
              mt: 3,
            }}
          >
            <Link to="/solicitudes">
              <Button variant="contained" sx={{ background: "#0b2f6d" }}>
                Ir a Solicitudes
              </Button>
            </Link>
          </Box>
          <Card
            sx={{
              width: "90%",
              maxWidth: "800px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              boxShadow: 5,
              borderRadius: "0",
              mt: 3,
            }}
          >
            <CardHeader
              title={title}
              sx={{
                backgroundColor: "#0b2f6d",
                color: "white",
                padding: "16px",
                borderBottom: "1px solid #ddd",
                textAlign: "center",
              }}
            />

            <CardContent sx={{ p: 4 }}>
              {[
                { label: "FECHA SOLICITUD :", value: data.fechaSolicitud },
                { label: "SOLICITANTE :", value: data.solicitante },
                { label: "RUT SOLICITANTE :", value: data.rutSolicitante },
                { label: "TIPO FORMULARIO :", value: data.area },
                { label: "MOTIVO AMONESTACION :", value: data.motivo },
                { label: "SUBMOTIVO :", value: data.submotivo },
                { label: "FUNCIONARIO A AMONESTAR :", value: data.amonestado },
                {
                  label: "RUT FUNCIONARIO A AMONESTAR :",
                  value: data.rutAmonestado,
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ color: "text.secondary", pl: 1 }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </CardContent>

            <CardHeader
              title="DETALLES"
              sx={{
                backgroundColor: "#0b2f6d",
                color: "white",
                padding: "16px",
                borderBottom: "1px solid #ddd",
                textAlign: "center",
              }}
            />

            <CardContent sx={{ p: 4 }}>
              {dataForm !== false && dataForm !== null ? (
                setFormViewer()
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ color: "text.secondary", pb: 6 }}
                  >
                    Sin información
                  </Typography>
                  <Link to={`/${data.area}/${data.logID}`}>
                    <Button variant="contained" sx={{ background: "#0b2f6d" }}>
                      Crear Formulario
                    </Button>
                  </Link>
                </Box>
              )}
            </CardContent>

            <CardHeader
              title={tableTitle}
              sx={{
                backgroundColor: "#0b2f6d",
                color: "white",
                padding: "16px",
                borderBottom: "1px solid #ddd",
                textAlign: "center",
              }}
            />
            <CardContent>
              <TableContainer
                component={Paper}
                sx={{ width: "100%", height: "100%" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                        align="center"
                      >
                        FECHA
                      </TableCell>
                      <TableCell
                        sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                        align="center"
                      >
                        ESTADO
                      </TableCell>
                      <TableCell
                        sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                        align="center"
                      >
                        GESTIONADO POR
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataGestiones && dataGestiones.length > 0 ? (
                      dataGestiones.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {extractDate(row.fecha)}
                          </TableCell>
                          <TableCell align="center">{row.estado}</TableCell>
                          <TableCell align="center">
                            {row.responsable}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Sin gestiones registradas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            <CardHeader
              title="AGREGAR GESTION"
              sx={{
                backgroundColor: "#0b2f6d",
                color: "white",
                padding: "16px",
                borderBottom: "1px solid #ddd",
                textAlign: "center",
              }}
            />
            <CardContent>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <FormControl variant="filled">
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                      required
                      labelId="estado-label"
                      id="estado-select"
                      sx={{ width: "350px" }}
                      value={form.solicitudEstadoID || ""}
                      onChange={(event) => {
                        setForm((prevForm) => ({
                          ...prevForm,
                          solicitudEstadoID: event.target.value,
                        }));
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <FormControl variant="filled">
                    <InputLabel id="user-label">Notificar a</InputLabel>
                    <Select
                      required
                      labelId="user-label"
                      id="user-select"
                      sx={{ width: "350px" }}
                      value={notificacion.userID || ""}
                      onChange={(event) => {
                        setNotificacion((prevForm) => ({
                          ...prevForm,
                          userID: event.target.value,
                        }));
                      }}
                    >
                      {users.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Procesando..." : "Crear"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}

export default Solicitud;

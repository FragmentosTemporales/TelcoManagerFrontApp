import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel ,
  MenuItem ,
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
import extractDate from "../helpers/main";
import { getSolicitudEstado } from "../api/seAPI";
import { createSG } from "../api/sgAPI";

function Solicitud() {
  const { solicitud_id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const [data, setData] = useState(null);
  const [dataGestiones, setDataGestiones] = useState(null);
  const [dataForm, setDataForm] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [logID, setLogID] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    logID: logID,
    solicitudEstadoID: "",
  });

  const title = `SOLICITUD DE AMONESTACIÓN N° ${solicitud_id}`;
  const tableTitle = `REGISTRO DE GESTIONES`;

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      const res = await getUniqueSolicitud(token, solicitud_id);
      setData(res);
      setDataGestiones(res.gestiones);
      setDataForm(res.form);
      setLogID(res.logID);
      setIsLoading(false);
    } catch (error) {
      setMessage("Error al cargar la información");
      setOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { logID, solicitudEstadoID } = form;
    try {
      const response = await createSG({ logID, solicitudEstadoID }, token);
      setMessage(response.message);
      setOpen(true);
      fetchData();
    } catch (error) {
      setMessage("Error al crear la gestión.");
      setOpen(true);
    }
  };

  const fetchOptions = async () => {
    try {
      const res = await getSolicitudEstado(token);
      const transformedOptions = res.map((item) => ({
        value: item.solicitudEstadoID,
        label: item.descri,
      }));
      setOptions(transformedOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [token]);

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
                Object.keys(dataForm || {}).map((key, index) => (
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
                      {key}:
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{ color: "text.secondary", pl: 1 }}
                    >
                      {dataForm[key]}
                    </Typography>
                  </Box>
                ))
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
                <Box sx={{ mb: 2, display:'flex', justifyContent:'center'}}>
                  <FormControl  variant="filled" >
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                      labelId="estado-label"
                      id="estado-select"
                      sx={{width:'350px'}}
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
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ background: "#0b2f6d" }}
                  >
                    Crear
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

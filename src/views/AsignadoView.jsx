import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Chip,
  Grid,
  InputLabel,
  Paper,
  Skeleton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import AddIcon from "@mui/icons-material/Add";
import { getProyectoUnico, createComponentList } from "../api/proyectoAPI";
import { useNavigate } from "react-router-dom";

function Asignado() {
  const { proyectoID } = useParams();
  const proyectoState = useSelector((state) => state.proyectos);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const { data } = proyectoState;
  const navigate = useNavigate();
  const [dataEmpresa, setDataEmpresa] = useState(undefined);
  const [dataEstado, setDataEstado] = useState(undefined);
  const [dataComponentes, setDataComponentes] = useState(undefined);
  const [proyecto, setProyecto] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);

  const [ctoForm, setCtoForm] = useState(undefined);
  const [cdpiForm, setCdpiForm] = useState(undefined);
  const [cdpeForm, setCdpeForm] = useState(undefined);
  const [mduForm, setMduForm] = useState(undefined);
  const [mufaForm, setMufaForm] = useState(undefined);
  const [ctoData, setCtoData] = useState([]);
  const [cdpiData, setCdpiData] = useState([]);
  const [cdpeData, setCdpeData] = useState([]);
  const [mduData, setMduData] = useState([]);
  const [mufaData, setMufaData] = useState([]);
  const [id, setId] = useState(undefined);

  const fetchData = async () => {
    try {
      const res = await getProyectoUnico(token, proyectoID);
      setDataEmpresa(res.empresa);
      setDataEstado(res.estado);
      setDataComponentes(res.componente);
      setId(res.proyectoID);
      setIsLoading(false);
    } catch (error) {
      setMessage(error);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (data && id) {
      const p = data.find((item) => item.proyecto === id);
      setProyecto(p);
    }
  }, [data, id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const combinedData = [
      ...ctoData,
      ...cdpiData,
      ...cdpeData,
      ...mduData,
      ...mufaData,
    ];

    try {
      const res = await createComponentList(combinedData, token);
      setIsSubmitting(false);
      navigate("/success");
    } catch (error) {
      setMessage(error);
      setOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleChangeCTO = (e, index) => {
    const updatedCtoData = [...ctoData];
    updatedCtoData[index] = {
      ...updatedCtoData[index],
      [e.target.name]: e.target.value,
      ["tipoComponenteID"]: 1,
      ["proyectoID"]: proyectoID,
    };
    setCtoData(updatedCtoData);
  };

  const handleChangeCDPI = (e, index) => {
    const updatedCdpiData = [...cdpiData];
    updatedCdpiData[index] = {
      ...updatedCdpiData[index],
      [e.target.name]: e.target.value,
      ["tipoComponenteID"]: 2,
      ["proyectoID"]: proyectoID,
    };
    setCdpiData(updatedCdpiData);
  };

  const handleChangeCDPE = (e, index) => {
    const updatedCdpeData = [...cdpeData];
    updatedCdpeData[index] = {
      ...updatedCdpeData[index],
      [e.target.name]: e.target.value,
      ["tipoComponenteID"]: 3,
      ["proyectoID"]: proyectoID,
    };
    setCdpeData(updatedCdpeData);
  };

  const handleChangeMUFA = (e, index) => {
    const updatedMufaData = [...mufaData];
    updatedMufaData[index] = {
      ...updatedMufaData[index],
      [e.target.name]: e.target.value,
      ["tipoComponenteID"]: 5,
      ["proyectoID"]: proyectoID,
    };
    setMufaData(updatedMufaData);
  };

  const handleChangeMDU = (e, index) => {
    const updatedMduData = [...mduData];
    updatedMduData[index] = {
      ...updatedMduData[index],
      [e.target.name]: e.target.value,
      ["tipoComponenteID"]: 4,
      ["proyectoID"]: proyectoID,
    };
    setMduData(updatedMduData);
  };

  const handleChangeCtoValue = (e) => {
    setCtoForm(e.target.value);
  };

  const handleChangeCdpiValue = (e) => {
    setCdpiForm(e.target.value);
  };

  const handleChangeCdpeValue = (e) => {
    setCdpeForm(e.target.value);
  };

  const handleChangeMduValue = (e) => {
    setMduForm(e.target.value);
  };

  const handleChangeMufaValue = (e) => {
    setMufaForm(e.target.value);
  };

  const proyectoCard = () => (
    <Box sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
      {proyecto ? (
        <Paper sx={{ width: "100%", textAlign: "start" }}>
          <Grid container spacing={2}>
            {/* REGION */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                REGION :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto.region ? proyecto.region : "Sin Información"}
              </Typography>
            </Grid>

            {/* COMUNA */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                COMUNA :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto.comuna ? proyecto.comuna : "Sin Información"}
              </Typography>
            </Grid>

            {/* DIRECCION */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                DIRECCION :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto.direccion ? proyecto.direccion : "Sin Información"}
              </Typography>
            </Grid>

            {/* TARGET RTS */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                TARGET RTS :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto["Target RTS"]
                  ? proyecto["Target RTS"]
                  : "Sin Información"}
              </Typography>
            </Grid>

            {/* FUENTE */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                FUENTE :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto["Fuente"] ? proyecto["Fuente"] : "Sin Información"}
              </Typography>
            </Grid>

            {/* ORIGEN */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                ORIGEN :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto["Origen"] ? proyecto["Origen"] : "Sin Información"}
              </Typography>
            </Grid>

            {/* FACILIDADES */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                FACILIDADES :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto["uip"] ? proyecto["uip"] : "Sin Información"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                }}
              >
                TIPO :
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1 }}>
                {proyecto["Tipo"] ? proyecto["Tipo"] : "Sin Información"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            Proyecto sin Información
          </Typography>
        </Box>
      )}
    </Box>
  );

  const contenedorCard = () => (
    <Card
      sx={{
        width: "90%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "0px",
        mt: 2,
        mb: 2,
      }}
    >
      <CardHeader
        avatar={<FormatAlignJustifyIcon />}
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            PROYECTO ASIGNADO CON ID #{proyectoID}
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      <CardContent>
        <Paper>
          {[
            { label: "NOMBRE EMPRESA :", value: dataEmpresa.nombre },
            { label: "RUT EMPRESA :", value: dataEmpresa.rut },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontFamily: "initial",
                  width: "30%",
                  background: "#e8e8e8",
                  p: 1,
                  textAlign: "start",
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "initial",
                  color: "text.secondary",
                  width: "70%",
                  p: 1,
                }}
              >
                {item.value || "Sin Información"}
              </Typography>
            </Box>
          ))}
        </Paper>
        {proyectoCard()}
      </CardContent>
    </Card>
  );

  const setValuesCard = () => {
    if (dataEstado && dataEstado.proyectoEstadoID == 2) {
      return (
        <Card
          sx={{
            width: "90%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            textAlign: "center",
            borderRadius: "0px",
            mt: 2,
            mb: 2,
          }}
        >
          <CardHeader
            avatar={<AddIcon />}
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                ASIGNANDO VALORES PARA PROYECTO #{proyectoID}
              </Typography>
            }
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Sección de Formulario */}
            <Grid container spacing={2}>
              {[
                {
                  label: "CTO",
                  id: "cto",
                  value: ctoForm,
                  onChange: handleChangeCtoValue,
                },
                {
                  label: "CDPI",
                  id: "cdpi",
                  value: cdpiForm,
                  onChange: handleChangeCdpiValue,
                },
                {
                  label: "CDPE",
                  id: "cdpe",
                  value: cdpeForm,
                  onChange: handleChangeCdpeValue,
                },
                {
                  label: "MDU",
                  id: "mdu",
                  value: mduForm,
                  onChange: handleChangeMduValue,
                },
                {
                  label: "MUFA",
                  id: "mufa",
                  value: mufaForm,
                  onChange: handleChangeMufaValue,
                },
              ].map((field) => (
                <Grid
                  key={field.id}
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mb: 2, width: "600px" }}>
                    <InputLabel
                      id={`${field.id}-label`}
                      sx={{ fontFamily: "initial" }}
                    >
                      {field.label}
                    </InputLabel>
                    <TextField
                      sx={{ background: "white" }}
                      fullWidth
                      required
                      id={field.id}
                      type="number"
                      name={field.id}
                      variant="outlined"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setCtoCard = () => {
    const textFields = [];
    for (let i = 0; i < ctoForm; i++) {
      textFields.push(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            alignItems: "center",
          }}
        >
          <InputLabel>CTO # </InputLabel>
          <TextField
            required
            key={i}
            label={`Referencia ${i + 1}`}
            variant="outlined"
            name="referencia"
            sx={{ width: "300px" }}
            value={ctoData[i]?.referencia || ""}
            onChange={(e) => handleChangeCTO(e, i)}
          />
        </Box>
      );
    }

    return (
      <>
        {ctoForm > 0 ? (
          <Box sx={{ width: "60%" }}>
            <Card>
              <CardHeader
                avatar={<FormatAlignJustifyIcon />}
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    DEFINIENDO REFERENCIAS PARA CTO
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "end",
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }}
                >
                  {textFields}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : null}
      </>
    );
  };

  const setCdpiCard = () => {
    const textFields = [];
    for (let i = 0; i < cdpiForm; i++) {
      textFields.push(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            alignItems: "center",
          }}
        >
          <InputLabel>CDPI # </InputLabel>
          <TextField
            key={i}
            required
            label={`Referencia ${i + 1}`}
            variant="outlined"
            name="referencia"
            sx={{ marginBottom: 2, width: "300px" }}
            value={cdpiData[i]?.referencia || ""}
            onChange={(e) => handleChangeCDPI(e, i)}
          />
        </Box>
      );
    }

    return (
      <>
        {cdpiForm > 0 ? (
          <Box sx={{ width: "60%" }}>
            <Card>
              <CardHeader
                avatar={<FormatAlignJustifyIcon />}
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    DEFINIENDO REFERENCIAS PARA CDPI
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "end",
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }}
                >
                  {textFields}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : null}
      </>
    );
  };

  const setCdpeCard = () => {
    const textFields = [];
    for (let i = 0; i < cdpeForm; i++) {
      textFields.push(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            alignItems: "center",
          }}
        >
          <InputLabel>CDPE # </InputLabel>
          <TextField
            required
            key={i}
            label={`Referencia ${i + 1}`}
            variant="outlined"
            name="referencia"
            sx={{ marginBottom: 2, width: "300px" }}
            value={cdpeData[i]?.referencia || ""}
            onChange={(e) => handleChangeCDPE(e, i)}
          />
        </Box>
      );
    }

    return (
      <>
        {cdpiForm > 0 ? (
          <Box sx={{ width: "60%" }}>
            <Card>
              <CardHeader
                avatar={<FormatAlignJustifyIcon />}
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    DEFINIENDO REFERENCIAS PARA CDPE
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "end",
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }}
                >
                  {textFields}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : null}
      </>
    );
  };

  const setMufaCard = () => {
    const textFields = [];
    for (let i = 0; i < mufaForm; i++) {
      textFields.push(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            alignItems: "center",
          }}
        >
          <InputLabel>MUFA # </InputLabel>
          <TextField
            required
            key={i}
            label={`Referencia ${i + 1}`}
            variant="outlined"
            name="referencia"
            sx={{ marginBottom: 2, width: "300px" }}
            value={mufaData[i]?.referencia || ""}
            onChange={(e) => handleChangeMUFA(e, i)}
          />
        </Box>
      );
    }

    return (
      <>
        {mufaForm > 0 ? (
          <Box sx={{ width: "60%" }}>
            <Card>
              <CardHeader
                avatar={<FormatAlignJustifyIcon />}
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    DEFINIENDO REFERENCIAS PARA MUFA
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "end",
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }}
                >
                  {textFields}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : null}
      </>
    );
  };

  const setMduCard = () => {
    const textFields = [];
    for (let i = 0; i < mduForm; i++) {
      textFields.push(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            alignItems: "center",
          }}
        >
          <InputLabel>MDU # </InputLabel>
          <TextField
            required
            key={i}
            label={`Referencia ${i + 1}`}
            variant="outlined"
            name="referencia"
            sx={{ marginBottom: 2, width: "300px" }}
            value={mduData[i]?.referencia || ""}
            onChange={(e) => handleChangeMDU(e, i)}
          />
        </Box>
      );
    }

    return (
      <>
        {mduForm > 0 ? (
          <Box sx={{ width: "60%" }}>
            <Card>
              <CardHeader
                avatar={<FormatAlignJustifyIcon />}
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    DEFINIENDO REFERENCIAS PARA MDU
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "end",
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }}
                >
                  {textFields}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : null}
      </>
    );
  };

  const componenteTable = () => (
    <>
      <Card
        sx={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
          mb: 2,
        }}
      >
        <CardHeader
          avatar={<AddIcon />}
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              MODIFICANDO ASIGNACIONES PARA PROYECTO #{proyectoID}
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
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
                  {["TIPO", "REFERENCIA N°", "RECURSOS", "IR"].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataComponentes && data.length > 0 ? (
                  dataComponentes.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {row.componentetipo.descri
                          ? row.componentetipo.descri
                          : "Sin Información"}
                      </TableCell>
                      <TableCell align="center">
                        {row.referencia ? row.referencia : "Sin Información"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            row.recurso
                              ? row.recurso.length + " " + "Recursos Agregados"
                              : "Sin Información"
                          }
                          color={
                            !row.recurso
                              ? "default" // Por si no hay información
                              : row.recurso.length >= 1 &&
                                row.recurso.length <= 3
                              ? "primary" // Color para longitud entre 1 y 3
                              : row.recurso.length >= 4 &&
                                row.recurso.length <= 6
                              ? "warning" // Color para longitud entre 4 y 6
                              : row.recurso.length >= 7 &&
                                row.recurso.length <= 8
                              ? "success" // Color para longitud entre 7 y 8
                              : "error" // Cualquier otro caso
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modificar">
                          <Link to={`/componente-asignado/${row.componenteID}`}>
                            <Button
                              variant="contained"
                              sx={{
                                width: 30,
                                height: 30,
                                minWidth: 30,
                                padding: 0,
                                background: "#0b2f6d",
                              }}
                            >
                              <AccountTreeIcon />
                            </Button>
                          </Link>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
          padding: 8,
        }}
      >
        {open && (
          <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
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
            <Box sx={{ width: "90%" }}>
              <Link to="/asignados">
                <Button
                  variant="contained"
                  sx={{
                    width: 200,
                    height: 40,
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-around",
                    background: "#0b2f6d",
                    borderRadius: "0px",
                  }}
                >
                  Volver a Asignados
                </Button>
              </Link>
            </Box>

            {contenedorCard()}
            {setValuesCard()}
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {setCtoCard()}
                {setCdpiCard()}
                {setCdpeCard()}
                {setMduCard()}
                {setMufaCard()}
                {dataEstado && dataEstado.proyectoEstadoID == 2 ? (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        mt: 1,
                        background: "#0b2f6d",
                        borderRadius: "0px",
                      }}
                    >
                      <Typography sx={{ fontFamily: "initial" }}>
                        {isSubmitting ? "Procesando..." : "Enviar"}
                      </Typography>
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </form>
            {dataEstado && dataEstado.proyectoEstadoID == 3
              ? componenteTable()
              : null}
          </>
        )}
      </Box>
    </>
  );
}
export default Asignado;

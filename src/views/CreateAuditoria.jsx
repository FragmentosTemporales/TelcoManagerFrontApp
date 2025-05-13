import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { createAuditoria, getAuditorias } from "../api/calidadAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";

function CreateAuditoria() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const toggleCreate = () => {
    setShowCreate((prev) => !prev);
  };

  const handlePage = (newPage) => setPage(newPage);

  const [form, setForm] = useState({
    orden: "",
    auditoria: "",
    cobertura_wifi: "",
    n_tecnico: "",
    streaming_activos: "",
    control_deco: "",
    canales_activos: "",
    conectado_wifi: "",
    atencion_value: "",
    fechaCierre: "",
    observacion: "",
  });

  const SubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const sanitizedOrden = form.orden.replace(/\s+/g, "").toUpperCase();

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
      userID: user_id,
      auditoria: form.auditoria,
      cobertura_wifi: form.cobertura_wifi,
      n_tecnico: form.n_tecnico,
      streaming_activos: form.streaming_activos,
      control_deco: form.control_deco,
      canales_activos: form.canales_activos,
      conectado_wifi: form.conectado_wifi,
      atencion_value: form.atencion_value,
      fechaCierre: form.fechaCierre,
      observacion: form.observacion,
    };

    try {
      const response = await createAuditoria(payload, token);
      setAlertType("success");
      setMessage(response.message);
      setOpen(true);
      fetchData();
    } catch (error) {
      setMessage(error);
      setAlertType("error");
      setOpen(true);
    }
    setForm({
      orden: "",
      auditoria: "",
      cobertura_wifi: "",
      n_tecnico: "",
      streaming_activos: "",
      control_deco: "",
      canales_activos: "",
      conectado_wifi: "",
      atencion_value: "",
      fechaCierre: "",
      observacion: "",
    });
    setIsSubmitting(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAuditorias(token, page);
      setData(response.data);
      setPages(response.pages);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "auditoria" && value === "SIN CONTACTO") {
      setForm({
        orden: form.orden,
        auditoria: "SIN CONTACTO",
        cobertura_wifi: "SIN CONTACTO",
        n_tecnico: "SIN CONTACTO",
        streaming_activos: "SIN CONTACTO",
        control_deco: "SIN CONTACTO",
        canales_activos: "SIN CONTACTO",
        conectado_wifi: "SIN CONTACTO",
        atencion_value: "SIN CONTACTO",
        fechaCierre: form.fechaCierre,
        observacion: form.observacion,
      });
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const setTable = () => (
    <>
      <TableContainer>
        <Table
          sx={{ width: "100%", display: "column", justifyContent: "center" }}
        >
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["FECHA CREACION", "ORDEN", "RESULTADO", "FECHA CIERRE"].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#d8d8d8",
                fontWeight: "bold",
                width: "25%",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBody = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
        }}
      >
        {data && data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "25%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaRegistro
                    ? extractDate(row.fechaRegistro)
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "25%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.orden ? row.orden : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "25%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.auditoria ? row.auditoria : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "25%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaCierre ? row.fechaCierre : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const getButtons = () => (
    <>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={{ background: "#0b2f6d" }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={{ background: "#0b2f6d" }}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{ background: "#0b2f6d" }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  useEffect(() => {
    fetchData();
  }, [page]);

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
          severity={alertType}
          onClose={handleClose}
          sx={{ marginBottom: 3 }}
        >
          {message}
        </Alert>
      )}

      <Card
        sx={{
          width: { lg: "80%", md: "60%", xs: "80%" },
          borderRadius: "20px",
          boxShadow: 5,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Crear Auditoría</Typography>}
          avatar={<AddCircleOutlineIcon />}
          action={
            <Button
              onClick={toggleCreate}
              sx={{ color: "white", minWidth: "auto" }}
            >
              {showCreate ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
          }}
        />
        {showCreate && (
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form onSubmit={SubmitForm} style={{ width: "100%" }}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="orden-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  Orden de Trabajo
                </InputLabel>
                <TextField
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  size="small"
                  required
                  id="orden"
                  type="text"
                  name="orden"
                  variant="outlined"
                  value={form.orden}
                  onChange={handleChange}
                  inputProps={{ maxLength: 15 }}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="fechaCierre-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  Fecha Cierre Órden de Trabajo
                </InputLabel>
                <TextField
                  required
                  size="small"
                  id="fechaCierre"
                  type="date"
                  name="fechaCierre"
                  variant="outlined"
                  value={form.fechaCierre}
                  onChange={handleChange}
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  inputProps={{
                    min: new Date(new Date().getTime() - 4 * 60 * 60 * 1000)
                      .toISOString()
                      .slice(0, 16),
                  }}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="auditoria-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  Resultado de la Auditoría
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  size="small"
                  required
                  id="auditoria"
                  name="auditoria"
                  variant="outlined"
                  value={form.auditoria}
                  onChange={handleChange}
                  fontFamily="initial"
                >
                  <MenuItem value="CUMPLE" sx={{ fontFamily: "initial" }}>
                    CUMPLE
                  </MenuItem>
                  <MenuItem value="CUMPLE CON OBSERVACIONES" sx={{ fontFamily: "initial" }}>
                    CUMPLE CON OBSERVACIONES
                  </MenuItem>
                  <MenuItem value="NO CUMPLE" sx={{ fontFamily: "initial" }}>
                    NO CUMPLE
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="cobertura-wifi-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Tiene usted buena cobertura de la señal de Wifi?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="cobertura_wifi"
                  name="cobertura_wifi"
                  variant="outlined"
                  value={form.cobertura_wifi}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO SABE" sx={{ fontFamily: "initial" }}>
                    NO SABE
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="streaming-activos-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Ocupa plataformas de Streaming?, si es así, ¿Están activas?,
                  ¿Le indicaron cómo activarlas?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="streaming_activos"
                  name="streaming_activos"
                  variant="outlined"
                  value={form.streaming_activos}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem
                    value="AUN NO PRUEBO"
                    sx={{ fontFamily: "initial" }}
                  >
                    AUN NO PRUEBO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="control-deco-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Dejó identificado qué control corresponde a qué
                  decodificador?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="control_deco"
                  name="control_deco"
                  variant="outlined"
                  value={form.control_deco}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="canales-activos-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Los canales solicitados se encuentran instalados y
                  funcionando?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="canales_activos"
                  name="canales_activos"
                  variant="outlined"
                  value={form.canales_activos}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="conectado-wifi-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Usa algún artefacto conectado a la red Wifi?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="conectado_wifi"
                  name="conectado_wifi"
                  variant="outlined"
                  value={form.conectado_wifi}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="n_tecnico-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿El técnico dejó su número telefónico para la garantía?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="n_tecnico"
                  name="n_tecnico"
                  variant="outlined"
                  value={form.n_tecnico}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO SABE" sx={{ fontFamily: "initial" }}>
                    NO SABE
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="atencion-value-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Cómo le pareció la atención entregada por el técnico?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  required
                  size="small"
                  id="atencion_value"
                  name="atencion_value"
                  variant="outlined"
                  value={form.atencion_value}
                  onChange={handleChange}
                  fontFamily="initial"
                  disabled={form.auditoria === "SIN CONTACTO"}
                >
                  <MenuItem value="EXCELENTE" sx={{ fontFamily: "initial" }}>
                    EXCELENTE
                  </MenuItem>
                  <MenuItem value="MUY BUENA" sx={{ fontFamily: "initial" }}>
                    MUY BUENA
                  </MenuItem>
                  <MenuItem value="BUENA" sx={{ fontFamily: "initial" }}>
                    BUENA
                  </MenuItem>
                  <MenuItem value="REGULAR" sx={{ fontFamily: "initial" }}>
                    REGULAR
                  </MenuItem>
                  <MenuItem value="MALA" sx={{ fontFamily: "initial" }}>
                    MALA
                  </MenuItem>
                  <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                    SIN CONTACTO
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel id="declaracion-label">Observación</InputLabel>
                <TextField
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                  size="small"
                  id="observacion"
                  type="text"
                  name="observacion"
                  variant="outlined"
                  value={form.observacion}
                  onChange={handleChange}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    background: "#0b2f6d",
                    height: 30,
                    width: "20%",
                    borderRadius: "20px",
                  }}
                >
                  {isSubmitting ? "Cargando..." : "Crear"}{" "}
                </Button>
              </Box>
            </form>
          </CardContent>
        )}
      </Card>

      <Card
        sx={{
          width: { lg: "80%", md: "60%", xs: "80%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Mis Auditorías</Typography>}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
          }}
        />
        <CardContent sx={{ display: "grid" }}>
          {isLoading ? (
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
            setTable()
          )}
        </CardContent>
      </Card>
      <ButtonGroup
        size="small"
        aria-label="pagination-button-group"
        sx={{ p: 2 }}
      >
        {getButtons()}
      </ButtonGroup>
    </Box>
  );
}
export default CreateAuditoria;

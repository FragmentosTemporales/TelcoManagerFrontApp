import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createAuditoria,
  getConsolidadoOt,
} from "../api/calidadAPI";
import { useSelector } from "react-redux";

function CreateAuditoria() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoadingCompilado, setIsLoadingCompilado] = useState(false);
  const [dataCompilada, setDataCompilada] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    tecnico: "",
    numDoc: "",
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
      tecnico: form.tecnico,
      numDoc: form.numDoc,
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
    } catch (error) {
      setMessage(error);
      setAlertType("error");
      setOpen(true);
    }
    setForm({
      orden: "",
      tecnico: "",
      numDoc: "",
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

  const fetchDataConsolidada = async () => {
    setIsLoadingCompilado(true);
    try {
      const response = await getConsolidadoOt(token);
      console.log(response);
      setDataCompilada(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoadingCompilado(false);
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

  useEffect(() => {
    fetchDataConsolidada();
  }, []);


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
        background: "#f5f5f5",
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
      {isLoadingCompilado ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            width: "90%",
            background: "#ffffff",
            pt: 4,
            mt: 4,
            boxShadow: 2,
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                1.- Órden de Trabajo
              </Typography>
              <Autocomplete
                fullWidth
                variant="standard"
                size="small"
                options={dataCompilada}
                getOptionLabel={(option) => option.orden}
                value={
                  dataCompilada &&
                  dataCompilada.find(
                    (option) => option.orden === form.orden
                  ) !== undefined
                    ? dataCompilada.find(
                        (option) => option.orden === form.orden
                      )
                    : null
                }
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    orden: newValue ? newValue.orden : "",
                    tecnico: newValue ? newValue.Nombre : "",
                    numDoc: newValue ? newValue.Rut : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    required
                    sx={{
                      fontFamily: "initial",
                      whiteSpace: "normal",
                      width: { lg: "70%", xs: "100%", md: "100%" },
                      textAlign: "center",
                      background: "#ffffff",
                    }}
                  />
                )}
                sx={{
                  fontFamily: "initial",
                  whiteSpace: "normal",
                  width: "100%",
                  textAlign: "center",
                  background: "#ffffff",
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                2.- Técnico
              </Typography>
              <TextField
                sx={{
                  fontFamily: "initial",
                  whiteSpace: "normal",
                  width: { lg: "70%", xs: "100%", md: "100%" },
                  textAlign: "center",
                  background: "#ffffff",
                }}
                size="small"
                id="tecnico"
                type="text"
                name="tecnico"
                variant="standard"
                value={form.tecnico}
                disabled
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                3.- Rut del Técnico
              </Typography>
              <TextField
                sx={{
                  fontFamily: "initial",
                  whiteSpace: "normal",
                  width: { lg: "70%", xs: "100%", md: "100%" },
                  textAlign: "center",
                  background: "#ffffff",
                }}
                size="small"
                id="numDoc"
                type="text"
                name="numDoc"
                variant="standard"
                value={form.numDoc}
                disabled
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                4.- Fecha de Cierre
              </Typography>
              <TextField
                required
                size="small"
                id="fechaCierre"
                type="date"
                name="fechaCierre"
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                5.- Resultado de la Auditoría
              </Typography>

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
                variant="standard"
                value={form.auditoria}
                onChange={handleChange}
              >
                <MenuItem value="CUMPLE" sx={{ fontFamily: "initial" }}>
                  CUMPLE
                </MenuItem>
                <MenuItem
                  value="CUMPLE CON OBSERVACIONES"
                  sx={{ fontFamily: "initial" }}
                >
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
                pt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                6.- ¿Tiene usted buena cobertura de la señal de Wifi?
              </Typography>
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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                7.- ¿Ocupa plataformas de Streaming?, si es así, ¿Están activas?,
                ¿Le indicaron cómo activarlas?
              </Typography>

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
                variant="standard"
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
                <MenuItem value="AUN NO PRUEBO" sx={{ fontFamily: "initial" }}>
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                8.- ¿Dejó identificado qué control corresponde a qué decodificador?
              </Typography>
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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                9.- ¿Los canales solicitados se encuentran instalados y funcionando?
              </Typography>
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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                10.- ¿Usa algún artefacto conectado a la red Wifi?
              </Typography>

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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                11.- ¿El técnico dejó su número telefónico para la garantía?
              </Typography>
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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                12.- ¿Cómo le pareció la atención entregada por el técnico?
              </Typography>
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
                variant="standard"
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
              <Typography
                variant="secondary"
                fontStyle={"italic"}
                sx={{
                  width: "70%",
                  alignContent: "start",
                  p: 1,
                }}
              >
                13.- Observación
              </Typography>
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
                variant="standard"
                multiline
                minRows={2}
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
                  borderRadius: "0px",
                }}
              >
                {isSubmitting ? "Cargando..." : "Crear"}
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
}
export default CreateAuditoria;

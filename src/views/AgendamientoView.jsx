import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
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
  Divider,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { createBacklogEstado, getBacklogEstado } from "../api/backlogAPI";
import { getBacklog } from "../api/backlogAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

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

  // Theming helpers
  const gradient = palette.bgGradient;
  const glass = {
    position: "relative",
    background: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.80) 100%)`,
    backdropFilter: "blur(14px)",
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: 3,
    boxShadow: "0 8px 28px -4px rgba(0,0,0,0.25)",
    overflow: "hidden",
    '::before': {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
      pointerEvents: "none",
      mixBlendMode: "overlay",
    },
  };
  const headCell = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: ".4px",
    whiteSpace: "nowrap",
  };
  const primaryBtn = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 2,
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    "&:hover": { background: palette.primaryDark },
  };

  const isFechaRequired = useMemo(() => {
    return ["Adelanta", "Mantiene Agenda", "Reagenda"].includes(
      formBacklog?.estado_interno || ""
    );
  }, [formBacklog?.estado_interno]);

  const RegionZoneSelector = () => (
    <Card sx={{ ...glass, width: "100%" }}>
      <CardHeader
        titleTypographyProps={{ fontSize: 18, fontWeight: "bold" }}
        title="Selección de Región y Zona"
        sx={{
          background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
          color: '#fff',
          textAlign: 'center',
          py: 1.5,
        }}
      />
      <CardContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', minWidth: 260, gap: 1, alignSelf: 'center' }}>
          <Button
            onClick={() => handleRegionSelect('metropolitana')}
            variant={selectedRegion === 'metropolitana' ? 'contained' : 'outlined'}
            sx={{
              ...((selectedRegion === 'metropolitana') ? primaryBtn : { borderColor: palette.primary, color: palette.primary, fontWeight: 'bold' }),
              width: '100%'
            }}
          >
            Metropolitana
          </Button>
          <Button
            onClick={() => handleRegionSelect('centro')}
            variant={selectedRegion === 'centro' ? 'contained' : 'outlined'}
            sx={{
              ...((selectedRegion === 'centro') ? primaryBtn : { borderColor: palette.primary, color: palette.primary, fontWeight: 'bold' }),
              width: '100%'
            }}
          >
            Centro
          </Button>
        </Box>
        {selectedRegion && (
          <FormControl variant="standard" sx={{ mb: 2, width: '50%', minWidth: 260, alignSelf: 'center' }}>
            <InputLabel id="zona_de_trabajo-label">Zona de Trabajo</InputLabel>
            <Select
              size="small"
              variant="standard"
              labelId="zona_de_trabajo-label"
              id="zona_de_trabajo"
              name="zona_de_trabajo"
              value={formGetBacklog?.zona_de_trabajo || ""}
              onChange={handleChangeGetBacklog}
            >
              {(selectedRegion === "metropolitana" ? zonas_metropolitana : zonas_centro).map((zona) => (
                <MenuItem key={zona} value={zona}>
                  {zona}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box sx={{ textAlign: 'center', width: '50%', alignSelf: 'center' }}>
          <Button
            variant="contained"
            onClick={fetchBacklog}
            disabled={!formGetBacklog.zona_de_trabajo || isLoadingBacklog}
            sx={{ ...primaryBtn, width: '100%', minWidth: 180 }}
          >
            {isLoadingBacklog ? "Cargando..." : "Ver Cliente"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const SubmitBacklockForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  const sanitizedOrden = (formBacklog.orden || "").replace(/\s+/g, "").toUpperCase();

    // Validate that 'orden' starts with '1-'
    if (!sanitizedOrden.startsWith("1-")) {
      setAlertType("error");
      setMessage("El campo 'ORDEN DE TRABAJO' debe comenzar con '1-'.");
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    // If fecha is required for the selected estado_interno, ensure it's present
    if (isFechaRequired && !formBacklog.nueva_cita) {
      setAlertType("error");
      setMessage("La Fecha de Cita es obligatoria para el estado seleccionado.");
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          py: 6,
          px: { xs: 1.5, sm: 3 },
          minHeight: "90vh",
          width: "100%",
          background: gradient,
          position: "relative",
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 65%)",
            pointerEvents: "none",
          },
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1350, mx: "auto" }}>
          <ModuleHeader
            title="Agendamientos"
            subtitle="Gestión y seguimiento de órdenes agendadas"
            divider
          />
          {open && (
            <Alert
              severity={alertType}
              onClose={handleClose}
              sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}
            >
              {message}
            </Alert>
          )}

          {/* Region / Zona Selector */}
          <RegionZoneSelector />

          {/* Backlog Info */}
          {dataBacklog && (
            <Card sx={{ mt: 3, ...glass }}>
              <CardHeader
                titleTypographyProps={{ fontSize: 18, fontWeight: 'bold' }}
                title="Información del Cliente"
                action={
                  <Chip size="small" color="primary" label={dataBacklog?.tipo_de_actividad || 'Actividad'} sx={{ fontWeight: 'bold' }} />
                }
                sx={{ background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`, color: '#fff', py: 1.2 }}
              />
              <CardContent sx={{ pt: 2 }}>
                <TableContainer>
                  <Table size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {[
                        ["Orden de Trabajo", dataBacklog.orden_de_trabajo],
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
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(240,245,250,0.5)' }}>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%', fontSize: 13 }}>{label}:</TableCell>
                          <TableCell sx={{ width: '70%', fontSize: 13 }}>{value || 'Sin Información'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Linear progress while loading main backlog */}
          {isLoadingBacklog && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {/* Estados por OT */}
          {dataBacklogEstado && dataBacklogEstado.length > 0 && (
            <Card sx={{ mt: 3, ...glass }}>
              <CardHeader
                titleTypographyProps={{ fontSize: 18, fontWeight: 'bold' }}
                title="Gestiones por Orden de Trabajo"
                subheader={`${dataBacklogEstado.length} gestiones registradas`}
                subheaderTypographyProps={{ sx: { color: 'rgba(255,255,255,0.92)', fontSize: 12 } }}
                sx={{ background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`, color: '#fff', py: 1.2 }}
              />
              <CardContent sx={{ pt: 2 }}>
                {isLoadingBacklogEstado ? (
                  <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: 140, borderRadius: 2 }} />
                ) : (
                  <TableContainer sx={{ maxHeight: 320, '::-webkit-scrollbar': { width: 6 }, '::-webkit-scrollbar-thumb': { background: palette.primaryDark, borderRadius: 3 } }}>
                    <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', borderCollapse: 'separate' }}>
                      <TableHead>
                        <TableRow>
                          {["ESTADO INTERNO", "NUEVA FECHA", "GESTIONADO POR", "COMENTARIO"].map(h => (
                            <TableCell key={h} align="center" sx={headCell}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataBacklogEstado.map((row, i) => (
                          <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(240,245,250,0.5)' }}>
                            <TableCell align="center" sx={{ fontSize: 12 }}>
                              {row.estado_interno || 'Sin Información'}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 12 }}>
                              {row.nueva_cita ? extractDate(row.nueva_cita) : 'Sin Información'}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 12 }}>
                              {row.usuario?.nombre || 'Sin Información'}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 12 }}>
                              {row.comentario || 'Sin Información'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gestión Backlog */}
          <Card sx={{ mt: 3, ...glass }}>
            <CardHeader
              title="Gestión de Backlog"
              titleTypographyProps={{ fontSize: 18, fontWeight: 'bold' }}
              sx={{ background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`, color: '#fff', py: 1.2, textAlign: 'center' }}
            />
            <CardContent>
              <form onSubmit={SubmitBacklockForm}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                  <Box sx={{ width: '50%', minWidth: 260 }}>
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
                      onBlur={() =>
                        setFormBacklog((p) => ({
                          ...p,
                          orden: p.orden.replace(/\s+/g, "").toUpperCase(),
                        }))
                      }
                      sx={{ width: '100%' }}
                      helperText={formBacklog.orden && !formBacklog.orden.startsWith('1-') ? 'Debe comenzar con 1-' : ' '}
                    />
                  </Box>
                  <Box sx={{ width: '50%', minWidth: 260 }}>
                    <InputLabel>Fecha Cita</InputLabel>
                    <TextField
                      required={isFechaRequired}
                      id="nueva_cita"
                      type="datetime-local"
                      name="nueva_cita"
                      size="small"
                      variant="standard"
                      value={formBacklog.nueva_cita}
                      onChange={handleChangeBacklog}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                  <Box sx={{ width: '50%', minWidth: 260 }}>
                    <FormControl variant="standard" sx={{ width: '100%' }}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        required
                        size="small"
                        id="estado-interno-select"
                        value={formBacklog.estado_interno || ''}
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
                        <MenuItem value="Orden con Problemas">Orden con Problemas</MenuItem>
                        <MenuItem value="Reagenda">Reagenda</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '50%', minWidth: 260 }}>
                    <FormControl variant="standard" sx={{ width: '100%' }}>
                      <InputLabel>Clasificación</InputLabel>
                      <Select
                        disabled
                        size="small"
                        id="sub-clasificacion-select"
                        value={formBacklog.sub_clasificacion || ''}
                        onChange={(event) =>
                          setFormBacklog((prevForm) => ({
                            ...prevForm,
                            sub_clasificacion: event.target.value,
                          }))
                        }
                      ></Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '50%', minWidth: 260 }}>
                    <InputLabel>Comentarios</InputLabel>
                    <TextField
                      id="comentario"
                      type="text"
                      name="comentario"
                      size="small"
                      multiline
                      maxRows={6}
                      minRows={4}
                      variant="standard"
                      value={formBacklog.comentario}
                      onChange={handleChangeBacklog}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '50%', minWidth: 260, mx: 'auto' }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ ...primaryBtn, width: '100%', minWidth: 200 }}>
                    {isSubmitting ? 'Cargando...' : 'Crear'}
                  </Button>
                  {dataBacklog && (
                    <Button variant="outlined" color="primary" disabled={isSubmitting} onClick={() => setDataBacklog(undefined)} sx={{ borderRadius: 2, fontWeight: 'bold', width: '100%', minWidth: 160 }}>
                      Limpiar
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>

          {/* Link to all agendamientos */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Link to="/all_agendamientos">
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: 200, borderRadius: 2, fontWeight: "bold" }}
              >
                Ver Todas
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
export default AgendamientoViewer;

import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Fade,
  Paper,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateTicketEstado, getTicketInfo } from "../api/ticketeraAPI";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";
import confetti from "canvas-confetti";
import palette from "../theme/palette";

function TicketViewer() {
  const authState = useSelector((state) => state.auth);
  const { logID } = useParams();
  const { area } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState(undefined);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formUpdate, setFormUpdate] = useState({
    logID: "",
    comentario: "",
    estado: "",
  });

  const [respaldo, setRespaldo] = useState(null);

  const optionSelect = [
    { value: 2, label: "EN GESTION" },
    { value: 3, label: "FINALIZADO" },
    { value: 4, label: "NO APLICA" },
    { value: 5, label: "DERIVADO A TI" },
  ];

  const fetchFile = async (filePath) => {
    try {
      setLoading(true);
  const res = await fetchFileUrl({ file_path: filePath });
      setRespaldo(res);
    } catch (error) {
      console.error("Error al obtener la URL del archivo:", error);
    }
    setLoading(false);
  };

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedDateTime;
  };

  const triggerConfetti = () => {
    // Confeti desde la izquierda
    confetti({
      particleCount: 150,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      gravity: 1.5,
      shapes: ["star"],
      colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
    });

    // Confeti desde la derecha
    confetti({
      particleCount: 150,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      gravity: 1.5,
      shapes: ["star"],
      colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
    });

    // Confeti desde el centro superior
    confetti({
      particleCount: 200,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0 },
      gravity: 1.2,
      shapes: ["star", "circle"],
      colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
    });

    // Confeti adicional desde esquinas
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 45,
        spread: 60,
        origin: { x: 0.2, y: 0.3 },
        gravity: 1.8,
        colors: ["#FFE400", "#FFBD00", "#E89611", "#FFCA28"],
      });

      confetti({
        particleCount: 100,
        angle: 135,
        spread: 60,
        origin: { x: 0.8, y: 0.3 },
        gravity: 1.8,
        colors: ["#FFE400", "#FFBD00", "#E89611", "#FFCA28"],
      });
    }, 200);
  };

  const LabelRow = ({ label, children }) => (
    <Box sx={{
      width: '95%',
      display: 'flex',
      flexDirection: { lg: 'row', md: 'column', xs: 'column' },
      mb: 1.5,
      pl: { xs: 1.5, sm: 2, lg: 2.5 },   // indent general
      pr: { xs: 1, lg: 1.5 },
      gap: { lg: 2, xs: 0.5 },           // espacio entre label y valor en layout stacked
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          width: { lg: '22%', md: '100%', xs: '100%' },
          fontWeight: 600,
          color: palette.primaryDark,
          letterSpacing: .45,
          pr: { lg: 3, xs: 0 },          // separación extra cuando es horizontal
          mb: { lg: 0, md: 0.25, xs: 0.25 }
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          width: { lg: '78%', md: '100%', xs: '100%' },
          color: palette.primaryDark,
          lineHeight: 1.45,
          position: 'relative',
          '&:before': {
            content: '""',
            display: { lg: 'none', xs: 'block' }, // marcador sutil en móviles
            position: 'absolute',
            left: -8,
            top: 8,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: palette.accent
          }
        }}
      >
        {children}
      </Typography>
    </Box>
  );

  const TicketPreview = () => (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          width: '95%',
          mt: 2,
          mb: 1.5,
          letterSpacing: .8,
          color: palette.primary,
          textShadow: '0 2px 4px rgba(0,0,0,0.15)'
        }}
      >
        Detalles del Ticket
      </Typography>
      <Divider sx={{ width: '95%', mb: 2, borderColor: palette.borderSubtle }} />
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        <LabelRow label="CATEGORÍA:">{data.categoria || 'No disponible'}</LabelRow>
        <LabelRow label="TÍTULO:">{data.titulo || 'No disponible'}</LabelRow>
        <LabelRow label="DESCRIPCIÓN:">{data.descripcion || 'No disponible'}</LabelRow>
        <LabelRow label="SOLICITANTE:">{data.solicitante || 'No disponible'}</LabelRow>
        <LabelRow label="PRIORIDAD:">{data.prioridad ? <Rating readOnly value={data.prioridad} max={3} /> : 'No disponible'}</LabelRow>
        <LabelRow label="CREACIÓN:">{data.fecha_solicitud ? extractDate(data.fecha_solicitud) : 'No disponible'}</LabelRow>
        <LabelRow label="ESTADO:">{data.estado ? <Chip size="small" label={data.estado} sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: .5, bgcolor: palette.accent, color: palette.primaryDark }} /> : 'No disponible'}</LabelRow>
        <LabelRow label="COMENTARIOS:">{data.comentario || 'No disponible'}</LabelRow>
        <LabelRow label="IMAGEN:">
          {respaldo && !loading ? (
            <Tooltip title="Ver imagen" placement="top">
              <a href={respaldo} target="_blank" rel="noopener noreferrer">
                <img
                  src={respaldo}
                  alt="Imagen del ticket"
                  style={{ maxHeight: 260, maxWidth: 400, cursor: 'pointer', borderRadius: 8, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)' }}
                />
              </a>
            </Tooltip>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 100 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            'Sin documento'
          )}
        </LabelRow>
      </Stack>
    </>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
  const response = await updateTicketEstado(formUpdate);
      setAlertType("success");
      {
        formUpdate.estado == 3 ? triggerConfetti() : null;
      }
      setMessage(response.message || "Estado del ticket actualizado");
      setOpen(true);
      setFormUpdate({ logID: logID, estado: "", comentario: "" });
      fetchTicket();
    } catch (error) {
      console.error(error);
      setMessage(error || "Error al crear el ticket");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const fetchTicket = async () => {
    setIsSubmitting(true);
    try {
  const ticket = await getTicketInfo(logID);
      setData(ticket);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchTicket();
  }, [logID]);

  useEffect(() => {
    if (data && data.file && data.file !== "None") {
      fetchFile(data.file);
    }
  }, [data]);

  useEffect(() => {
    setFormUpdate({
      logID: logID,
      estado: "",
    });
  }, [logID]);

  return (
    <Box
      sx={{
        position: 'relative',
        pt: 10,
        pb: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: palette.bgGradient,
        minHeight: '90vh',
        overflow: 'hidden',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 18% 25%, rgba(255,255,255,0.09), transparent 60%), radial-gradient(circle at 82% 70%, rgba(255,255,255,0.07), transparent 65%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "80%",
        }}
      >
        <Box
          component={Link}
          to={
            area && area.areaID == 7
              ? "/modulo:gestion-ticketera"
              : "/modulo:ticketera"
          }
          sx={{ textDecoration: "none", with: "100%" }}
        >
          <Button
            variant="contained"
            sx={{
              width: "200px",
              mb: 2,
              background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
              color: '#fff',
              transition: 'all .35s',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
              },
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
              },
              '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
              '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
            }}
          >
            VOLVER
          </Button>
        </Box>
      </Box>
      {open && (
        <Fade in={open}>
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{ width: "80%", mb: 2, boxShadow: '0 6px 16px -4px rgba(0,0,0,0.3)' }}
          >
            {message}
          </Alert>
        </Fade>
      )}
      {isSubmitting ? (
        <Box
          sx={{
            background: 'rgba(255,255,255,0.92)',
            height: '30vh',
            width: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            border: `1px solid ${palette.borderSubtle}`,
            borderRadius: 3,
            boxShadow: '0 10px 28px -8px rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px) saturate(160%)'
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 4, color: "#142a3d" }}>
            Cargando los recursos...
          </Typography>
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          elevation={12}
          sx={{
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: 4,
            pt: 1,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 3,
            border: `1px solid ${palette.borderSubtle}`,
            backdropFilter: 'blur(6px) saturate(160%)',
            boxShadow: '0 10px 28px -6px rgba(0,0,0,0.40)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
              pointerEvents: 'none'
            }
          }}
        >
          {TicketPreview()}
        </Paper>
      )}
      {area && area.areaID == 7 && (
        <Paper
          elevation={10}
          sx={{
            width: '80%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mt: 3,
            mb: 5,
            background: 'rgba(255,255,255,0.94)',
            borderRadius: 3,
            border: `1px solid ${palette.borderSubtle}`,
            backdropFilter: 'blur(6px) saturate(160%)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, mt: 2, width: '95%', letterSpacing: .7, color: palette.primary }}>
              Gestionar Ticket
            </Typography>
            <Divider sx={{ width: '95%', mb: 2, borderColor: palette.borderSubtle }} />
            <Box
              sx={{
                width: "95%",
                display: "flex",
                flexDirection: { lg: "column", md: "column", xs: "column" },
                marginBottom: 4,
              }}
            >
              <Select
                value={formUpdate.estado}
                onChange={(e) =>
                  setFormUpdate({ ...formUpdate, estado: e.target.value })
                }
                size="small"
                variant="standard"
                sx={{
                  width: { lg: "40%", md: "90%", xs: "90%" },
                  marginBottom: 2,
                  background: palette.accentSoft,
                  px: 1,
                  borderRadius: 1,
                  boxShadow: 'inset 0 0 0 1px ' + palette.borderSubtle,
                  '&:before, &:after': { borderBottomColor: palette.primaryDark + ' !important' },
                  '&:hover': { background: '#f0faff' }
                }}
              >
                {optionSelect.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Comentarios"
                value={formUpdate.comentario}
                onChange={(e) =>
                  setFormUpdate({ ...formUpdate, comentario: e.target.value })
                }
                size="small"
                variant="standard"
                inputProps={{ maxLength: 499 }}
                sx={{
                  width: { lg: "90%", md: "90%", xs: "90%" },
                  marginBottom: 2,
                  background: 'rgba(255,255,255,0.6)',
                  px: 1,
                  borderRadius: 1,
                  boxShadow: 'inset 0 0 0 1px ' + palette.borderSubtle,
                  '& .MuiInputBase-root': { fontSize: '0.85rem' }
                }}
                multiline
                rows={4}
              />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={() => {
                    handleUpdate();
                  }}
                  sx={{
                    background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: .6,
                    width: { lg: "40%", md: "90%", xs: "90%" },
                    borderRadius: 2.5,
                    textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    boxShadow: '0 6px 16px -4px rgba(0,0,0,0.45)',
                    transition: 'all .35s',
                    '&:hover': { background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)` },
                    '&:active': { transform: 'translateY(2px)' }
                  }}
                >
                  {isSubmitting ? "Cargando..." : "ACTUALIZAR ESTADO"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default TicketViewer;

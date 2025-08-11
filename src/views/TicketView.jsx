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
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateTicketEstado, getTicketInfo } from "../api/ticketeraAPI";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";
import confetti from "canvas-confetti";

function TicketViewer() {
  const authState = useSelector((state) => state.auth);
  const { logID } = useParams();
  const { token, area } = authState;
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
      const res = await fetchFileUrl({ file_path: filePath }, token);
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

  const TicketPreview = () => (
    <>
      <>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            marginBottom: 2,
            marginTop: 2,
            justifyContent: "start",
            width: "95%",
            color: "#142a3d",
          }}
        >
          DETALLES
        </Typography>
        <Divider sx={{ width: "95%", marginBottom: 2 }} />
      </>
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          CATEGORIA :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.categoria ? data.categoria : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          TITULO :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.titulo ? data.titulo : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          DESCRIPCION :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.descripcion ? data.descripcion : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          SOLICITANTE :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.solicitante ? data.solicitante : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          PRIORIDAD :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.prioridad ? (
            <Rating readOnly value={data.prioridad} max={3} />
          ) : (
            "No disponible"
          )}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          CREACION :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.fecha_solicitud
            ? extractDate(data.fecha_solicitud)
            : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          ESTADO :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.estado ? data.estado : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          COMENTARIOS :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.comentario ? data.comentario : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: { lg: "row", md: "column", xs: "column" },
        }}
      >
        <Typography
          variant="h7"
          fontWeight="bold"
          sx={{ width: { lg: "20%", md: "100%", xs: "100%" } }}
        >
          IMAGEN :
        </Typography>{" "}
        <Typography variant="h7" sx={{ width: "80%" }}>
          {respaldo && !loading ? (
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              <Tooltip title="Ver imagen" placement="top">
                <a href={respaldo} target="_blank" rel="noopener noreferrer">
                  <img
                    src={respaldo}
                    alt="Imagen del ticket"
                    style={{
                      maxHeight: "400px",
                      maxWidth: "450px",
                      cursor: "pointer",
                    }}
                  />
                </a>
              </Tooltip>
            </Typography>
          ) : loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="h7" sx={{ width: "80%" }}>
              Sin documento
            </Typography>
          )}
        </Typography>
      </Box>
    </>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const response = await updateTicketEstado(formUpdate, token);
      setAlertType("success");
      {
        formUpdate.estado == 3 ? triggerConfetti() : null;
      }
      setMessage(response.message || "Estado del ticket actualizado");
      setOpen(true);
      setFormUpdate({ logID: logID, estado: "", comentario: "" });
      fetchTicket();
    } catch (error) {
      setMessage(error || "Error al crear el ticket");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const fetchTicket = async () => {
    setIsSubmitting(true);
    try {
      const ticket = await getTicketInfo(logID, token);
      setData(ticket);
    } catch (error) {
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
        paddingTop: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        minHeight: "90vh",
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
              marginBottom: 2,
              backgroundColor: "#142a3d",
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            VOLVER
          </Button>
        </Box>
      </Box>
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{ width: "80%", marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}
      {isSubmitting ? (
        <Box
          sx={{
            backgroundColor: "white",
            height: "30vh",
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            border: "2px solid #dfdeda",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 4, color: "#142a3d" }}>
            Cargando los recursos...
          </Typography>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            paddingBottom: 4,
            borderRadius: 2,
            border: "2px solid #dfdeda",
          }}
        >
          {TicketPreview()}
        </Box>
      )}
      {area && area.areaID == 7 && (
        <Box
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 2,
            backgroundColor: "#fff",
            marginBottom: 4,
            borderRadius: 2,
            border: "2px solid #dfdeda",
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
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                marginBottom: 2,
                marginTop: 2,
                justifyContent: "start",
                width: "95%",
                color: "#142a3d",
              }}
            >
              GESTIONAR TICKET
            </Typography>
            <Divider sx={{ width: "95%", marginBottom: 2 }} />
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
                    background: "#142a3d",
                    color: "white",
                    fontWeight: "bold",
                    width: { lg: "40%", md: "90%", xs: "90%" },
                    borderRadius: 2,
                  }}
                >
                  {isSubmitting ? "Cargando..." : "ACTUALIZAR ESTADO"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TicketViewer;

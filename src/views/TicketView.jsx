import {
  Alert,
  Box,
  Button,
  Divider,
  Modal,
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  updateTicketEstado,
  getTicketInfo,
} from "../api/ticketeraAPI";
import { useParams, Link } from "react-router-dom";
import { fetchFileUrl } from "../api/downloadApi";

function TicketViewer() {
  const authState = useSelector((state) => state.auth);
  const { logID } = useParams();
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState(undefined);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formUpdate, setFormUpdate] = useState({
    logID: "",
    estado: "",
  });
  const [respaldo, setRespaldo] = useState(null);

  const optionSelect = [
    { value: 2, label: "EN GESTION" },
    { value: 3, label: "FINALIZADO" },
    { value: 4, label: "NO APLICA" },
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

    // Restar 4 horas al tiempo
    date.setUTCHours(date.getUTCHours() - 4);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDateTime = `${day}-${month}-${year}`;

    return formattedDateTime;
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
          }}
        >
          DETALLES
        </Typography>
        <Divider sx={{ width: "95%", marginBottom: 2 }} />
      </>
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          CATEGORIA :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.categoria ? data.categoria : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          TITULO :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.titulo ? data.titulo : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          DESCRIPCION :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.descripcion ? data.descripcion : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          SOLICITANTE :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.solicitante ? data.solicitante : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
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
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          ESTADO :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.estado ? data.estado : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          CREACION :
        </Typography>
        <Typography variant="h7" sx={{ width: "80%" }}>
          {data.fecha_solicitud
            ? extractDate(data.fecha_solicitud)
            : "No disponible"}
        </Typography>
      </Box>
      <Divider sx={{ width: "95%", margin: 2 }} />{" "}
      <Box sx={{ width: "95%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h7" fontWeight="bold" sx={{ width: "20%" }}>
          IMAGEN :
        </Typography>{" "}
        <Typography variant="h7" sx={{ width: "80%" }}>
          {respaldo && !loading ? (
            <Tooltip title="Ver imagen"  placement="top">
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                <a href={respaldo} target="_blank" rel="noopener noreferrer">
                  <img
                    src={respaldo}
                    alt="Imagen del ticket"
                    style={{
                      maxHeight: "600px",
                      maxWidth: "600px",
                      cursor: "pointer",
                    }}
                  />
                </a>
              </Typography>
            </Tooltip>
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
    try {
      const response = await updateTicketEstado(formUpdate, token);
      setAlertType("success");
      setMessage(response.message || "Estado del ticket actualizado");
      setOpen(true);
      setFormUpdate({ logID: logID, estado: "" });
      fetchTicket();
    } catch (error) {
      setMessage(error || "Error al crear el ticket");
      setAlertType("error");
      setOpen(true);
    }
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
        paddingTop: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
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
          to="/modulo:gestion-ticketera"
          sx={{ textDecoration: "none", with: "100%" }}
        >
          <Button
            variant="contained"
            sx={{
              width: "200px",
              marginBottom: 2,
              backgroundColor: "#0b2f6d",
              borderRadius: "0px",
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
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
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
            boxShadow: 2,
          }}
        >
          {TicketPreview()}
        </Box>
      )}
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 2,
          backgroundColor: "#fff",
          boxShadow: 2,
          marginBottom: 4,
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
            }}
          >
            GESTIONAR TICKET
          </Typography>
          <Divider sx={{ width: "95%", marginBottom: 2 }} />
          <Box
            sx={{
              width: "95%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 4,
            }}
          >
            <Select
              label="Estado"
              value={formUpdate.estado}
              onChange={(e) =>
                setFormUpdate({ ...formUpdate, estado: e.target.value })
              }
              size="small"
              variant="standard"
              sx={{ width: "30%" }}
            >
              {optionSelect.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={() => {
                handleUpdate();
              }}
              sx={{
                background: "#0b2f6d",
                color: "white",
                fontWeight: "bold",
                width: "30%",
                borderRadius: "0px",
              }}
            >
              {isSubmitting ? "Cargando..." : "ACTUALIZAR ESTADO"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TicketViewer;

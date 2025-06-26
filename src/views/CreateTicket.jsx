import {
  Alert,
  Box,
  Button,
  Divider,
  InputLabel,
  Modal,
  Rating,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  TableContainer,
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoriasTicket,
  createTicket,
  getUserTicket,
} from "../api/ticketeraAPI";

function TicketeraView() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [crear, setCrear] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [categorias, setCategorias] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const handlePage = (newPage) => setPage(newPage);

  const [ticket, setTicket] = useState(null);

  const [form, setForm] = useState({
    file: null,
    ticketcategoriaID: "",
    titulo: "",
    descripcion: "",
    prioridad: 1,
    userID: "",
  });

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setMessage("Solo se permiten archivos de imagen.");
      setAlertType("error");
      setOpen(true);
      setForm({ ...form, file: null });
      e.target.value = null; // limpia el input
      return;
    }
    setForm({
      ...form,
      file: file,
    });
  };

  const fetchTickets = async () => {
    try {
      const tickets = await getUserTicket(page, token);
      setData(tickets.data);
      setPages(tickets.pages);
    } catch (error) {
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
  };

  const clearForm = () => {
    setForm({
      file: null,
      ticketcategoriaID: "",
      titulo: "",
      descripcion: "",
      prioridad: 1, // Reiniciar prioridad a valor por defecto
      userID: user_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (form.file) {
      formData.append("file", form.file);
    }
    formData.append("ticketcategoriaID", form.ticketcategoriaID);
    formData.append("titulo", form.titulo);
    formData.append("descripcion", form.descripcion);
    formData.append("prioridad", form.prioridad);
    formData.append("userID", form.userID);

    try {
      var response = await createTicket(formData, token);
      setAlertType("success");
      setMessage(response.message || "Ticket creado exitosamente");
      clearForm();
      setOpen(true);
    } catch (error) {
      // Manejo de error específico si el archivo está abierto por otro proceso
      let errorMsg = error?.message || error;
      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("used by another process") ||
          errorMsg.includes("no se puede obtener acceso al archivo") ||
          errorMsg.includes("Failed to load"))
      ) {
        errorMsg =
          "No se pudo cargar el archivo porque está abierto en otra aplicación. Por favor, cierre el archivo e intente nuevamente.";
      }
      setMessage(errorMsg);
      setAlertType("error");
      setOpen(true);
    } finally {
      fetchTickets(); // Refrescar la lista de tickets después de crear uno nuevo
      setIsSubmitting(false);
      setCrear(false); // Cerrar el formulario de creación después de enviar
    }
  };

  const fetchCategorias = async () => {
    try {
      const categorias = await getCategoriasTicket(token);
      const categoriasTransformadas = categorias.map((cat) => ({
        value: cat.id,
        label: cat.descripcion,
      }));
      setCategorias(categoriasTransformadas);
    } catch (error) {
      setMessage(error.message || "Error al obtener las categorías");
      setAlertType("error");
      setOpen(true);
    }
  };

  const createCard = () => (
    <Box
      sx={{
        mb: 2,
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          mt: 2,
          width: "90%",
          textAlign: "start",
          fontWeight: "bold",
          color: "#0b2f6d",
        }}
      >
        CREAR TICKET
      </Typography>
      <Divider sx={{ width: "90%", mb: 2 }} />
      <form onSubmit={handleSubmit} style={{ width: "90%" }}>
        <Box sx={{ mb: 2, width: "100%" }}>
          <InputLabel id="categoria-label">CATEGORÍA</InputLabel>
          <Select
            variant="standard"
            required
            labelId="categoria-label"
            id="categoria-select"
            label="CATEGORIA"
            name="categoria"
            value={form.ticketcategoriaID || ""}
            onChange={(e) =>
              setForm({ ...form, ticketcategoriaID: e.target.value })
            }
            sx={{ mb: 2, mt: 1, width: "50%", backgroundColor: "white" }}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.value} value={categoria.value}>
                {categoria.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mb: 2, width: "100%" }}>
          <InputLabel id="titulo-input-label">TÍTULO</InputLabel>
          <TextField
            type="text"
            variant="standard"
            required
            fullWidth
            sx={{
              mb: 2,
              width: "50%",
              backgroundColor: "white",
            }}
            placeholder="Ingrese el título del ticket"
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            inputProps={{ maxLength: 99 }}
          />
        </Box>
        <Box sx={{ mb: 2, width: "100%" }}>
          <InputLabel id="archivo-input-label">ARCHIVO</InputLabel>
          <TextField
            type="file"
            fullWidth
            variant="standard"
            size="large"
            sx={{ mb: 2, width: "50%", backgroundColor: "white" }}
            onChange={handleFileChange}
            inputProps={{ accept: "image/*" }}
          />
        </Box>
        <Box sx={{ mb: 2, width: "100%" }}>
          <InputLabel id="archivo-input-label">PRIORIDAD</InputLabel>{" "}
          <Rating
            name="prioridad"
            value={form.prioridad}
            onChange={(event, newValue) => {
              setForm({ ...form, prioridad: newValue || 1 });
            }}
            max={3}
            defaultValue={1}
            precision={1}
          />
        </Box>
        <Box sx={{ mb: 2, width: "100%" }}>
          <InputLabel id="descripcion-input-label">DESCRIPCIÓN</InputLabel>
          <TextField
            type="text"
            required
            fullWidth
            variant="standard"
            placeholder="Ingrese la descripción del ticket"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            inputProps={{ maxLength: 499 }}
            multiline
            minRows={4}
            maxRows={4}
            sx={{
              width: "100%",
              backgroundColor: "white",
            }}
          />
        </Box>
        <Box
          sx={{ mb: 2, width: "100%", display: "flex", justifyContent: "end" }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              width: "200px",
              borderRadius: "0px",
              height: "40px",
              ml: 2,
              backgroundColor: "#0b2f6d",
              color: "white",
            }}
          >
            <Typography fontWeight="bold">
              {isSubmitting ? "Subiendo..." : "Enviar"}
            </Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setCrear(false);
              clearForm();
            }}
            sx={{
              width: "200px",
              borderRadius: "0px",
              height: "40px",
              ml: 2,
            }}
          >
            <Typography fontWeight="bold">DESCARTAR</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );

  const modalComentario = () => (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography
            id="modal-icon"
            sx={{ color: "#0b2f6d", fontWeight: "bold" }}
          >
            <WarningAmberIcon />
          </Typography>
        </Box>
        <Divider sx={{ width: "100%", mb: 2 }} />
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2, color: "#0b2f6d", fontWeight: "bold" }}
        >
          COMENTARIO
        </Typography>
        <Typography id="modal-description" sx={{ mb: 2 }}>
          {ticket.comentario
            ? ticket.comentario
            : "No hay comentarios disponibles."}
        </Typography>
      </Box>
    </Modal>
  );

  const tableView = () => (
    <Box
      sx={{
        mb: 2,
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          mb: 2,
          width: "100%",
          display: "flex",
          justifyContent: "start",
        }}
      >
        <Button
          onClick={() => setCrear(true)}
          variant="contained"
          color="error"
          sx={{
            width: "200px",
            borderRadius: "0px",
            mt: 2,
            boxShadow: 2,
          }}
        >
          <Typography fontWeight="bold">CREAR TICKET</Typography>
        </Button>
      </Box>

      <Box sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ boxShadow: 2, backgroundColor: "white" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "TICKET",
                  "CATEGORÍA",
                  "TITULO",
                  "FECHA SOLICITUD",
                  "PRIORIDAD",
                  "GESTIONADO POR",
                  "ESTADO",
                  "ULTIMO CAMBIO",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{ backgroundColor: "#0b2f6d" }}
                  >
                    <Typography
                      fontWeight={"bold"}
                      sx={{ fontSize: "12px", color: "white" }}
                    >
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow
                    key={index}
                    component={Link}
                    to={`/ticketviewer/${row.logID}`}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.ticket_id ? row.ticket_id : "Sin Información"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.categoria ? row.categoria : "Sin Información"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.titulo ? row.titulo : "Sin titulo"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.fecha_creacion
                        ? extractDate(row.fecha_creacion)
                        : "Sin Información"}
                    </TableCell>{" "}
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.prioridad ? (
                        <Rating value={row.prioridad} readOnly max={3} />
                      ) : (
                        "Sin Información"
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.gestionado_por
                        ? row.gestionado_por
                        : "Sin Información"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.estado ? row.estado : "Sin Información"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "12px" }}>
                      {row.last_update
                        ? extractDate(row.last_update)
                        : "Sin Información"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Typography fontFamily="initial">
                      No hay datos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          {getButtons()}
        </Box>
      </Box>
    </Box>
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
    fetchTickets();
  }, [page]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id, // Asignar el user_id al formulario
    }));
  }, [user_id]);

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
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{ width: "93%", marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}

      {openModal && modalComentario()}

      {!crear && tableView()}

      {crear && createCard()}
    </Box>
  );
}

export default TicketeraView;

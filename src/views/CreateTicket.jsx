import {
  Alert,
  Box,
  Button,
  Divider,
  InputLabel,
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
  TableContainer
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoriasTicket,
  createTicket,
  getUserTicket,
  sendTicketInfo,
} from "../api/ticketeraAPI";
import { MainLayout } from "./Layout";

function TicketeraView() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [crear, setCrear] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [categorias, setCategorias] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const handlePage = (newPage) => setPage(newPage);
  const [logID, setLogID] = useState(null);

  const [titleOptions, setTitleOptions] = useState([]);

  const [form, setForm] = useState({
    file: null,
    ticketcategoriaID: "",
    titulo: "",
    descripcion: "",
    prioridad: 1,
    userID: "",
  });

  const setTituloData = () => {
    if (form.ticketcategoriaID && form.ticketcategoriaID != "") {
      switch (form.ticketcategoriaID) {
        case 1:
          const transformedOptions = [
            {
              value: "OT SIN GENERAR",
              label: "OT SIN GENERAR",
            },
            {
              value: "REPORTE NO ACTUALIZADO",
              label: "REPORTE NO ACTUALIZADO",
            },
            {
              value: "SIN ACCESO A PLATAFORMA",
              label: "SIN ACCESO A PLATAFORMA",
            },
            {
              value: "TOTEM FUERA DE SERVICIO",
              label: "TOTEM FUERA DE SERVICIO",
            },
            {
              value: "OTROS",
              label: "OTROS",
            },
          ];
          setTitleOptions(transformedOptions);
          break;

        case 2:
          const transformedOptions2 = [
            { value: "ACCESO A REPORTE", label: "ACCESO A REPORTE" },
            { value: "CREACION DE PERMISOS", label: "CREACION DE PERMISOS" },
            { value: "CREACION DE OT EN SGS", label: "CREACION DE OT EN SGS" },
            { value: "CREACION DE USUARIO", label: "CREACION DE USUARIO" },
            { value: "ELIMINAR USUARIO/PERMISO", label: "ELIMINAR USUARIO/PERMISO" },
            {
              value: "OTROS",
              label: "OTROS",
            },
          ];
          setTitleOptions(transformedOptions2);
          break;

        case 3:
          const transformedOptions3 = [
            {
              value: "AUTOMATIZACION DE PROCESO",
              label: "AUTOMATIZACION DE PROCESO",
            },
            { value: "CREACION DE MODULO", label: "CREACION DE MODULO" },
            { value: "DESARROLLO DE REPORTE", label: "DESARROLLO DE REPORTE" },
            {
              value: "OTROS",
              label: "OTROS",
            },
          ];
          setTitleOptions(transformedOptions3);
          break;

        default:
          console.log("ticketcategoriaID no reconocida");
          break;
      }
    } else {
      console.log("No hay submotivos disponible");
    }
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Solo se permiten archivos JPG, JPEG y PNG.");
        setAlertType("error");
        setOpen(true);
        setForm({ ...form, file: null });
        e.target.value = null; // limpia el input
        return;
      }
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
    setTitleOptions([]); // Clear title options when form is cleared
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
      setLogID(response.logID);
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
        borderRadius: 2,
        border: "2px solid #dfdeda",
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
          color: "#142a3d",
        }}
      >
        CREAR TICKET
      </Typography>
      <Divider sx={{ width: "90%", mb: 2 }} />
      <form onSubmit={handleSubmit} style={{ width: "90%" }}>
        <Box sx={{ mb: 1, width: "100%" }}>
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
        <Box sx={{ mb: 1, width: "100%" }}>
          <InputLabel id="titulo-input-label">TÍTULO</InputLabel>
          <Select
            variant="standard"
            required
            labelId="titulo-input-label"
            id="titulo-select"
            label="TITULO"
            name="titulo"
            value={form.titulo || ""}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            sx={{ mb: 2, mt: 1, width: "50%", backgroundColor: "white" }}
            disabled={!form.ticketcategoriaID || titleOptions.length === 0}
          >
            {titleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mb: 1, width: "100%" }}>
          <InputLabel id="archivo-input-label">ARCHIVO</InputLabel>
          <TextField
            type="file"
            fullWidth
            variant="standard"
            size="large"
            sx={{ mb: 2, width: "50%", backgroundColor: "white" }}
            onChange={handleFileChange}
            inputProps={{ accept: ".jpg,.jpeg,.png,image/jpeg,image/png" }}
          />
        </Box>
        <Box sx={{ mb: 1, width: "100%" }}>
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
        <Box sx={{ mb: 1, width: "100%" }}>
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
              borderRadius: 2,
              height: "40px",
              ml: 2,
              backgroundColor: "#142a3d",
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
              borderRadius: 2,
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

  const tableView = () => (
    <Box
      sx={{
        mb: 2,
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
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
            borderRadius: 2,
            mt: 2,
            boxShadow: 2,
          }}
        >
          <Typography fontWeight="bold">CREAR TICKET</Typography>
        </Button>
      </Box>

      <Box sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ boxShadow: 2, backgroundColor: "white", borderRadius: 2 }}>
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
                    sx={{ backgroundColor: "#142a3d" }}
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
        sx={{ background: "#142a3d" }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={{ background: "#142a3d" }}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{ background: "#142a3d" }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  const sendTicketInfoToUser = async () => {
    try {
      await sendTicketInfo(logID, token);
      setLogID(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (logID && logID != null) {
      sendTicketInfoToUser();
    }
  }, [logID]);

  useEffect(() => {
    fetchTickets();
  }, [page]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userID: user_id,
    }));
  }, [user_id]);

  useEffect(() => {
    setTituloData();
    setForm((prevForm) => ({ ...prevForm, titulo: "" }));
  }, [form.ticketcategoriaID]);

  return (
    <MainLayout showNavbar={true}>
    <Box
      sx={{
        paddingTop: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
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

      {!crear && tableView()}

      {crear && createCard()}
    </Box>
    </MainLayout>
  );
}

export default TicketeraView;

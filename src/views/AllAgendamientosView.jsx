import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useEffect, useState } from "react";
import {
  getAllAgendamientos,
  filterAgendamiento,
  getDespachosSemenalExcel,
} from "../api/despachoAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function AllAgendamientoViewer() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const handlePage = (newPage) => setPage(newPage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getExcel = async () => {
    setIsSubmitting(true);
    try {
      await getDespachosSemenalExcel(token);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const downloadExcel = () => (
    <Box
      sx={{
        width: "90%",
        mt: 2,
        display: "flex",
        justifyContent: "start",
      }}
    >
      <Button
        variant="contained"
        onClick={getExcel}
        color="error"
        disabled={isSubmitting}
        sx={{
          width: 200,
          height: 40,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-around",
          borderRadius: 2,
        }}
      >
        {isSubmitting ? "Cargando..." : "Descargar Excel"}
      </Button>
    </Box>
  );

  const [form, setForm] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAgendamientos(token, page);
      setData(response.data);
      setPages(response.pages);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await filterAgendamiento(
        token,
        form.fechaInicio,
        form.fechaFin
      );
      console.log(response);
      setData(response);
      setPages(1);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearFilter = () => {
    setForm({ fechaInicio: "", fechaFin: "" });
    fetchData();
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
          {[
            "FECHA CREACION",
            "ORDEN",
            "ESTADO",
            "FECHA AGENDAMIENTO",
            "AGENDADO POR",
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#142a3d",
                fontWeight: "bold",
                width: "20%",
                color: "white",
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
                sx={{ fontSize: "14px", width: "20%" }} // Equal width
              >
                <Typography variant="secondary">
                  {row.fechaRegistro
                    ? extractDate(row.fechaRegistro)
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "14px", width: "20%" }} // Equal width
              >
                <Typography variant="secondary">
                  {row.orden ? row.orden : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "14px", width: "20%" }} // Equal width
              >
                <Typography variant="secondary">
                  {row.estado_interno ? row.estado_interno : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "14px", width: "20%" }} // Equal width
              >
                <Typography variant="secondary">
                  {row.nueva_cita
                    ? extractDate(row.nueva_cita)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "14px", width: "20%" }} // Equal width
              >
                <Typography variant="secondary">
                  {row.usuario ? row.usuario.nombre : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ width: "100%" }}>
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

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
        overflow: "auto",
        paddingY: 2,
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

      <Box
        sx={{
          width: { lg: "90%", md: "100%", xs: "100%" },
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/agendamientos">
          <Button
            variant="contained"
            sx={{
              background: "#142a3d",
              borderRadius: 2,
              marginBottom: 2,
              width: "200px",
              fontWeight: "bold",
            }}
          >
            Volver
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          width: "90%",
          mt: 2,
          background: "#fff",
              borderRadius: 2,
              border: "2px solid #dfdeda",
          pt: 2,
          pb: 2,
        }}
      >
        <form onSubmit={SubmitForm}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                mb: 2,
                width: "35%",
              }}
            >
              <InputLabel id="fechaInicio-label">Fecha de Inicio</InputLabel>
              <TextField
                required
                size="small"
                id="fechaInicio"
                type="datetime-local"
                name="fechaInicio"
                variant="standard"
                value={form.fechaInicio}
                onChange={handleChange}
                sx={{ minWidth: "100%" }}
              />
            </Box>
            <Box
              sx={{
                mb: 2,
                width: "35%",
              }}
            >
              <InputLabel id="fechaFin-label">Fecha de Fin</InputLabel>
              <TextField
                required
                id="fechaFin"
                size="small"
                type="datetime-local"
                name="fechaFin"
                variant="standard"
                value={form.fechaFin}
                onChange={handleChange}
                sx={{ minWidth: "100%" }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                mb: 2,
                width: "20%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  background: "#142a3d",
                  height: 30,
                  width: "100%",
                  borderRadius: 2,
                }}
              >
                {isSubmitting ? "Cargando..." : "Buscar"}
              </Button>
            </Box>
            <Box
              sx={{
                mb: 2,
                width: "20%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={clearFilter}
                sx={{ height: 30, width: "100%", borderRadius: 2 }}
              >
                Limpiar Filtro
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      {downloadExcel()}
      <Box sx={{ width: "90%", mt: 2, background: "#fff", borderRadius: 2, border: "2px solid #dfdeda" }}>
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
      </Box>

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
export default AllAgendamientoViewer;

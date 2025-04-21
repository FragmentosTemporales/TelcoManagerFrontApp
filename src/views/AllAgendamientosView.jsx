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
import { useEffect, useState } from "react";
import { getAllAgendamientos, filterAgendamiento } from "../api/despachoAPI";
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
            "FECHA AGENDAMIENTO",
            "AGENDADO POR",
          ].map((header) => (
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
                  {row.fechaAgendamiento
                    ? extractDate(row.fechaAgendamiento)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "25%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.usuario ? row.usuario.nombre : "Sin Información"}
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
      <Box
        sx={{
          width: "80%",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/agendamientos">
          <Button
            variant="contained"
            sx={{
              background: "#0b2f6d",
              borderRadius: "20px",
              marginBottom: 2,
            }}
          >
            Ver Mis Agendamientos
          </Button>
        </Link>
      </Box>

      <Card
        sx={{
          width: { lg: "80%", md: "60%", xs: "80%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold">Filtro por Fecha - Hora</Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
          }}
        />
        <CardContent sx={{ display: "grid" }}>
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
                  id="fechaInicio"
                  type="datetime-local"
                  name="fechaInicio"
                  variant="outlined"
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
                  type="datetime-local"
                  name="fechaFin"
                  variant="outlined"
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
                    background: "#0b2f6d",
                    height: 30,
                    width: "100%",
                    borderRadius: "20px",
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
                  sx={{ height: 30, width: "100%", borderRadius: "20px" }}
                >
                  Limpiar Filtro
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
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
          title={
            <Typography fontWeight="bold">Lista de Agendamientos</Typography>
          }
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
export default AllAgendamientoViewer;

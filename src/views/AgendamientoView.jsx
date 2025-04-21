import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
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
import { createAgendamiento, getAgendamientos } from "../api/despachoAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function AgendamientoViewer() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const contrato = "VTR";
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
    orden: "",
    fechaAgendamiento: "",
  });

  const SubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Remove all spaces from 'orden' and convert to lowercase
    const sanitizedOrden = form.orden.replace(/\s+/g, "").toUpperCase();

    // Validate that 'orden' starts with '1-'
    if (!sanitizedOrden.startsWith("1-")) {
      setAlertType("error");
      setMessage("El campo 'ORDEN DE TRABAJO' debe comenzar con '1-'.");
      setOpen(true);
      setIsSubmitting(false);
      return;
    }

    // Show confirmation alert with sanitized 'orden' and entered date
    const confirmation = window.confirm(
      `¿Está seguro de que desea crear este agendamiento?\n\nORDEN DE TRABAJO: ${sanitizedOrden}\nFECHA: ${form.fechaAgendamiento}`
    );
    if (!confirmation) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      userID: user_id,
      orden: sanitizedOrden,
      contrato: contrato,
      fechaAgendamiento: form.fechaAgendamiento,
    };

    try {
      const response = await createAgendamiento(payload, token);
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
      fechaAgendamiento: "",
    });
    setIsSubmitting(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAgendamientos(token, page);
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
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
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
          {["FECHA CREACION", "ORDEN", "FECHA AGENDAMIENTO", "CONTRATO"].map(
            (header) => (
              <TableCell
                key={header}
                align="center"
                sx={{
                  background: "#d8d8d8",
                  fontWeight: "bold",
                  width: "33.33%",
                }}
              >
                {header}
              </TableCell>
            )
          )}
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
                sx={{ fontSize: "16px", width: "33.33%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaRegistro
                    ? extractDate(row.fechaRegistro)
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "33.33%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.orden ? row.orden : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "33.33%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaAgendamiento
                    ? extractDate(row.fechaAgendamiento)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "33.33%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.contrato ? row.contrato : "Sin Información"}
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
          title={<Typography fontWeight="bold">Crear Agendamiento</Typography>}
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
                  <TextField
                    required
                    id="orden"
                    label="ORDEN DE TRABAJO"
                    type="text"
                    name="orden"
                    variant="outlined"
                    value={form.orden}
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
                  <TextField
                    required
                    id="fechaAgendamiento"
                    type="datetime-local"
                    name="fechaAgendamiento"
                    variant="outlined"
                    value={form.fechaAgendamiento}
                    onChange={handleChange}
                    sx={{ minWidth: "100%" }}
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
                    sx={{ background: "#0b2f6d", height: 30, width: "100%" }}
                  >
                    {isSubmitting ? "Cargando..." : "Crear"}{" "}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ textAlign: "center" }}></Box>
            </form>
        </CardContent>
      </Card>

      <Box
        sx={{
          width: "80%",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/all_agendamientos">
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", borderRadius: "20px", marginBottom: 2 }}
          >
            Ver Todas
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
          title={<Typography fontWeight="bold">Mis Agendamientos</Typography>}
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
export default AgendamientoViewer;

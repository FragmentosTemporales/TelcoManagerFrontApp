import {
  Alert,
  Box,
  Button,
  Divider,
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
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTicketera } from "../api/ticketeraAPI";
import { Link } from "react-router-dom";

function GestorTicketera() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState(undefined);
  const [data, setData] = useState([]);
  const optionSQL = [
    "SOLICITADO",
    "EN GESTION",
    "FINALIZADO",
    "NO APLICA",
    "DERIVADO A TI",
  ];
  const [form, setForm] = useState({ estado: "SOLICITADO" });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      fetchTickets();
    } catch (error) {
      setMessage(error.message || "Error al crear el ticket");
      setAlertType("error");
      setOpen(true);
    }
  };

  const fetchTickets = async () => {
    setIsSubmitting(true);
    try {
      const tickets = await getTicketera(form, token);
      setData(tickets);
    } catch (error) {
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const filterTickets = () => (
    <Box
      sx={{
        width: "90%",
        m: 2,
        pt: 2,
        pb: 2,
        boxShadow: 2,
        backgroundColor: "white",
        borderRadius: 2,
        border: "2px solid #dfdeda",
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}
      >
        FILTRAR POR ESTADO
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            size="small"
            variant="standard"
            sx={{ width: { lg: "30%", md: "50%", xs: "90%" }, mb: 2 }}
          >
            {optionSQL.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            disabled={isSubmitting}
            type="submit"
            sx={{
              background: "#0b2f6d",
              color: "white",
              fontWeight: "bold",
              width: { lg: "30%", md: "50%", xs: "90%" },
              borderRadius: 2,
            }}
          >
            {isSubmitting ? "Cargando..." : "FILTRAR TICKETS"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const tablaTickets = () => (
    <Box sx={{ width: "90%", mb: 2 }}>
      <TableContainer
        sx={{
          boxShadow: 2,
          backgroundColor: "white",
          borderRadius: 2,
          border: "2px solid #dfdeda",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "TICKET",
                "CATEGORÍA",
                "TITULO",
                "FECHA SOLICITUD",
                "PRIORIDAD",
                "SOLICITADO POR",
                "ESTADO",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="left"
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
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  component={Link}
                  to={`/ticketviewer/${row.logID}`}
                >
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.ticket_id ? row.ticket_id : "Sin Información"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontSize: "12px", fontWeight: "bold" }}
                  >
                    {row.categoria ? row.categoria : "Sin Información"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.titulo ? row.titulo : "Sin titulo"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.fecha_solicitud
                      ? extractDate(row.fecha_solicitud)
                      : "Sin Información"}
                  </TableCell>{" "}
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.prioridad ? (
                      <Rating value={row.prioridad} readOnly max={3} />
                    ) : (
                      "Sin Información"
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.solicitante ? row.solicitante : "Sin Información"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px" }}>
                    {row.estado ? row.estado : "Sin Información"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography>No hay datos disponibles</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  useEffect(() => {
    fetchTickets();
  }, []);

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
          sx={{ width: "90%", marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}
      {filterTickets()}
      {tablaTickets()}
    </Box>
  );
}

export default GestorTicketera;

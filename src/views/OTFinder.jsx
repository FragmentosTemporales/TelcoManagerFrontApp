import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getOrdenInfo, getBacklogEstado } from "../api/backlogAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";

function OTFinder() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoadingBacklogEstado, setIsLoadingBacklogEstado] = useState(false);
  const [dataBacklogEstado, setDataBacklogEstado] = useState(undefined);
  const [orden, setOrden] = useState(undefined);
  const [ordenData, setOrdenData] = useState(undefined);

  const handleClose = () => {
    setOpen(false);
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

  const fetchOrden = async (orden) => {
    setIsLoadingBacklogEstado(true);
    try {
      const response = await getOrdenInfo(token, orden);
      setOrdenData(response);
      fetchBacklogEstado(orden); // Fetch backlog state after fetching orden data
    } catch (error) {
      setAlertType("error");
      setMessage(error.message || "Error fetching orden data");
      setOpen(true);
    } finally {
      setIsLoadingBacklogEstado(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    if (ordenData) {
      console.log("Orden Data:", ordenData);
    }
  }, [ordenData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        padding: 8,
        backgroundColor: "#f0f0f0",
        minHeight: "90vh",
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
          mb: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 2,
          backgroundColor: "white",
          pt: 4,
          pb: 4,
        }}
      >
        <InputLabel>BUSCAR ORDEN DE TRABAJO</InputLabel>
        <TextField
          required
          id="orden"
          type="text"
          name="orden"
          size="small"
          variant="standard"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            fetchOrden(orden);
          }}
          sx={{
            marginTop: 2,
            background: "#0b2f6d",
            width: "300px",
            borderRadius: "0px",
          }}
        >
          {" "}
          BUSCAR{" "}
        </Button>
      </Box>

      {/* TARJETA DE INFORMACION BACKLOG */}
      {ordenData && (
        <Box
          sx={{
            backgroundColor: "white",
            width: "100%",
          }}
        >
          {ordenData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Fecha Carga
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Órden de Trabajo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Rut</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Celular</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Zona</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Dirección</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Técnico</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actividad</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Fecha Agenda
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Franja</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Código de Cierre
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordenData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {row.fecha_carga || "Sin Información"}
                      </TableCell>
                      <TableCell>
                        {row.orden_de_trabajo || "Sin Información"}
                      </TableCell>
                      <TableCell>{row.Cliente || "Sin Información"}</TableCell>
                      <TableCell>
                        {row.rut_cliente || "Sin Información"}
                      </TableCell>
                      <TableCell>{row.Celular || "Sin Información"}</TableCell>
                      <TableCell>
                        {row.zona_de_trabajo || "Sin Información"}
                      </TableCell>
                      <TableCell>
                        {row.direccion || "Sin Información"}
                      </TableCell>
                      <TableCell>{row.tecnico || "Sin Información"}</TableCell>
                      <TableCell>
                        {row.tipo_de_actividad || "Sin Información"}
                      </TableCell>
                      <TableCell>{row.Fecha || "Sin Información"}</TableCell>
                      <TableCell>{row.Franja || "Sin Información"}</TableCell>
                      <TableCell>
                        {row.codigo_de_cierre || "Sin Información"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                pt: 2,
                pb: 2,
                fontWeight: "bold",
                color: "gray",
                textAlign: "center",
                boxShadow: 2,
              }}
            >
              NO HAY INFORMACIÓN PARA MOSTRAR
            </Typography>
          )}
        </Box>
      )}

      {dataBacklogEstado && dataBacklogEstado.length > 0 ? (
        <TableContainer sx={{ marginTop: 4, width: "100%", backgroundColor: "white", boxShadow: 2 }}>
          <Table
            sx={{
              width: "100%",
              display: "column",
              justifyContent: "center",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "15%",
                    color: "white",
                  }}
                >
                  ESTADO INTERNO
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "15%",
                    color: "white",
                  }}
                >
                  NUEVA FECHA
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "15%",
                    color: "white",
                  }}
                >
                  GESTIONADO POR
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "15%",
                    color: "white",
                  }}
                >
                  COMENTARIO
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataBacklogEstado.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "16px", width: "15%" }} // Equal width
                  >
                    <Typography fontFamily={"initial"} variant="secondary">
                      {row.estado_interno
                        ? row.estado_interno
                        : "Sin Información"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "16px", width: "15%" }} // Equal width
                  >
                    <Typography fontFamily={"initial"} variant="secondary">
                      {row.nueva_cita
                        ? extractDate(row.nueva_cita)
                        : "Sin Información"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "16px", width: "30%" }} // Equal width
                  >
                    <Typography fontFamily={"initial"} variant="secondary">
                      {row.usuario.nombre
                        ? row.usuario.nombre
                        : "Sin Información"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "16px", width: "40%" }} // Equal width
                  >
                    <Typography fontFamily={"initial"} variant="secondary">
                      {row.comentario ? row.comentario : "Sin Información"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}
export default OTFinder;

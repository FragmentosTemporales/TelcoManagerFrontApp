import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  MenuItem,
  Modal,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { getObjetivos, updateObjetivo } from "../api/dataAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";

function ObjetivosView() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [gerencia, setGerencia] = useState(null);
  const [mes, setMes] = useState(null);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setID] = useState(undefined);
  const [value, setValue] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [habilitado, setHabilitado] = useState(false);

  const mesOptions = [
    {
      value: "2025-07-01",
      label: "Julio 2025",
    },
    {
      value: "2025-08-01",
      label: "Agosto 2025",
    },
    {
      value: "2025-09-01",
      label: "Septiembre 2025",
    },
    {
      value: "2025-10-01",
      label: "Octubre 2025",
    },
    {
      value: "2025-11-01",
      label: "Noviembre 2025",
    },
    {
      value: "2025-12-01",
      label: "Diciembre 2025",
    },
  ];

  const [origenes, setOrigenes] = useState([]);

  const gerenciaOptions = [
    {
      value: "Biobío",
      label: "Biobío",
    },
    {
      value: "Metropolitana",
      label: "Metropolitana",
    },
  ];

  const fetchData = async () => {
    try {
      setOrigenes([]);
      setIsSubmitting(true);
      const res = await getObjetivos(token, gerencia, mes);
      setData(res);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const ActualizarObjetivo = async () => {
    try {
      setIsSubmitting(true);
      await updateObjetivo(token, id, { value: value });
      const res = await getObjetivos(token, gerencia, mes);

      setOpenModal(false);
      setData(res);
      setIsSubmitting(false);
      setValue(undefined);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const setFilter = () => (
    <Box sx={{ width: "100%", marginTop: 2, backgroundColor: "white", padding: 2, borderRadius: 2, border: "2px solid #dfdeda" }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 3,
          }}
        >
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">
              Seleccionar Gerencia
            </InputLabel>
            <Select
              required
              size="small"
              variant="standard"
              disabled={habilitado}
              labelId="estado-label"
              id="estado-select"
              value={gerencia || ""}
              sx={{ minWidth: "200px" }}
              onChange={(event) => {
                setGerencia(event.target.value);
              }}
            >
              {gerenciaOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">Seleccionar Mes</InputLabel>
            <Select
              labelId="estado-label"
              required
              size="small"
              variant="standard"
              id="estado-select"
              value={mes || ""}
              sx={{ minWidth: "200px" }}
              onChange={(event) => {
                setMes(event.target.value);
              }}
            >
              {mesOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontWeight: "bold",
              background: "#142a3d",
              minWidth: "200px",
              height: "40px",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Buscar"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const setTable = () => (
    <Box sx={{ width: "100%", marginTop: 2, boxShadow: 2, backgroundColor: "white", padding: 2, borderRadius: 2, border: "2px solid #dfdeda" }}>
      <TableContainer>
        <Table>
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </Box>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {[
            "GERENCIA",
            "SECTOR",
            "ORIGEN",
            "FUENTE",
            "TIPO",
            "FACILIDADES"
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{ background: "#142a3d", fontWeight: "bold", color: "white" }}
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
            <TableRow
              key={index}
              onClick={row.editable ? () => {
                setID(row.id);
                setOpenModal(true);
              } : undefined}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
              }}
            >
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.gerencia ? row.gerencia : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.sector ? row.sector : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.origen ? row.origen : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fuente ? row.fuente : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.tipo ? row.tipo : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.facilidades ? row.facilidades : 0}
                </Typography>
              </TableCell>

            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const setModal = () => (
    <>
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "200px",
            width: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            fontFamily={"initial"}
            sx={{ pt: 2 }}
          >
            {`Editar Info de Objetivo con ID #${id}`}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ mb: 2, pt: 2 }}>
            <InputLabel id="value-label">Nuevo Valor</InputLabel>
            <TextField
              fullWidth
              required
              id="value"
              type="integer"
              name="value"
              value={value || ""}
              variant="outlined"
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            onClick={ActualizarObjetivo}
            sx={{ backgroundColor: "#142a3d" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar"}
          </Button>
        </Box>
      </Modal>
    </>
  );

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const updatedOrigenes = Object.values(data).reduce(
        (acc, value) => {
          const existingIndex = acc.findIndex((o) => o.origen === value.origen);
          if (existingIndex !== -1) {
            acc[existingIndex].total += value.facilidades;
          } else {
            acc.push({ origen: value.origen, total: value.facilidades });
          }
          return acc;
        },
        [...origenes]
      ); // Copia del estado actual

      setOrigenes(updatedOrigenes);
    }
  }, [data]);

  useEffect(() => {
    if (origenes && origenes.length > 0) {
      console.log(origenes);
    }
  }, [origenes]);

  // VALIDACION PARA USUARIO

  useEffect(() => {
    if (user_id && user_id == 13) {
      setGerencia("Metropolitana");
      setHabilitado(true);
    } else if (user_id && user_id == 14) {
      setGerencia("Biobío");
      setHabilitado(true);
    } else null;
  }, [user_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          paddingY: "70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          minHeight: "90vh",
        }}
      >
        {openModal && setModal()}
        {origenes && origenes.length > 0 ? (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              marginBottom: 2,
              borderRadius: 2,
              border: "2px solid #dfdeda",
              backgroundColor: "white",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["ORIGEN", "TOTAL"].map((header) => (
                      <TableCell
                        key={header}
                        align="left"
                        sx={{ background: "#142a3d", fontWeight: "bold", color: "white" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {origenes && origenes.length > 0 ? (
                    origenes.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left" sx={{ fontSize: "16px" }}>
                          <Typography fontFamily={"initial"} variant="secondary">
                            {row.origen ? row.origen : "Sin Información"}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: "16px" }}>
                          <Typography fontFamily={"initial"} variant="secondary">
                            {row.total ? row.total : 0}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
        <Box
          sx={{
            width: "90%",
            borderRadius: "10",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {setFilter()}
          {setTable()}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default ObjetivosView;

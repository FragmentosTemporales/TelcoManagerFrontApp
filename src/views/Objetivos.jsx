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
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";
import { getObjetivos, updateObjetivo } from "../api/dataAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

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
      value: "2024-05-01",
      label: "Mayo 2024",
    },
    {
      value: "2024-06-01",
      label: "Junio 2024",
    },
    {
      value: "2024-07-01",
      label: "Julio 2024",
    },
    {
      value: "2024-08-01",
      label: "Agosto 2024",
    },
    {
      value: "2024-09-01",
      label: "Septiembre 2024",
    },
    {
      value: "2024-10-01",
      label: "Octubre 2024",
    },
    {
      value: "2024-11-01",
      label: "Noviembre 2024",
    },
    {
      value: "2024-12-01",
      label: "Diciembre 2024",
    },
    {
      value: "2025-01-01",
      label: "Enero 2025",
    },
    {
      value: "2025-02-01",
      label: "Febrero 2025",
    },
    {
      value: "2025-03-01",
      label: "Marzo 2025",
    },
    {
      value: "2025-04-01",
      label: "Abril 2025",
    },
    {
      value: "2025-05-01",
      label: "Mayo 2025",
    },
    {
      value: "2025-06-01",
      label: "Junio 2025",
    },
    {
      value: "2025-07-01",
      label: "Julio 2025",
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
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">
              Seleccionar Gerencia
            </InputLabel>
            <Select
              required
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
              background: "#0b2f6d",
              minWidth: "200px",
              height: "40px",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Buscar"}
          </Button>
        </Box>
      </form>
    </>
  );

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
            "GERENCIA",
            "SECTOR",
            "ORIGEN",
            "FUENTE",
            "TIPO",
            "FACILIDADES",
            "ACCIONES",
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{ background: "#d8d8d8", fontWeight: "bold" }}
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
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                {row.editable ? (
                  <Tooltip title="Editar">
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        setID(row.id);
                        setOpenModal(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Editar">
                    <Button disabled variant="contained" color="info">
                      <EditIcon />
                    </Button>
                  </Tooltip>
                )}
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
            sx={{ backgroundColor: "#0b2f6d" }}
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
      const updatedOrigenes = Object.values(data).reduce((acc, value) => {
        const existingIndex = acc.findIndex((o) => o.origen === value.origen);
        if (existingIndex !== -1) {
          acc[existingIndex].total += value.facilidades;
        } else {
          acc.push({ origen: value.origen, total: value.facilidades });
        }
        return acc;
      }, [...origenes]); // Copia del estado actual

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Coloca los hijos en columna
        justifyContent: "center", // Centra verticalmente
        alignItems: "center", // Centra horizontalmente
        minHeight: "90vh",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      {openModal && setModal()}
      {origenes && origenes.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            borderRadius: "10",
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
            marginBottom: 2
          }}
        >
          <Card sx={{ width: "40%", borderRadius: "10" }}>
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  TOTALES
                </Typography>
              }
              avatar={<CalculateIcon />}
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "end",
              }}
            />
            <CardContent>
              <TableContainer>
                <Table
                  sx={{
                    width: "100%",
                    display: "column",
                    justifyContent: "center",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {["ORIGEN", "TOTAL"].map((header) => (
                        <TableCell
                          key={header}
                          align="left"
                          sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      display: "column",
                      justifyContent: "center",
                    }}
                  >
                    {origenes && origenes.length > 0 ? (
                      origenes.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left" sx={{ fontSize: "16px" }}>
                            <Typography
                              fontFamily={"initial"}
                              variant="secondary"
                            >
                              {row.origen ? row.origen : "Sin Información"}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" sx={{ fontSize: "16px" }}>
                            <Typography
                              fontFamily={"initial"}
                              variant="secondary"
                            >
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
            </CardContent>
          </Card>
        </Box>
      ) : null}
      <Box
        sx={{
          width: "100%",
          borderRadius: "10",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "90%", borderRadius: "10" }}>
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                OBJETIVOS ONNET
              </Typography>
            }
            avatar={<SportsScoreIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent>{setFilter()}</CardContent>
          <CardContent>{setTable()}</CardContent>
        </Card>
      </Box>

      
    </Box>
  );
}

export default ObjetivosView;

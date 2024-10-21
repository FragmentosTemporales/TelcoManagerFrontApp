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
import { getObjetivos, updateObjetivo } from "../api/dataAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function ObjetivosView() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [gerencia, setGerencia] = useState(null);
  const [mes, setMes] = useState(null);
  const [data, setData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setID] = useState(undefined);
  const [value, setValue] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [habilitado, setHabilitado] = useState(false);

  const [mesOptions, setMesOption] = useState([
    {
      value: "2024-05-01",
      label: "Mayo",
    },
    {
      value: "2024-06-01",
      label: "Junio",
    },
    {
      value: "2024-07-01",
      label: "Julio",
    },
    {
      value: "2024-08-01",
      label: "Agosto",
    },
    {
      value: "2024-09-01",
      label: "Septiembre",
    },
    {
      value: "2024-10-01",
      label: "Octubre",
    },
    {
      value: "2024-11-01",
      label: "Noviembre",
    },
    {
      value: "2024-12-01",
      label: "Diciembre",
    },
  ]);

  const [gerenciaOptions, setGetenciaOptions] = useState([
    {
      value: "Biobío",
      label: "Biobío",
    },
    {
      value: "Metropolitana",
      label: "Metropolitana",
    },
  ]);

  const fetchData = async () => {
    try {
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
      setValue(undefined)
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
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.gerencia ? row.gerencia : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.sector ? row.sector : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.origen ? row.origen : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.fuente ? row.fuente : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.tipo ? row.tipo : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"monospace"} variant="secondary">
                  {row.facilidades ? row.facilidades : "Sin Información"}
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
            fontFamily={"monospace"}
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

  // VALIDACION PARA USUARIO

  useEffect(() => {
    if (user_id && user_id == 14) {
      setGerencia("Metropolitana");
      setHabilitado(true);
    } else if (user_id && user_id == 15) {
      setGerencia("Biobío");
      setHabilitado(true);
    } else null;
  }, [user_id]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      {openModal && setModal()}
      <Card sx={{ width: "90%", borderRadius: "0" }}>
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
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
  );
}

export default ObjetivosView;

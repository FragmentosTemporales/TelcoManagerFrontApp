import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  InputLabel,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setDomMessage } from "../slices/dominionSlice";
import { getReversas, updateReversas } from "../api/dominionAPI";
import tecnicosData from "../data/tecnicosData";

function ReversaView() {
  const { domToken, domMessage } = useSelector((state) => state.dominion);
  const [rut, setRut] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(undefined);
  const [reversa, setReversa] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [frecuencia, setFrecuencia] = useState("");

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {domMessage}
    </Alert>
  );

  const fetchTecnicos = async () => {
    try {
      const transformedOptions = tecnicosData.map((item) => ({
        value: item.value,
        label: item.label,
        frecuencia: item.frecuencia,
      }));
      setTecnicos(transformedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTecnicos = tecnicos.filter(
    (tecnico) => !frecuencia || tecnico.frecuencia === frecuencia
  );

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = rut;
    try {
      const response = await getReversas(domToken, payload);

      setData(response.data.filter((item) => item.entregado !== 1));
      setReversa(response.data.filter((item) => item.entregado !== 0));

      const formatted = response.data.map((item) => ({
        print: 0,
        entrega: item.entregado !== undefined ? item.entregado : 1,
        fuente: item.fuente !== undefined ? item.fuente : 1,
        id: item.id,
      }));
      setFormattedData(formatted);
      setLoading(false);
    } catch (error) {
      dispatch(setDomMessage("Se ha generado un error en el servidor"));
      setOpen(true);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id, type) => {
    setFormattedData((prevFormattedData) =>
      prevFormattedData.map((item) =>
        item.id === id ? { ...item, [type]: item[type] === 1 ? 0 : 1 } : item
      )
    );
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateReversas(domToken, formattedData);
      dispatch(setDomMessage(res.detail));
      setIsSubmitting(false);
      setOpen(true);
    } catch (error) {
      dispatch(setDomMessage(error));
      setOpen(true);
    }
  };

  const renderTableHeaders = () => (
    <TableHead>
      <TableRow>
        {[
          "FECHA",
          "ORDEN",
          "ANI",
          "EQUIPO",
          "SERIE",
          "ENTREGADO",
          "FUENTE",
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
  );

  const renderTableBody = () => {
    if (data && data.length > 0) {
      return (
        <TableBody>
          {data.map((item) => {
            const formattedItem =
              formattedData.find((i) => i.id === item.id) || {};
            return (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.fecha}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.orden}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.ANI}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.equipo}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.serie}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox
                    checked={formattedItem.entrega === 1}
                    onChange={() => handleCheckboxChange(item.id, "entrega")}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox
                    checked={formattedItem.fuente === 1}
                    onChange={() => handleCheckboxChange(item.id, "fuente")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  const renderTableBodyOk = () => {
    if (reversa && reversa.length > 0) {
      return (
        <TableBody>
          {reversa.map((item) => {
            const formattedItem =
              formattedData.find((i) => i.id === item.id) || {};
            return (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.fecha}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.orden}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.ANI}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.equipo}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.serie}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox checked={formattedItem.entrega === 1} disabled />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox checked={formattedItem.fuente === 1} disabled />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  const renderBtn = () => {
    if (data && data.length > 0) {
      return (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", width: "250px" }}
            onClick={handleSubmitUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar Información"}
          </Button>
        </Box>
      );
    } else {
      return null;
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      );
    }
    return (
      <CardContent>
        <Card>
          <CardHeader
            title="LISTA DE REVERSAS PENDIENTES"
            sx={{
              backgroundColor: "#0b2f6d",
              color: "white",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              {renderTableHeaders()}
              {renderTableBody()}
            </Table>
          </TableContainer>
        </Card>
      </CardContent>
    );
  };

  const renderTableOk = () => {
    if (loading) {
      return (
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      );
    }
    return (
      <CardContent>
        <Card>
          <CardHeader
            title="LISTA DE REVERSAS ENTREGADAS"
            sx={{
              backgroundColor: "#0b2f6d",
              color: "white",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              {renderTableHeaders()}
              {renderTableBodyOk()}
            </Table>
          </TableContainer>
        </Card>
      </CardContent>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        paddingTop: 8,
        mt: 2,
      }}
    >
      {open && renderAlert()}
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              width: "500px",
            }}
          >
            <FormControl fullWidth variant="filled">
              <InputLabel>Frecuencia</InputLabel>
              <Select
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                label="Frecuencia"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="MARTES">MARTES</MenuItem>
                <MenuItem value="MIERCOLES">MIÉRCOLES</MenuItem>
                <MenuItem value="JUEVES">JUEVES</MenuItem>
                <MenuItem value="VIERNES">VIERNES</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              width: "500px",
            }}
          >
            <Autocomplete
              fullWidth
              options={filteredTecnicos}
              getOptionLabel={(option) => option.label}
              value={
                filteredTecnicos.find((option) => option.value === rut) || null
              }
              onChange={(event, newValue) => setRut(newValue?.value || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Técnico"
                  variant="filled"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#0b2f6d" }}
            >
              CONSULTAR
            </Button>
          </Box>
        </form>
      </CardContent>
      <Box sx={{ width: {lg:"80%", md:"90%", xs:"100%" } }}>{renderTable()}</Box>
      {renderBtn()}
      <Box sx={{ width: {lg:"80%", md:"90%", xs:"100%" }, paddingTop: 2 }}>{renderTableOk()}</Box>
    </Box>
  );
}

export default ReversaView;

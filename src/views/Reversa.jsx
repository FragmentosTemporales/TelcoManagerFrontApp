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
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import SearchIcon from "@mui/icons-material/Search";
import { BarChart } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getReversas,
  updateReversas,
  fetchReversas,
} from "../api/logisticaAPI";
import extractDate from "../helpers/main";
import ReversaCharts from "../components/reversaCharts";

function ReversaView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [rut, setRut] = useState("");
  const [serie, setSerie] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(undefined);
  const [reversa, setReversa] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [frecuencia, setFrecuencia] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [showTableOk, setShowTableOk] = useState(false);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity={severity} sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  const toggleTableOK = () => {
    setShowTableOk((prev) => !prev);
  };

  const fetchTecnicos = async () => {
    try {
      const response = await fetchReversas(token);
      const transformedOptions = response.map((item) => ({
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
    setIsSubmitting(true);
    e.preventDefault();
    setLoading(true);
    const payload = rut;
    try {
      const response = await getReversas(token, payload);

      setData(response.data.filter((item) => item.entregado !== 1));
      setReversa(response.data.filter((item) => item.entregado !== 0));
      setSerie("");

      const formatted = response.data.map((item) => ({
        print: 0,
        entrega: item.entregado !== undefined ? item.entregado : 1,
        fuente: item.fuente !== undefined ? item.fuente : 1,
        id: item.id,
      }));
      setFormattedData(formatted);
      setLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      setSeverity("error");
      setMessage("Error al obtener la información");
      setOpen(true);
      setIsSubmitting(false);
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
      const res = await updateReversas(token, formattedData);
      setIsSubmitting(false);
      setSeverity("success");
      setMessage("Información actualizada correctamente");
      setOpen(true);
      setSerie("");
    } catch (error) {
      setSeverity("error");
      setMessage("Error al actualizar la información");
      setOpen(true);
      setIsSubmitting(false);
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
            sx={{ background:"#0b2f6d", color: "white", fontSize: "12px" }}
          >
            <Typography fontWeight="bold">{header}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => {
    if (!data || data.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              <Typography fontFamily="initial">
                No hay datos disponibles
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    const renderRow = (item) => {
      const formattedItem = formattedData.find((i) => i.id === item.id) || {};
      return (
        <TableRow key={item.id}>
          <TableCell align="center" sx={{ fontSize: "12px" }}>
            <Typography fontFamily="initial">
              {item.fecha ? extractDate(item.fecha) : "Sin Información"}
            </Typography>
          </TableCell>
          <TableCell align="center" sx={{ fontSize: "12px" }}>
            <Typography fontFamily="initial">
              {item.orden ? item.orden : "Sin Información"}
            </Typography>
          </TableCell>
          <TableCell align="center" sx={{ fontSize: "12px" }}>
            <Typography fontFamily="initial">
              {item.ANI ? item.ANI : "Sin Información"}
            </Typography>
          </TableCell>
          <TableCell align="center" sx={{ fontSize: "12px" }}>
            <Typography fontFamily="initial">
              {item.equipo ? item.equipo : "Sin Información"}
            </Typography>
          </TableCell>
          <TableCell align="center" sx={{ fontSize: "12px" }}>
            <Typography fontFamily="initial">
              {item.serie ? item.serie : "Sin Información"}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Checkbox
              checked={formattedItem.entrega === 1}
              onChange={() => handleCheckboxChange(item.id, "entrega")}
            />
          </TableCell>
          <TableCell align="center">
            <Checkbox
              checked={formattedItem.fuente === 1}
              onChange={() => handleCheckboxChange(item.id, "fuente")}
            />
          </TableCell>
        </TableRow>
      );
    };

    return (
      <TableBody>{serie ? renderRow(serie) : data.map(renderRow)}</TableBody>
    );
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
                  <Typography fontFamily="initial">
                    {item.fecha ? extractDate(item.fecha) : "Sin información"}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">
                    {item.orden ? item.orden : "Sin información"}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">
                    {item.ANI ? item.ANI : "Sin información"}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">
                    {item.equipo ? item.equipo : "Sin información"}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Typography fontFamily="initial">
                    {item.serie ? item.serie : "Sin información"}
                  </Typography>
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
              <Typography fontFamily="initial">
                No hay datos disponibles
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  const renderBtn = () => {
    if (data && data.length > 0) {
      return (
        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", width: "200px", borderRadius: "0px" }}
            onClick={handleSubmitUpdate}
            disabled={isSubmitting}
          >
            <Typography>
              {isSubmitting ? "Procesando..." : "Actualizar"}
            </Typography>
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
        <TableContainer
          component={Paper}
          sx={{ width: "100%", height: "100%", overflow: "auto" }}
        >
          <Table stickyHeader>
            {renderTableHeaders()}
            {renderTableBody()}
          </Table>
        </TableContainer>
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
      <Card sx={{ borderRadius: "0px" }}>
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              LISTA DE REVERSAS ENTREGADAS
            </Typography>
          }
          avatar={<PlaylistAddCheckIcon />}
          action={
            <Button
              onClick={toggleTableOK}
              sx={{ color: "white", minWidth: "auto" }}
            >
              {showTableOk ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        {showTableOk && (
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              {renderTableHeaders()}
              {renderTableBodyOk()}
            </Table>
          </TableContainer>
        )}
      </Card>
    );
  };

  const filterReversa = () => (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "2px solid #dfdeda",
        pb: 2,
      }}
    >
      <FormControl>
        <Autocomplete
          sx={{ width: "300px" }}
          options={data}
          getOptionLabel={(option) => option.serie}
          value={data.find((option) => option.serie === serie) || null}
          onChange={(event, newValue) => setSerie(newValue || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<Typography fontFamily="initial">Series</Typography>}
              variant="standard"
            />
          )}
        />
      </FormControl>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 8,
        mt: 2,
        backgroundColor: "#f5f5f5",
        minHeight: "95vh",
      }}
    >
      {open && renderAlert()}

      <Box
        sx={{
          width: { lg: "80%", md: "90%", xs: "100%" },
          paddingBottom: 2,
        }}
      >
        <ReversaCharts />
      </Box>

      <Box
        sx={{
          width: { lg: "80%", md: "90%", xs: "100%" },
          backgroundColor: "#fff",
          borderRadius: 2,
          border: "2px solid #dfdeda",
          pt: 4,
          pb: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ textAlign: "center", mb: 4 }}
        >
          CONSULTA DE REVERSAS
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Select
              sx={{ width: "50%" }}
              size="small"
              variant="standard"
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="MARTES">MARTES</MenuItem>
              <MenuItem value="MIERCOLES">MIÉRCOLES</MenuItem>
              <MenuItem value="JUEVES">JUEVES</MenuItem>
              <MenuItem value="VIERNES">VIERNES</MenuItem>
            </Select>
          </Box>

          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignContent: "center",
            }}
          >
            <Autocomplete
              sx={{ width: "50%" }}
              size="small"
              variant="standard"
              options={filteredTecnicos}
              getOptionLabel={(option) => option.label}
              value={
                filteredTecnicos.find((option) => option.value === rut) || null
              }
              onChange={(event, newValue) => setRut(newValue?.value || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<Typography>Técnico</Typography>}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#0b2f6d", width: "200px", mt: 2 }}
              disabled={isSubmitting}
            >
              <Typography>
                {isSubmitting ? "Procesando..." : "Consultar"}
              </Typography>
            </Button>
          </Box>
        </form>
      </Box>

      <Box sx={{ width: { lg: "80%", md: "90%", xs: "100%" }, paddingTop: 2 }}>
        {data && data.length > 0 ? filterReversa() : null}
      </Box>

      <Box sx={{ width: { lg: "80%", md: "90%", xs: "100%" } }}>
        {renderTable()}
      </Box>
      {renderBtn()}
      <Box sx={{ width: { lg: "80%", md: "90%", xs: "100%" }, paddingTop: 2 }}>
        {renderTableOk()}
      </Box>
    </Box>
  );
}

export default ReversaView;

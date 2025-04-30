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
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getReversas, updateReversas, fetchReversas } from "../api/logisticaAPI";
import extractDate from "../helpers/main";

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
            sx={{ background: "#d8d8d8", fontWeight: "bold" }}
          >
            <Typography fontFamily="initial">{header}</Typography>
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
            sx={{ background: "#0b2f6d", width: "300px", borderRadius: '20px' }}
            onClick={handleSubmitUpdate}
            disabled={isSubmitting}
          >
            <Typography fontFamily="initial">
              {isSubmitting ? "Procesando..." : "Actualizar Información"}
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
      <Card sx={{ borderRadius: "20px" }}>
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              LISTA DE REVERSAS PENDIENTES
            </Typography>
          }
          avatar={<PlaylistRemoveIcon />}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
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
      <Card sx={{ borderRadius: "20px" }}>
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
    <Card sx={{ borderRadius: "20px", marginBottom: 2 }}>
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            FILTRO SEGUN SERIE
          </Typography>
        }
        avatar={<SearchIcon />}
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      <CardContent
        sx={{
          height: "100%",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          margin: 1,
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            width: "500px",
          }}
        >
          <FormControl fullWidth variant="filled">
            <Autocomplete
              fullWidth
              options={data}
              getOptionLabel={(option) => option.serie}
              value={data.find((option) => option.serie === serie) || null}
              onChange={(event, newValue) => setSerie(newValue || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<Typography fontFamily="initial">Series</Typography>}
                  variant="filled"
                  fullWidth
                />
              )}
            />
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "85vh",
        width: "100%",
        paddingTop: 8,
        mt: 2,
      }}
    >
      {open && renderAlert()}

      <Box
        sx={{
          width: { lg: "80%", md: "90%", xs: "100%" },
        }}
      >
        <Card sx={{ borderRadius: "20px", width: "100%" }}>
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                BUSCAR SERIE
              </Typography>
            }
            avatar={<SearchIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <FormControl sx={{ width: "50%" }} variant="filled">
                  <InputLabel>
                    <Typography fontFamily="initial">Frecuencia</Typography>
                  </InputLabel>
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
                  width: "100%",
                  alignContent: "center",
                }}
              >
                <Autocomplete
                  sx={{ width: "50%" }}
                  options={filteredTecnicos}
                  getOptionLabel={(option) => option.label}
                  value={
                    filteredTecnicos.find((option) => option.value === rut) ||
                    null
                  }
                  onChange={(event, newValue) => setRut(newValue?.value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <Typography fontFamily="initial">Técnico</Typography>
                      }
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
                  disabled={isSubmitting}
                >
                  <Typography fontFamily="initial">
                    {isSubmitting ? "Procesando..." : "Consultar"}
                  </Typography>
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
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

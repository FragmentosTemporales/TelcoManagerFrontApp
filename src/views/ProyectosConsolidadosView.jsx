import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  CardContent,
  CardHeader,
  MenuItem,
  Paper,
  Skeleton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getProyectosFiltrados,
  getOptionToFilter,
  sendPlantillaAgendaProyecto,
} from "../api/onnetAPI";
import ProyectosCharts from "../components/proyectosCharts";

function ProyectosOnNetView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [alertType, setAlertType] = useState("info");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [toFilter, setToFilter] = useState({
    proyecto: "",
    bandeja: "",
    categoria: "",
    agencia: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLoaders, setShowLoaders] = useState(false);

  const [optionsToFilter, setOptionsToFilter] = useState([]);

  const categorias = [
    { value: "Menor a 5 días", label: "Menor a 5 días" },
    { value: "Entre 5 y 10 días", label: "Entre 5 y 10 días" },
    { value: "Entre 10 y 15 días", label: "Entre 10 y 15 días" },
    { value: "Entre 15 y 30 días", label: "Entre 15 y 30 días" },
    { value: "Mayor a 30 días", label: "Mayor a 30 días" },
  ];

  const agencias = [
    "CURICO",
    "CENTRO",
    "RANCAGUA",
    "ANTOFAGASTA",
    "PROVIDENCIA",
    "CALAMA",
    "HUALPEN",
    "MELIPILLA",
    "PUENTE ALTO",
    "PENAFLOR",
    "LOS ANGELES",
    "INDEPENDENCIA",
    "VIÑA DEL MAR",
    "CHIGUAYANTE",
    "LAS REJAS",
    "VALDIVIA",
    "CONCEPCION",
    "VALPARAISO",
    "QUILPUE",
    "SAN ANTONIO",
    "APOQUINDO",
    "LOS ANDES",
    "NUNOA",
    "EL LLANO",
    "QUILLOTA",
    "MAIPU",
    "CHILLAN",
    "LA FLORIDA",
    "SAN BERNARDO",
    "TALCAHUANO",
    "VINA DEL MAR",
    "TALCA",
  ];

  const [formAgendas, setFormAgendas] = useState({
    file: null,
  });

  const [formVisitas, setFormVisitas] = useState({
    file: null,
  });

  const handleSubmitVisitas = async (e) => {
    
  };

  const handleSubmitAgendas = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    if (formAgendas.file) {
      formData.append("file", formAgendas.file);
    }
    try {
      const response = await sendPlantillaAgendaProyecto(formData, token);
      console.log(response);
      setAlertType("success");
      setMessage("Archivo cargado correctamente.");
      setOpen(true);
    } catch (error) {
      // Manejo de error específico si el archivo está abierto por otro proceso
      let errorMsg = error?.message || error;
      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("used by another process") ||
          errorMsg.includes("no se puede obtener acceso al archivo") ||
          errorMsg.includes("Failed to load"))
      ) {
        errorMsg =
          "No se pudo cargar el archivo porque está abierto en otra aplicación. Por favor, cierre el archivo e intente nuevamente.";
      }
      setMessage(errorMsg);
      setAlertType("error");
      setOpen(true);
    } finally {
      setIsSubmitting(false);
      setFormVisitas({ file: null }); // Limpiar el formulario después de enviar
    }
  };

  const handleFileChangeAgendas = (e) => {
    setFormAgendas({
      file: e.target.files[0],
    });
  };

  const handleFileChangeVisitas = (e) => {
    setFormVisitas({
      file: e.target.files[0],
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getProyectosFiltrados(token, toFilter, page);
      setPages(response.pages);
      setData(response.data);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const fetchDataOptions = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getOptionToFilter(token);
      // Mapear los resultados al formato requerido
      const mapped = Array.isArray(response)
        ? response.map((opt) => ({
            value: opt.bandeja_onnet || "",
            label: opt.bandeja_onnet || "",
          }))
        : [];
      setOptionsToFilter(mapped);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleLoaders = () => {
    setShowLoaders((prev) => !prev);
  };

  const handlePage = (newPage) => setPage(newPage);

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

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      setToFilter({ bandeja: "", categoria: "" });
      setPage(1); // Reset to the first page
      await getProyectosFiltrados(
        token,
        { bandeja: "", categoria: "" },
        1
      ).then((res) => {
        setPages(res.pages);
        setData(res.data);
      });
    } catch (error) {
      setMessage("Error al limpiar los filtros.");
      setOpen(true);
    }
  };

  const loaderCard = () => (
    <Card
      sx={{
        width: { lg: "90%", md: "100%", xs: "100%" },
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "20px",
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            CARGAR INFORMACIÓN
          </Typography>
        }
        avatar={<DriveFolderUploadIcon />}
        action={
          <Button
            onClick={toggleLoaders}
            sx={{ color: "white", minWidth: "auto" }}
          >
            {showLoaders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      {showLoaders && (
        <CardContent>
          <Box
            sx={{
              minHeight: "100px",
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "space-evenly",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "50%",
                boxShadow: 2,
                borderRadius: "10px",
              }}
            >
              <Box>
                <InputLabel id="file-label">Agendas</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="file"
                  type="file"
                  name="file"
                  variant="outlined"
                  onChange={handleFileChangeAgendas}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "200px",
                    borderRadius: "20px",
                  }}
                  onClick={handleSubmitAgendas}
                >
                  {isSubmitting ? "Procesando..." : "Cargar"}
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "50%",
                boxShadow: 2,
                borderRadius: "10px",
              }}
            >
              <Box>
                <InputLabel id="file-label">Visitas</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="file"
                  type="file"
                  name="file"
                  variant="outlined"
                  onChange={handleFileChangeVisitas}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: "#0b2f6d",
                    fontWeight: "bold",
                    width: "200px",
                    borderRadius: "20px",
                  }}
                  disabled
                >
                  {isSubmitting ? "Procesando..." : "Cargar"}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      )}
    </Card>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const filterCard = () => (
    <Card
      sx={{
        width: { lg: "90%", md: "100%", xs: "100%" },
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "20px",
        mt: 2,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            FILTRAR PROYECTOS
          </Typography>
        }
        avatar={<SearchIcon />}
        action={
          <Button
            onClick={toggleFilters}
            sx={{ color: "white", minWidth: "auto" }}
          >
            {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      {showFilters && (
        <CardContent>
          <form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* Primera fila: ambos selects */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <FormControl>
                  <TextField
                    label="Proyecto"
                    id="proyecto-textfield"
                    value={toFilter.proyecto || ""}
                    sx={{ minWidth: "200px" }}
                    size="small"
                    onChange={(event) => {
                      setToFilter((prev) => ({
                        ...prev,
                        proyecto: event.target.value,
                      }));
                    }}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel id="bandeja-label">Bandeja</InputLabel>
                  <Select
                    label="bandeja-label"
                    id="bandeja-select"
                    value={toFilter.bandeja || ""}
                    sx={{ minWidth: "200px" }}
                    size="small"
                    onChange={(event) => {
                      setToFilter((prev) => ({
                        ...prev,
                        bandeja: event.target.value,
                      }));
                    }}
                  >
                    {optionsToFilter.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id="agencia-label">Agencia</InputLabel>
                  <Select
                    label="agencia-label"
                    id="agencia-select"
                    value={toFilter.agencia || ""}
                    sx={{ minWidth: "200px" }}
                    size="small"
                    onChange={(event) => {
                      setToFilter((prev) => ({
                        ...prev,
                        agencia: event.target.value,
                      }));
                    }}
                  >
                    {agencias &&
                      agencias.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id="categoria-label">Categoria</InputLabel>
                  <Select
                    labelId="categoria-label"
                    id="categoria-select"
                    value={toFilter.categoria || ""}
                    sx={{ minWidth: "200px" }}
                    size="small"
                    onChange={(event) => {
                      setToFilter((prev) => ({
                        ...prev,
                        categoria: event.target.value,
                      }));
                    }}
                  >
                    {categorias.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Segunda fila: ambos botones */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleClear}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    minWidth: "200px",
                    height: "40px",
                    borderRadius: "20px",
                  }}
                >
                  LIMPIAR FILTROS
                </Button>
                <Button
                  variant="contained"
                  onClick={fetchData}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    minWidth: "200px",
                    height: "40px",
                    borderRadius: "20px",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Actualizar"}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      )}
    </Card>
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
            "PROYECTO",
            "BANDEJA",
            "CENTRAL FTTX",
            "AGENCIA",
            "DESPLIEGUE",
            "(Q) DÍAS",
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#d8d8d8",
                fontWeight: "bold",
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
            <TableRow
              key={index}
              component={Link}
              to={`/consolidado/${row.proyecto}`}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
              }}
            >
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.proyecto ? row.proyecto : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.bandeja_onnet ? row.bandeja_onnet : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.central_fttx ? row.central_fttx : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.agencia ? row.agencia : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.despliegue ? row.despliegue : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.duracion_dias ? row.duracion_dias : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchDataOptions();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "auto",
        paddingBottom: "50px",
        minHeight: "80vh",
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType || "info"}
          sx={{ mt: 10, mb: 3, width: "90%" }}
        >
          {message || "Mensaje de alerta por defecto"}
        </Alert>
      )}
      <Box
        sx={{
          width: { lg: "90%", md: "100%", xs: "100%" },
          marginBottom: 2,
          paddingTop: 10,
        }}
      >
        <ProyectosCharts />
      </Box>

      {loaderCard()}
      {filterCard()}

      <Card
        sx={{
          width: { lg: "90%", md: "100%", xs: "100%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Lista de Proyectos</Typography>}
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

export default ProyectosOnNetView;

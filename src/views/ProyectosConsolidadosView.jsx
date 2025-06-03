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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProyectosFiltrados, getOptionToFilter } from "../api/onnetAPI";
import ProyectosCharts from "../components/proyectosCharts";

function ProyectosOnNetView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [alertType, setAlertType] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [toFilter, setToFilter] = useState({
    proyecto: "",
    bandeja: "",
    categoria: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [optionsToFilter, setOptionsToFilter] = useState([]);

  const categorias = [
    { value: "Menor a 5 días", label: "Menor a 5 días" },
    { value: "Entre 5 y 10 días", label: "Entre 5 y 10 días" },
    { value: "Entre 10 y 15 días", label: "Entre 10 y 15 días" },
    { value: "Entre 15 y 30 días", label: "Entre 15 y 30 días" },
    { value: "Mayor a 30 días", label: "Mayor a 30 días" },
  ];

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
      await getProyectosFiltrados(token, { bandeja: "", categoria: "" }, 1).then(
        (res) => {
          setPages(res.pages);
          setData(res.data);
        }
      );
    } catch (error) {
      setMessage("Error al limpiar los filtros.");
      setOpen(true);
    }
  };

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
          severity={alertType}
          onClose={handleClose}
          sx={{ marginBottom: 3 }}
        >
          {message}
        </Alert>
      )}
      <Box
        sx={{
          width: { lg: "90%", md: "100%", xs: "100%" },
          marginBottom: 2,
          paddingTop: 8,
        }}
      >
        <ProyectosCharts />
      </Box>
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

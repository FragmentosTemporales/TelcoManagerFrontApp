import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import {
  getAuditoriasFiltradas,
  getAllAuditorias,
  getAuditores,
} from "../api/calidadAPI";
import { useSelector } from "react-redux";
import AuditoriaCharts from "../components/auditoriaCharts";

function AuditoriasView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [toFilter, setToFilter] = useState({
    orden: "",
    estado: "",
    fechaCierre: "",
    nombre: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [auditores, setAuditores] = useState([]);

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleStats = () => {
    setShowStats((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToFilter((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlePage = (newPage) => setPage(newPage);

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      setToFilter({ orden: "", estado: "", fechaCierre: "", nombre: "" });
      setPage(1); // Reset to the first page
      await getAuditoriasFiltradas(token, toFilter, 1).then((res) => {
        setData(res.data);
        setToFilter({ orden: "", estado: "", fechaCierre: "", nombre: "" });
      });
    } catch (error) {
      setMessage(error);
      setAlertType("error");
      setOpen(true);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getAuditoriasFiltradas(token, toFilter, page);
      setData(response.data);
      setPages(response.pages);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setToFilter({ orden: "", estado: "", fechaCierre: "", nombre: "" });
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const fetchAuditores = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getAuditores(token);
      setAuditores(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setTable = () => (
    <TableContainer>
      <Table
        sx={{ width: "100%", display: "column", justifyContent: "center" }}
      >
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  const getExcel = async () => {
    try {
      await getAllAuditorias(token);
    } catch (error) {
      console.log(error);
    }
  };

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["FECHA CREACION", "ORDEN", "AUDITOR", "ESTADO", "FECHA CIERRE"].map(
            (header) => (
              <TableCell
                key={header}
                align="center"
                sx={{
                  background: "#d8d8d8",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {header}
              </TableCell>
            )
          )}
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
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "20%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaRegistro
                    ? extractDate(row.fechaRegistro)
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "20%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.orden ? row.orden : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "20%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.auditor ? row.auditor : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "20%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.auditoria ? row.auditoria : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", width: "20%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaCierre
                    ? extractDate(row.fechaCierre)
                    : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const filterCard = () => (
    <Card
      sx={{
        width: "80%",
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
            FILTRAR
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
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <InputLabel
                    id="auditoria-label"
                    sx={{
                      fontFamily: "initial",
                      whiteSpace: "normal",
                      textAlign: "center",
                    }}
                  >
                    Orden de Trabajo
                  </InputLabel>
                  <TextField
                    sx={{
                      fontFamily: "initial",
                      width: "100%",
                      background: "#ffffff",
                    }}
                    size="small"
                    required
                    id="orden"
                    type="text"
                    name="orden"
                    variant="outlined"
                    value={toFilter.orden}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <InputLabel
                    id="auditoria-label"
                    sx={{
                      fontFamily: "initial",
                      whiteSpace: "normal",
                      textAlign: "center",
                    }}
                  >
                    Fecha Cierre
                  </InputLabel>
                  <TextField
                    sx={{
                      fontFamily: "initial",
                      width: "100%",
                      background: "#ffffff",
                    }}
                    size="small"
                    required
                    id="fechaCierre"
                    type="date"
                    name="fechaCierre"
                    variant="outlined"
                    value={toFilter.fechaCierre}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <InputLabel
                    id="auditoria-label"
                    sx={{
                      fontFamily: "initial",
                      whiteSpace: "normal",
                      textAlign: "center",
                    }}
                  >
                    Resultado de la Auditoría
                  </InputLabel>
                  <Select
                    sx={{
                      fontFamily: "initial",
                      width: "100%",
                      background: "#ffffff",
                    }}
                    size="small"
                    required
                    id="estado"
                    name="estado"
                    variant="outlined"
                    value={toFilter.estado}
                    onChange={handleChange}
                  >
                    <MenuItem value="CUMPLE" sx={{ fontFamily: "initial" }}>
                      CUMPLE
                    </MenuItem>
                    <MenuItem
                      value="CUMPLE CON OBSERVACIONES"
                      sx={{ fontFamily: "initial" }}
                    >
                      CUMPLE CON OBSERVACIONES
                    </MenuItem>
                    <MenuItem value="NO CUMPLE" sx={{ fontFamily: "initial" }}>
                      NO CUMPLE
                    </MenuItem>
                    <MenuItem value="SIN CONTACTO" sx={{ fontFamily: "initial" }}>
                      SIN CONTACTO
                    </MenuItem>
                  </Select>
                </Box>
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <InputLabel
                    id="auditoria-label"
                    sx={{
                      fontFamily: "initial",
                      whiteSpace: "normal",
                      textAlign: "center",
                    }}
                  >
                    Nombre Auditor
                  </InputLabel>
                  <Select
                    sx={{
                      fontFamily: "initial",
                      width: "100%",
                      background: "#ffffff",
                    }}
                    size="small"
                    required
                    id="nombre"
                    name="nombre"
                    variant="outlined"
                    value={toFilter.nombre}
                    onChange={handleChange}
                  >
                    {auditores.map((auditor) => (
                      <MenuItem
                        key={auditor.nombre}
                        value={auditor.nombre}
                        sx={{ fontFamily: "initial" }}
                      >
                        {auditor.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                  mt: 2,
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

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchAuditores();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        overflow: "auto",
        padding: 8,
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
          width: "80%",
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={getExcel}
          sx={{
            fontWeight: "bold",
            background: "#0b2f6d",
            minWidth: "200px",
            height: "40px",
            borderRadius: "20px",
          }}
        >
          DESCARGAR
        </Button>
      </Box>

      <Card
        sx={{
          width: "80%",
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              ESTADISTICA
            </Typography>
          }
          avatar={<BarChartIcon />}
          action={
            <Button
              onClick={toggleStats}
              sx={{ color: "white", minWidth: "auto" }}
            >
              {showStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        {showStats && (
          <CardContent sx={{ display: "grid" }}>
            <AuditoriaCharts />
          </CardContent>
        )}
      </Card>

      {filterCard()}

      <Card
        sx={{
          width: "80%",
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              LISTA DE AUDITORIAS
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
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
export default AuditoriasView;

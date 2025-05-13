import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getAllBacklog, CreateBacklogPriority } from "../api/backlogAPI";
import { useSelector } from "react-redux";

function AllBacklogView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({
    zona_de_trabajo: "",
    RGUFinal: "",
    tipo_de_actividad: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    fetchData();
  };

  const handlePage = (newPage) => setPage(newPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const clearFilter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      setForm({
        zona_de_trabajo: "",
        RGUFinal: "",
        tipo_de_actividad: "",
      });
      setPage(1);
      await getAllBacklog(token, 1, {
        zona_de_trabajo: "",
        RGUFinal: "",
        tipo_de_actividad: "",
      }).then((res) => {
        setData(res.data);
        setPages(res.pages);
      });
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsSubmitting(false)
  };

  const createPriority = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await CreateBacklogPriority(token, form);
      console.log(response);
      setAlertType("success");
      setMessage("Prioridad creada correctamente");
      setOpen(true);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getAllBacklog(token, page, form);
      console.log(response.data);
      setData(response.data);
      setPages(response.pages);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            "Orden de Trabajo",
            "Actividad",
            "Zona de Trabajo",
            "Marca",
            "Fecha",
            "Zona",
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
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.orden_de_trabajo
                    ? row.orden_de_trabajo
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.tipo_de_actividad
                    ? row.tipo_de_actividad
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.zona_de_trabajo
                    ? row.zona_de_trabajo
                    : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Marca ? row.Marca : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Fecha ? row.Fecha : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Zona ? row.Zona : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
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

      <Card
        sx={{
          width: { lg: "80%", md: "100%", xs: "100%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Filtrar</Typography>}
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
            textAlign: "center",
          }}
        />
        {showFilters && (
          <CardContent sx={{ display: "grid" }}>
            <form onSubmit={SubmitForm}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    width: "30%",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="zona_de_trabajo-label">
                      Zona de Trabajo
                    </InputLabel>
                    <Select
                      labelId="zona_de_trabajo-label"
                      id="zona_de_trabajo"
                      name="zona_de_trabajo"
                      value={form?.zona_de_trabajo || ""}
                      onChange={handleChange}
                    >
                      {["La Florida", "Nunoa", "Quilpue", "Villa Alemana"].map(
                        (zona) => (
                          <MenuItem key={zona} value={zona}>
                            {zona}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    width: "30%",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="RGUFinal-label">RGU Final</InputLabel>
                    <Select
                      labelId="RGUFinal-label"
                      id="RGUFinal"
                      name="RGUFinal"
                      value={form?.RGUFinal || ""}
                      onChange={handleChange}
                    >
                      {["1", "2", "3"].map((zona) => (
                        <MenuItem key={zona} value={zona}>
                          {zona}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    mb: 2,
                    width: "30%",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="RGUFinal-label">
                      Tipo de Actividad
                    </InputLabel>
                    <Select
                      labelId="tipo_de_actividad-label"
                      id="tipo_de_actividad"
                      name="tipo_de_actividad"
                      value={form?.tipo_de_actividad || ""}
                      onChange={handleChange}
                    >
                      {[
                        "Alta",
                        "Alta Traslado",
                        "Downgrade promoción",
                        "Migración",
                        "Modificación de Servicio",
                        "Modificacion postventa",
                        "Reparación",
                        "Upgrade promoción",
                      ].map((zona) => (
                        <MenuItem key={zona} value={zona}>
                          {zona}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      background: "#0b2f6d",
                      height: 30,
                      width: "100%",
                      borderRadius: "20px",
                    }}
                  >
                    {isSubmitting ? "Cargando..." : "Buscar"}
                  </Button>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={clearFilter}
                    sx={{ height: 30, width: "100%", borderRadius: "20px" }}
                  >
                    Limpiar Filtro
                  </Button>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={createPriority}
                    sx={{ height: 30, width: "100%", borderRadius: "20px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Cargando..." : "Crear Prioridad"}
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        )}
      </Card>

      <Card
        sx={{
          width: { lg: "80%", md: "100%", xs: "100%" },
          borderRadius: "20px",
          boxShadow: 5,
          marginTop: 2,
        }}
      >
        <CardHeader
          title={<Typography fontWeight="bold">Lista de Backlog</Typography>}
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
export default AllBacklogView;

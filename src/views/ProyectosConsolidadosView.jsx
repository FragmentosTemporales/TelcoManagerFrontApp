import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Skeleton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getProyectosFiltrados,
  getOptionToFilter,
  sendPlantillaAgendaProyecto,
  getQMacroEstado,
  getQProyectosConResponsable,
  getQProyectosSinResponsable,
} from "../api/onnetAPI";

function ProyectosOnNetView() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [alertType, setAlertType] = useState("info");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataMacro, setDataMacro] = useState([]);
  const [dataProyectoSin, setDataProyectoSin] = useState([]);
  const [dataProyectoCon, setDataProyectoCon] = useState([]);
  const [toFilter, setToFilter] = useState({
    proyecto: "",
    bandeja: "",
    categoria: "",
    agencia: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const handleSubmitVisitas = async (e) => {};

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

  const fetchDataMacro = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getQMacroEstado(token);
      setDataMacro(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const fetchDataProyectosCon = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getQProyectosConResponsable(token);
      setDataProyectoCon(response);
    } catch (error) {
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const fetchDataProyectosSin = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getQProyectosSinResponsable(token);
      setDataProyectoSin(response);
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
            value: opt.macro_estado || "",
            label: opt.macro_estado || "",
          }))
        : [];
      setOptionsToFilter(mapped);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setIsSubmitting(false);
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
    <Box
      sx={{
        minHeight: "100px",
        display: "flex",
        flexDirection: { lg: "row", md: "column", xs: "column" },
        gap: 2,
        alignItems: "space-evenly",
        width: "90%",
        mb: 2,
      }}
    >
      <Box
        sx={{
          pt: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: { lg: "50%", md: "100%", xs: "100%" },
          boxShadow: 2,
          borderRadius: "0px",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ pb: 2 }}>
          <InputLabel id="file-label">Agendas</InputLabel>
          <TextField
            required
            size="small"
            fullWidth
            id="file"
            type="file"
            name="file"
            variant="standard"
            onChange={handleFileChangeAgendas}
          />
        </Box>
        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              background: "#0b2f6d",
              fontWeight: "bold",
              width: "200px",
              borderRadius: "0px",
            }}
            onClick={handleSubmitAgendas}
          >
            {isSubmitting ? "Procesando..." : "Cargar"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          pt: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: { lg: "50%", md: "100%", xs: "100%" },
          boxShadow: 2,
          borderRadius: "0px",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ pb: 2 }}>
          <InputLabel id="file-label">Visitas</InputLabel>
          <TextField
            required
            size="small"
            fullWidth
            id="file"
            type="file"
            name="file"
            variant="standard"
            onChange={handleFileChangeVisitas}
          />
        </Box>
        <Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "#0b2f6d",
              fontWeight: "bold",
              width: "200px",
              borderRadius: "0px",
            }}
            disabled
          >
            {isSubmitting ? "Procesando..." : "Cargar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const filterCard = () => (
    <Box
      sx={{
        width: "90%",
        mb: 2,
        mt: 2,
        backgroundColor: "#fff",
        pt: 2,
        pb: 2,
        boxShadow: 2,
      }}
    >
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
                variant="standard"
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
                variant="standard"
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
                variant="standard"
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
                variant="standard"
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
              pt: 2,
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
                borderRadius: "0px",
              }}
            >
              LIMPIAR FILTROS
            </Button>
            <Button
              variant="outlined"
              onClick={fetchData}
              sx={{
                fontWeight: "bold",
                minWidth: "200px",
                height: "40px",
                borderRadius: "0px",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Actualizar"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );

  const setTableProyectosSin = () => (
    <Box sx={{width: "100%" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Cantidad de proyectos sin responsable asignado
      </Typography>
      <TableContainer sx={{ boxShadow: 2, borderRadius: "0px" }}>
        <Table>
          {setTableHeadProyectosSin()}
          {setTableBodyProyectosSin()}
        </Table>
      </TableContainer>
    </Box>
  );

  const setTableHeadProyectosSin = () => (
    <>
      <TableHead>
        <TableRow>
          {["CANTIDAD", "ESTADO", "REGION"].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBodyProyectosSin = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        {dataProyectoSin && dataProyectoSin.length > 0 ? (
          dataProyectoSin.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.region ? row.region : "Sin Información"}
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

  const setTableProyectosCon = () => (
    <Box sx={{width: "100%", mb: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Cantidad de proyectos con responsable asignado
      </Typography>
      <TableContainer sx={{ boxShadow: 2, borderRadius: "0px" }}>
        <Table>
          {setTableHeadProyectosCon()}
          {setTableBodyProyectosCon()}
        </Table>
      </TableContainer>
    </Box>
  );

  const setTableHeadProyectosCon = () => (
    <>
      <TableHead>
        <TableRow>
          {["CANTIDAD", "ESTADO", "REGION"].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBodyProyectosCon = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        {dataProyectoCon && dataProyectoCon.length > 0 ? (
          dataProyectoCon.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.region ? row.region : "Sin Información"}
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

  const setTableMacro = () => (
    <Box sx={{width: "100%" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Cantidades por estado y región
      </Typography>
      <TableContainer sx={{ boxShadow: 2, borderRadius: "0px" }}>
        <Table>
          {setTableHeadMacro()}
          {setTableBodyMacro()}
        </Table>
      </TableContainer>
    </Box>
  );

  const setTableHeadMacro = () => (
    <>
      <TableHead>
        <TableRow>
          {["CANTIDAD", "ESTADO", "REGION"].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBodyMacro = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        {dataMacro && dataMacro.length > 0 ? (
          dataMacro.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.region ? row.region : "Sin Información"}
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
            "RESPONSABLE",
            "ASIGNACIÓN",
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                color: "white",
                fontSize: "14px",
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
          backgroundColor: "#fff",
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
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.proyecto ? row.proyecto : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.bandeja_onnet ? row.bandeja_onnet : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.central_fttx ? row.central_fttx : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.agencia ? row.agencia : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.despliegue ? row.despliegue : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.duracion_dias ? row.duracion_dias : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.responsable ? row.responsable : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography  variant="secondary">
                  {row.fecha_asignacion ? extractDate(row.fecha_asignacion) : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ width: "100%" }}>
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
    fetchDataMacro();
    fetchDataProyectosCon();
    fetchDataProyectosSin();
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
        paddingTop: "67px",
        backgroundColor: "#f5f5f5",
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

      {loaderCard()}

      <Box
        sx={{
          width: { lg: "90%", md: "90%", xs: "100%" },
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 2,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: "0px",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: {lg: "row", md: "column", xs: "column"},
              alignItems: "start",
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", m:1 }}>
              {setTableMacro()} 
            </Box>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", m:1 }}>
            {setTableProyectosCon()}
            {setTableProyectosSin()}
            </Box>
          </Box>
        )}
      </Box>

      {filterCard()}
      <Box
        sx={{
          width: { lg: "90%", md: "90%", xs: "100%" },
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 2,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: "0px",
            }}
          />
        ) : (
          setTable()
        )}
      </Box>

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

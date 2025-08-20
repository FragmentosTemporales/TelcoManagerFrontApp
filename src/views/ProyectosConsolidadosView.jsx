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
  Paper,
  Divider,
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
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";

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
        sx={{
          bgcolor: palette.primary,
          fontWeight: 600,
          '&:hover': { bgcolor: palette.primaryDark },
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button
        key="current"
        variant="contained"
        sx={{
          bgcolor: palette.primary,
          fontWeight: 600,
          cursor: 'default',
          '&:hover': { bgcolor: palette.primary },
        }}
      >
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{
          bgcolor: palette.primary,
          fontWeight: 600,
          '&:hover': { bgcolor: palette.primaryDark },
        }}
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
      {[{
        label: 'Agendas',
        onChange: handleFileChangeAgendas,
        onClick: handleSubmitAgendas,
        disabled: isSubmitting,
      }, {
        label: 'Visitas',
        onChange: handleFileChangeVisitas,
        onClick: () => {},
        disabled: true,
      }].map((cfg, idx) => (
        <Paper
          key={cfg.label}
          elevation={6}
          sx={{
            pt: 2,
            pb: 2,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: { lg: "50%", md: "100%", xs: "100%" },
            borderRadius: 3,
            position: 'relative',
            background: palette.cardBg,
            border: `1px solid ${palette.borderSubtle}`,
            backdropFilter: 'blur(4px)',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Box sx={{ pb: 1, width: '100%' }}>
            <InputLabel id={`${cfg.label}-label`} sx={{ fontWeight: 600, color: palette.primary }}>{cfg.label}</InputLabel>
            <TextField
              required
              size="small"
              fullWidth
              id={`file-${idx}`}
              type="file"
              name="file"
              variant="standard"
              onChange={cfg.onChange}
              InputProps={{ disableUnderline: false }}
            />
          </Box>
          <Divider flexItem sx={{ width: '100%', borderColor: palette.borderSubtle }} />
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={cfg.disabled}
              sx={{
                bgcolor: palette.primary,
                fontWeight: 600,
                width: "200px",
                borderRadius: 2,
                letterSpacing: .5,
                boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)',
                '&:hover': { bgcolor: palette.primaryDark },
              }}
              onClick={cfg.onClick}
            >
              {isSubmitting && !cfg.disabled ? 'Procesando...' : 'Cargar'}
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const filterCard = () => (
    <Paper
      elevation={8}
      sx={{
        width: "90%",
        mb: 2,
        mt: 3,
        pt: 3,
        pb: 3,
        borderRadius: 3,
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: 'blur(4px)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
        }
      }}
    >
      <form>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-evenly',
              alignItems: 'center',
              gap: 3,
              width: '100%',
            }}
          >
            {[{
              label: 'Proyecto',
              value: toFilter.proyecto || '',
              onChange: (val) => setToFilter((p)=>({...p, proyecto: val}))
            }].map(cfg => (
              <FormControl key={cfg.label} sx={{ minWidth: 200 }}>
                <TextField
                  label={cfg.label}
                  variant="standard"
                  value={cfg.value}
                  size="small"
                  onChange={(e)=>cfg.onChange(e.target.value)}
                />
              </FormControl>
            ))}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="bandeja-label">Bandeja</InputLabel>
              <Select
                label="bandeja-label"
                id="bandeja-select"
                variant="standard"
                value={toFilter.bandeja || ''}
                size="small"
                onChange={(event)=>setToFilter(p=>({...p, bandeja: event.target.value}))}
              >
                {optionsToFilter.map((option)=>(
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="agencia-label">Agencia</InputLabel>
              <Select
                label="agencia-label"
                id="agencia-select"
                variant="standard"
                value={toFilter.agencia || ''}
                size="small"
                onChange={(e)=>setToFilter(p=>({...p, agencia: e.target.value}))}
              >
                {agencias && agencias.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="categoria-label">Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoria-select"
                variant="standard"
                value={toFilter.categoria || ''}
                size="small"
                onChange={(e)=>setToFilter(p=>({...p, categoria: e.target.value}))}
              >
                {categorias.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Divider flexItem sx={{ width: '100%', borderColor: palette.borderSubtle }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              onClick={handleClear}
              sx={{
                fontWeight: 600,
                bgcolor: palette.primary,
                minWidth: 200,
                height: 42,
                letterSpacing: .6,
                boxShadow: '0 4px 12px -3px rgba(0,0,0,.35)',
                '&:hover': { bgcolor: palette.primaryDark },
              }}
            >
              LIMPIAR FILTROS
            </Button>
            <Button
              variant="outlined"
              onClick={fetchData}
              sx={{
                fontWeight: 600,
                minWidth: 200,
                height: 42,
                letterSpacing: .6,
                borderWidth: 2,
                borderColor: palette.primary,
                color: palette.primary,
                '&:hover': { borderColor: palette.accent, color: palette.accent, bgcolor: palette.accentSoft },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Actualizar'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );

  const setTableProyectosSin = () => (
    <Box sx={{ width: "100%" }}>
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
                background: palette.primary,
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
                <Typography variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
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
    <Box sx={{ width: "100%", mb: 2 }}>
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
                background: palette.primary,
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
                <Typography variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
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
    <Box sx={{ width: "100%" }}>
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
                background: palette.primary,
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
                <Typography variant="secondary" fontWeight="bold">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.macro_estado ? row.macro_estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
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
                background: palette.primary,
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
                transition: 'background-color .25s',
                '&:hover': { backgroundColor: palette.accentSoft },
              }}
            >
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.proyecto ? row.proyecto : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.bandeja_onnet ? row.bandeja_onnet : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.central_fttx ? row.central_fttx : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.agencia ? row.agencia : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.despliegue ? row.despliegue : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.duracion_dias ? row.duracion_dias : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.responsable ? row.responsable : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          position: 'relative',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          width: "100%",
          overflow: "auto",
          minHeight: "100vh",
          py: 10,
          px: { xs: 1.5, sm: 2 },
          background: palette.bgGradient,
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
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
            borderRadius: 3,
            textAlign: "center",
            mt: 2,
            background: 'transparent',
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
            <Paper
              elevation={10}
              sx={{
                display: 'flex',
                flexDirection: { lg: 'row', md: 'column', xs: 'column' },
                alignItems: 'flex-start',
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                backdropFilter: 'blur(6px)',
                p: 2,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', m: 1 }}>{setTableMacro()}</Box>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', m: 1 }}>
                {setTableProyectosCon()}
                {setTableProyectosSin()}
              </Box>
            </Paper>
          )}
        </Box>

        {filterCard()}
        <Box
          sx={{
            width: { lg: "90%", md: "90%", xs: "100%" },
            overflow: "hidden",
            textAlign: "center",
            borderRadius: 3,
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
            <Paper
              elevation={10}
              sx={{
                p: 2,
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                borderRadius: 3,
                backdropFilter: 'blur(6px)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none'
                }
              }}
            >
              {setTable()}
            </Paper>
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
    </MainLayout>
  );
}

export default ProyectosOnNetView;

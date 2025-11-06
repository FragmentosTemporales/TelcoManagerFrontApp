import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  LinearProgress,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import {
  getAllAgendamientos,
  filterAgendamiento,
  getDespachosSemenalExcel,
  getDataFuturaAgendamientos
} from "../api/despachoAPI";
import extractDate from "../helpers/main";
import {extractDateOnly} from "../helpers/main";
import { Link } from "react-router-dom";
import palette from "../theme/palette";
import { BarChart } from '@mui/x-charts/BarChart';

function AllAgendamientoViewer() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [alertType, setAlertType] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const handlePage = (newPage) => setPage(newPage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dataChart, setDataChart] = useState(undefined);

  const [dailyData, setDailyData] = useState([]);

  const [verBarChartDaily, setVerBarChartDaily] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [countNombre, setCountNombre] = useState([]);

  // Theming helpers (consistent with AgendamientoView)
  const gradient = palette.bgGradient;
  const glass = {
    position: "relative",
    background: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.80) 100%)`,
    backdropFilter: "blur(14px)",
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: 3,
    boxShadow: "0 8px 28px -4px rgba(0,0,0,0.25)",
    overflow: "hidden",
    "::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
      pointerEvents: "none",
      mixBlendMode: "overlay",
    },
  };
  const headCell = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: ".4px",
    whiteSpace: "nowrap",
  };
  const primaryBtn = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 2,
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    "&:hover": { background: palette.primaryDark },
  };

  const processChartData = (rawData) => {
    const groupedData = rawData.reduce((acc, item) => {
      const date = extractDateOnly(item.fecha);
      acc[date] = (acc[date] || 0) + parseInt(item.Q || 0);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([x, y]) => ({ x, y: parseInt(y) }));
  };

  const processCountNombre = (selectedDate) => {
    if (!dataChart || !selectedDate) return [];
    
    // Filtrar registros del día seleccionado
    const filteredData = dataChart.filter(item => 
      extractDateOnly(item.fecha) === selectedDate
    );
    
    // Agrupar por nombre (despachador)
    const groupedByNombre = filteredData.reduce((acc, item) => {
      const nombre = item.nombre || 'Sin nombre';
      acc[nombre] = (acc[nombre] || 0) + parseInt(item.Q || 0);
      return acc;
    }, {});
    
    return Object.entries(groupedByNombre).map(([nombre, cantidad]) => ({ 
      nombre, 
      cantidad: parseInt(cantidad)
    }));
  };

  const handleBarClick = (event, data) => {
    if (data && data.dataIndex !== undefined) {
      const clickedDate = dailyData[data.dataIndex].x;
      setSelectedDay(clickedDate);
      const nombreData = processCountNombre(clickedDate);
      setCountNombre(nombreData);
    }
  };

  const fetchDataChart = async () => {
    try {
      const response = await getDataFuturaAgendamientos();
      setDataChart(response);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchDataChart();
  }, []);

  useEffect(() => {
    if (dataChart) {
      setDailyData(processChartData(dataChart));
      setVerBarChartDaily(true);
    }
  }, [dataChart]);

  const barChartDaily = () => {
    if (verBarChartDaily === false) return null;

    const dates = dailyData.map(item => item.x);
    const counts = dailyData.map(item => item.y);

    return <> 
    <Box sx={{ ...glass, height: "400px", my:2 }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", textAlign: "center" }}>
        Agendamientos últimos 10 días
      </Typography>
      <Box sx={{ height: "320", px: 2, pb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BarChart
          width={1000}
          height={300}
          layout="horizontal"
          series={[
            {
              data: counts,
              label: 'Cantidad de Agendamientos',
              color: palette.primary,
            },
          ]}
          yAxis={[
            {
              data: dates,
              scaleType: 'band',
              categoryGapRatio: 0.2,
              barGapRatio: 0.1,
            },
          ]}
          xAxis={[
            {
              label: 'Cantidad',
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          margin={{
            left: 100,
            right: 50,
            top: 50,
            bottom: 50,
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 20,
            },
          }}
          onItemClick={handleBarClick}
        />
      </Box>
    </Box>
    </>
  }

  const barChartByDespachador = () => {
    if (!selectedDay || countNombre.length === 0) return null;

    const nombres = countNombre.map(item => item.nombre);
    const cantidades = countNombre.map(item => item.cantidad);

    return (
      <Box sx={{ ...glass, height: "400px", my: 2 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", textAlign: "center" }}>
          Agendamientos por Despachador - {selectedDay}
        </Typography>
        <Box sx={{ height: "320", px: 2, pb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BarChart
            width={1000}
            height={300}
            layout="horizontal"
            series={[
              {
                data: cantidades,
                label: 'Cantidad de Agendamientos',
                color: palette.primary,
              },
            ]}
            yAxis={[
              {
                data: nombres,
                scaleType: 'band',
                categoryGapRatio: 0.2,
                barGapRatio: 0.1,
              },
            ]}
            xAxis={[
              {
                label: 'Cantidad',
                valueFormatter: (value) => Math.round(value).toString(),
                tickNumber: Math.max(...cantidades) <= 10 ? Math.max(...cantidades) + 1 : 10
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
            margin={{
              left: 150,
              right: 50,
              top: 50,
              bottom: 50,
            }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'middle' },
                padding: 20,
              },
            }}
          />
        </Box>
      </Box>
    );
  };


  const getExcel = async () => {
    setIsSubmitting(true);
    try {
      await getDespachosSemenalExcel();
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const downloadExcel = () => (
    <Button
      variant="contained"
      onClick={getExcel}
      disabled={isSubmitting}
      sx={{ ...primaryBtn, minWidth: 200 }}
    >
      {isSubmitting ? "Cargando..." : "Descargar Excel"}
    </Button>
  );

  const [form, setForm] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAgendamientos(page);
      setData(response.data);
      setPages(response.pages);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await filterAgendamiento(
        form.fechaInicio,
        form.fechaFin
      );
      setData(response);
      setPages(1);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearFilter = () => {
    setForm({ fechaInicio: "", fechaFin: "" });
    fetchData();
  };

  const setTable = () => (
    <TableContainer
      sx={{
        maxHeight: 500,
        "::-webkit-scrollbar": { width: 6 },
        "::-webkit-scrollbar-thumb": {
          background: palette.primaryDark,
          borderRadius: 3,
        },
      }}
    >
      <Table
        stickyHeader
        size="small"
        sx={{ tableLayout: "fixed", borderCollapse: "separate" }}
      >
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  const setTableHead = () => (
    <TableHead>
      <TableRow>
        {[
          "FECHA CREACION",
          "ORDEN",
          "ESTADO",
          "FECHA AGENDAMIENTO",
          "AGENDADO POR",
        ].map((h) => (
          <TableCell key={h} align="center" sx={headCell}>
            {h}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const setTableBody = () => (
    <TableBody>
      {data && data.length > 0 ? (
        data.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              backgroundColor:
                index % 2 === 0
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(240,245,250,0.5)",
            }}
          >
            <TableCell align="center" sx={{ fontSize: 12 }}>
              {row.fechaRegistro
                ? extractDate(row.fechaRegistro)
                : "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: 12 }}>
              {row.orden || "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: 12 }}>
              {row.estado_interno || "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: 12 }}>
              {row.nueva_cita ? extractDate(row.nueva_cita) : "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: 12 }}>
              {row.usuario ? row.usuario.nombre : "Sin Información"}
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
  );

  const getButtons = () => (
    <>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={primaryBtn}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={primaryBtn}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={primaryBtn}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 1.5, sm: 3 },
        minHeight: "90vh",
        width: "100%",
        background: gradient,
        position: "relative",
        "::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 65%)",
          pointerEvents: "none",
        },
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {open && (
        <Alert
          severity={alertType}
          onClose={handleClose}
          sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}
        >
          {message}
        </Alert>
      )}
      <Box sx={{ width: "100%", maxWidth: 1350, mx: "auto" }}>
        {/* Top action buttons */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Link to="/agendamientos">
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                borderColor: palette.primary,
                color: palette.cardBg,
                minWidth: 200,
              }}
            >
              Volver
            </Button>
          </Link>
          {downloadExcel()}
        </Box>

        {barChartDaily()}
        {barChartByDespachador()}
        <Card sx={{ ...glass }}>
          <CardHeader
            titleTypographyProps={{ fontSize: 18, fontWeight: "bold" }}
            title="Filtros de Agendamientos"
            sx={{
              background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
              color: "#fff",
              py: 1.2,
            }}
          />
          <CardContent sx={{ pt: 3 }}>
            <form onSubmit={SubmitForm}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "50%", minWidth: 260 }}>
                  <InputLabel>Fecha de Inicio</InputLabel>
                  <TextField
                    required
                    size="small"
                    id="fechaInicio"
                    type="datetime-local"
                    name="fechaInicio"
                    variant="standard"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Box>
                <Box sx={{ width: "50%", minWidth: 260 }}>
                  <InputLabel>Fecha de Fin</InputLabel>
                  <TextField
                    required
                    size="small"
                    id="fechaFin"
                    type="datetime-local"
                    name="fechaFin"
                    variant="standard"
                    value={form.fechaFin}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "50%",
                    minWidth: 260,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ ...primaryBtn, width: "100%" }}
                  >
                    {isSubmitting ? "Cargando..." : "Buscar"}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={isSubmitting}
                    onClick={clearFilter}
                    sx={{ borderRadius: 2, fontWeight: "bold" }}
                  >
                    Limpiar Filtro
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3, ...glass }}>
          <CardHeader
            titleTypographyProps={{ fontSize: 18, fontWeight: "bold" }}
            title="Listado de Agendamientos"
            subheader={data ? `${data.length} registros` : "Sin datos"}
            subheaderTypographyProps={{
              sx: { color: "rgba(255,255,255,0.92)", fontSize: 12 },
            }}
            sx={{
              background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
              color: "#fff",
              py: 1.2,
            }}
          />
          <CardContent sx={{ pt: 2 }}>
            {isLoading && <LinearProgress sx={{ mb: 2 }} />}
            {!isLoading && setTable()}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup
                size="small"
                aria-label="pagination-button-group"
                sx={{ mt: 2 }}
              >
                {getButtons()}
              </ButtonGroup>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
export default AllAgendamientoViewer;

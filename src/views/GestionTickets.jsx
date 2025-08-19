import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Chip,
  Tooltip,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTicketera, getStatsTicket } from "../api/ticketeraAPI";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";

function GestorTicketera() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState(undefined);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);
  const [statsFinalizado, setStatsFinalizado] = useState({});
  const [totalTickets, setTotalTickets] = useState(0);
  const optionSQL = [
    "SOLICITADO",
    "EN GESTION",
    "FINALIZADO",
    "NO APLICA",
    "DERIVADO A TI",
  ];
  const [form, setForm] = useState({ estado: "SOLICITADO" });

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedDateTime;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      fetchTickets();
    } catch (error) {
      setMessage(error.message || "Error al crear el ticket");
      setAlertType("error");
      setOpen(true);
    }
  };

  const estadoColors = {
    "SOLICITADO": palette.accent,
    "EN GESTION": "#ffb74d", // amber lighten
    "FINALIZADO": "#4caf50",
    "NO APLICA": palette.textMuted,
    "DERIVADO A TI": "#ab47bc", // purple accent
  };

  const filterTickets = () => (
    <Box
      sx={{
        width: "95%",
        pt: 2,
        pb: 2,
        position: 'relative',
        background: palette.cardBg,
        borderRadius: 2,
        border: `1px solid ${palette.borderSubtle}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 65%)',
          pointerEvents: 'none',
          borderRadius: 8
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}
      >
        FILTRAR POR ESTADO
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-evenly", mb: 2 }}>
      <Select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            size="small"
            variant="standard"
            sx={{ 
              width: { lg: "30%", md: "40%", xs: "90%" },
              background: palette.accentSoft,
              px: 1,
              borderRadius: 1,
              boxShadow: 'inset 0 0 0 1px '+palette.borderSubtle,
              '&:before, &:after': { borderBottomColor: palette.primaryDark+ ' !important' },
              '& .MuiSelect-select': { py: 1 },
              '&:hover': { background: '#f0faff' }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#ffffff',
                  border: '1px solid '+palette.borderSubtle,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  '& .MuiMenuItem-root': {
                    fontSize: '13px',
                    '&:hover': { bgcolor: palette.accentSoft }
                  }
                }
              }
            }}
          >
            {optionSQL.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            disabled={isSubmitting}
            type="submit"
            sx={{
        background: palette.primary,
        color: "white",
              fontWeight: "bold",
              width: { lg: "30%", md: "40%", xs: "90%" },
              borderRadius: 2,
              marginTop: { xs: 2, md: 0 },
        textShadow: "0 1px 2px rgba(0,0,0,0.25)",
        transition: "background .25s",
        '&:hover': { background: palette.primaryDark },
            }}
          >
            {isSubmitting ? "Cargando..." : "FILTRAR TICKETS"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const fetchTicketStats = async () => {
    setIsSubmitting(true);
    try {
      const stats = await getStatsTicket(token);
      const filterData = stats.filter((item) => item.estado !== "FINALIZADO" && item.estado !== "NO APLICA");
      const filterDataFinalizada = stats.filter((item) => item.estado === "FINALIZADO" || item.estado === "NO APLICA");

      // Combinar todos los elementos de filterDataFinalizada en un solo diccionario
      const combinedStatsFinalizado = filterDataFinalizada.reduce((acc, item) => {
        return {
          ...acc,
          Q: (acc.Q || 0) + item.Q,
          estado: acc.estado ? `${acc.estado}, ${item.estado}` : item.estado,
          // Incluir cualquier otra propiedad que pueda existir
          ...Object.keys(item).reduce((itemAcc, key) => {
            if (key !== 'Q' && key !== 'estado') {
              itemAcc[key] = item[key];
            }
            return itemAcc;
          }, {})
        };
      }, {});
      
      const sumaQ = stats.reduce((acc, item) => acc + item.Q, 0);
      setTotalTickets(sumaQ);
      setStats(filterData);
      setStatsFinalizado(combinedStatsFinalizado);
    } catch (error) {
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const fetchTickets = async () => {
    setIsSubmitting(true);
    try {
      const tickets = await getTicketera(form, token);
      setData(tickets);
    } catch (error) {
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const tablaTickets = () => (
  <Box sx={{ width: "95%", mb: 2 }}>
      <TableContainer
        sx={{
      background: palette.cardBg,
      backdropFilter: "blur(3px)",
      borderRadius: 2,
      border: `1px solid ${palette.borderSubtle}`,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "TICKET",
                "CATEGORÍA",
                "TITULO",
                "FECHA SOLICITUD",
                "PRIORIDAD",
                "SOLICITADO POR",
                "ESTADO",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="left"
                  sx={{
                    background: palette.bgGradient,
                    color: "white",
                    borderBottom: "none",
                    '&:first-of-type': { borderTopLeftRadius: 8 },
                    '&:last-of-type': { borderTopRightRadius: 8 },
                  }}
                >
                  <Typography
                    fontWeight={"bold"}
                    sx={{ fontSize: "12px", color: "white" }}
                  >
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "background .2s",
                    '&:nth-of-type(even)': { backgroundColor: "#fafbfd" },
                    '&:hover': { backgroundColor: palette.accentSoft },
                    '& td': { borderBottom: '1px solid '+palette.borderSubtle },
                  }}
                  component={Link}
                  to={`/ticketviewer/${row.logID}`}
                >
                  <TableCell align="left" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                    {row.logID ? row.logID : "Sin Información"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontSize: "12px"}}
                  >
                    {row.categoria ? row.categoria : "Sin Información"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px"}}>
                    {row.titulo ? row.titulo : "Sin titulo"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px"}}>
                    {row.fecha_solicitud
                      ? extractDate(row.fecha_solicitud)
                      : "Sin Información"}
                  </TableCell>{" "}
                  <TableCell align="left" sx={{ fontSize: "12px"}}>
                    {row.prioridad ? (
                      <Rating value={row.prioridad} readOnly max={3} />
                    ) : (
                      "Sin Información"
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px"}}>
                    {row.solicitante ? row.solicitante : "Sin Información"}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "12px"}}>
                    {row.estado ? (
                      <Tooltip title={`Estado: ${row.estado}`} arrow>
                        <Chip 
                          label={row.estado}
                          size="small"
                          sx={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: estadoColors[row.estado] || palette.primary,
                            letterSpacing: '.5px'
                          }}
                        />
                      </Tooltip>
                    ) : "Sin Información"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography>No hay datos disponibles</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const fetchTicketsWithEstado = async (estado) => {
    setIsSubmitting(true);
    try {
      const tickets = await getTicketera({ estado }, token);
      setData(tickets);
    } catch (error) {
      setMessage(error.message || "Error al obtener los tickets");
      setAlertType("error");
      setOpen(true);
    }
    setIsSubmitting(false);
  };

  const pieChartData = () => {
    // Preparar datos para el pie chart con porcentajes
    const totalTicketsExcludingFinalized = stats.reduce((acc, item) => acc + item.Q, 0);
    const pieData = stats.map((item, index) => ({
      id: index,
      value: item.Q,
      label: `${item.estado} (${((item.Q / totalTicketsExcludingFinalized) * 100).toFixed(1)}%)`,
      estado: item.estado
    }));

    return (
      <Box
        sx={{
          width: "95%",
          m: 2,
          pt: 2,
          pb: 2,
          position: 'relative',
          background: palette.cardBg,
          borderRadius: 2,
          border: `1px solid ${palette.borderSubtle}`,
          display: "flex",
          flexDirection: "row",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
            borderRadius: 8
          }
        }}
      >
        <Box sx={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                innerRadius: 30, 
                outerRadius: 70,
              },
            ]}
            height={150}
            onItemClick={(event, d) => {
              if (d && d.dataIndex !== undefined && pieData[d.dataIndex]) {
                const selectedEstado = pieData[d.dataIndex].estado;
                setForm({ ...form, estado: selectedEstado });
                fetchTicketsWithEstado(selectedEstado);
              }
            }}
            colors={pieData.map(d => estadoColors[d.estado] || palette.accent)}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      <Box sx={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{
          p:1.5,
          borderRadius: 3,
          position: 'relative',
          background: 'transparent',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Gauge 
            width={160} 
            height={160} 
            value={statsFinalizado.Q} 
            valueMax={totalTickets}
            innerRadius="75%"
            outerRadius="100%"
            cornerRadius="50%"
            text={`${statsFinalizado.Q || 0} / ${totalTickets || 0} \n Finalizados`}
            sx={{ 
              '& .MuiGauge-valueArc': {
                fill: '#4caf50'
              },
              '& .MuiGauge-referenceArc': {
                stroke: palette.borderSubtle
              },
              '& text': { fill: palette.primaryDark, fontWeight: 'bold' }
            }}
             />
        </Box>
      </Box>
    </Box>
  );}

  useEffect(() => {
    fetchTickets();
    fetchTicketStats();
  }, []);

  return (
    <MainLayout>
          <Box
      sx={{
        position: 'relative',
        paddingY: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: palette.bgGradient,
        minHeight: "90vh",
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.06), transparent 65%)',
          pointerEvents: 'none'
        }
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{ width: "90%", marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}
      {filterTickets()}
      {pieChartData()}
      {tablaTickets()}
    </Box>
    </MainLayout>
  );
}

export default GestorTicketera;

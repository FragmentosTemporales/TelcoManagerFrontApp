import {
  Box,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Typography,
  Chip,
  Tooltip,
  Fade,
  IconButton,
  Stack
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  getLogQueryTimeTotal,
  getTopLogQuery,
  getLogQueryTimeTotalByEndpoint,
  getLogQuerySemanal,
} from "../api/query_logs_api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import { extractDateOnly } from "../helpers/main";
import { palette } from "../theme/palette";
import RefreshIcon from '@mui/icons-material/Refresh';
import ModuleHeader from "../components/ModuleHeader";

function LogQueryStats() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [logsDataTime, setLogsDataTime] = useState([]);
  const [logsDataSemanal, setLogsDataSemanal] = useState([]);
  const [logsDataTop, setLogsDataTop] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [logDataEndpoint, setLogDataEndpoint] = useState([]);
  const [dataMethod, setDataMethod] = useState([]);
  const [isSubmittingSemanal, setIsSubmittingSemanal] = useState(true);
  const [isSubmittingTime, setIsSubmittingTime] = useState(true);
  const [isSubmittingTop, setIsSubmittingTop] = useState(true);
  const [isSubmittingEndpoint, setIsSubmittingEndpoint] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchLogQuerySemanal();
      await fetchTopLogQuery();
      await fetchQueryLogsTime();
    })();
  }, []);

  useEffect(() => {
    if (selectedEndpoint) {
      fetchLogQueryTimeByEndpoint(selectedEndpoint);
    } else {
      setLogDataEndpoint([]);
    }
  }, [selectedEndpoint]);

  const fetchQueryLogsTime = async () => {
    setIsSubmittingTime(true);
    try {
      const data = await getLogQueryTimeTotal(token);
      setLogsDataTime(data);
    } catch (error) {
      console.error("Error fetching log query time data:", error);
    }
    setIsSubmittingTime(false);
  };

  const fetchLogQuerySemanal = async () => {
    setIsSubmittingSemanal(true);
    try {
      const res = await getLogQuerySemanal(token);
      setLogsDataSemanal(res.data);
      setDataMethod(res.data_method);
      console.log("Data Method:", res.data_method);
    } catch (error) {
      console.error("Error fetching log query semanal data:", error);
    }
    setIsSubmittingSemanal(false);
  };

  const fetchLogQueryTimeByEndpoint = async (endpoint) => {
    setIsSubmittingEndpoint(true);
    try {
      const data = await getLogQueryTimeTotalByEndpoint(token, endpoint);
      setLogDataEndpoint(data);
    } catch (error) {
      console.error("Error fetching log query time by endpoint data:", error);
    }
    setIsSubmittingEndpoint(false);
  };

  const fetchTopLogQuery = async () => {
    setIsSubmittingTop(true);
    try {
      const data = await getTopLogQuery(token);
      setLogsDataTop(data);
      if (data[0]) {
        setSelectedEndpoint(data[0].endpoint);
      }
    } catch (error) {
      console.error("Error fetching top log query data:", error);
    }
    setIsSubmittingTop(false);
  };

  const lineChartData = () => (
    <LineChart
      height={250}
      grid={{ vertical: true, horizontal: true }}
      yAxis={[
        {
          width: 100,
          colorMap: {
            type: "piecewise",
            thresholds: [0, 3500],
            colors: ["blue", "green", "red"],
          },
        },
      ]}
      xAxis={[
        {
          data: logsDataSemanal.map((item) => extractDateOnly(item.fecha)),
          scaleType: "point",
        },
      ]}
      series={[
        {
          data: logsDataSemanal.map((item) => item.total),
          label: "Total de consultas por día :",
          color: "green",
          curve: "linear",
        },
      ]}
      margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
    />
  );

  const pieChartData = () => {
    // Preparar datos para el pie chart con porcentajes
    const totalTicketsExcludingFinalized = dataMethod.reduce(
      (acc, item) => acc + item.total,
      0
    );

    // Colores que complementan el verde usado en los otros gráficos
    const colors = [
      "#2e7d32",
      "#4caf50",
      "#66bb6a",
      "#81c784",
      "#a5d6a7",
      "#c8e6c9",
    ];

    const pieData = dataMethod.map((item, index) => ({
      id: index,
      value: item.total,
      label: `${item.method} (${(
        (item.total / totalTicketsExcludingFinalized) *
        100
      ).toFixed(1)}%)`,
      estado: item.method,
      color: colors[index % colors.length],
    }));

    return (
      <PieChart
        series={[
          {
            data: pieData,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "#e0e0e0" },
            innerRadius: 30,
            outerRadius: 70,
          },
        ]}
        height={250}
      />
    );
  };

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          py: '70px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '90vh',
          background: palette.bgGradient,
          position: 'relative',
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        <ModuleHeader title="Monitoreo de Consultas" subtitle="Estadísticas de consultas y rendimiento de endpoints" />
        <Box sx={{ width: '90%', mb: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title='Refrescar datos'>
            <span>
              <IconButton size='small' disabled={isSubmittingSemanal || isSubmittingTop || isSubmittingTime} onClick={async ()=> { await fetchLogQuerySemanal(); await fetchTopLogQuery(); await fetchQueryLogsTime(); if(selectedEndpoint) await fetchLogQueryTimeByEndpoint(selectedEndpoint);} } sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        {/* Summary chips (overall stats) */}
        <Fade in timeout={500}>
          <Stack direction='row' spacing={1.2} flexWrap='wrap' sx={{ width: '90%', mb: 2 }}>
            <Chip label={`Total semanal: ${logsDataSemanal.reduce((a,c)=> a + (c.total||0),0)}`} size='small' sx={{ bgcolor: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', fontWeight: 500 }} />
            <Chip label={`Intervalos (día): ${logsDataTime.length}`} size='small' sx={{ bgcolor: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', fontWeight: 500 }} />
            <Chip label={`Top endpoints: ${logsDataTop.length}`} size='small' sx={{ bgcolor: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', fontWeight: 500 }} />
            {selectedEndpoint && (
              <Chip label={`Endpoint activo: ${selectedEndpoint}`} size='small' color='primary' sx={{ fontWeight: 600, bgcolor: palette.primary, color: '#fff' }} />
            )}
          </Stack>
        </Fade>
        {!isSubmittingSemanal && logsDataSemanal && logsDataSemanal.length > 0 ? (
          <Box
            sx={{
              width: "90%",
              marginY: 1,
              background: palette.cardBg,
              borderRadius: 3,
              border: `1px solid ${palette.borderSubtle}`,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 10px 30px -8px rgba(0,0,0,0.45)',
              display: "flex",
              flexDirection: "column",
              position: 'relative',
              overflow: 'hidden',
              '&:before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 65%)', opacity: 0, transition: 'opacity .6s', pointerEvents: 'none' },
              '&:hover:before': { opacity: 1 }
            }}
          >
            <Typography variant="h6" sx={{ py: 1.2, px: 2, textAlign: "center", fontWeight: 600, color: palette.primary, letterSpacing: .4 }}>
              Semanal de Consultas
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { lg: "row", xs: "column" },
              }}
            >
              <Box
                sx={{
                  width: { lg: "30%", xs: "100%" },
                  height: { lg: "100%", xs: "250px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1.5
                }}
              >
                {pieChartData()}
              </Box>
              <Box
                sx={{
                  width: { lg: "70%", xs: "100%" },
                  height: { lg: "100%", xs: "250px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1.5
                }}
              >
                {lineChartData()}
              </Box>
            </Box>
            {/* Chips de selección de endpoint removidos a petición del usuario */}
          </Box>
        ) : !isSubmittingSemanal &&
          logsDataSemanal &&
          logsDataSemanal.length === 0 ? (
          <Box
            sx={{
              width: "90%",
              paddingY: 3,
              textAlign: "center",
              background: palette.cardBg,
              borderRadius: 3,
              border: `1px solid ${palette.borderSubtle}`,
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No hay datos disponibles para mostrar.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{ width: "90%", textAlign: "center", background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)' }}
          >
            <Skeleton variant="rectangular" width="100%" height={250} />
          </Box>
        )}

        <Box
          sx={{
            width: "90%",
            marginY: 1,
            display: "flex",
            flexDirection: { lg: "row", xs: "column" },
          }}
        >
          {!isSubmittingTop && logsDataTop && logsDataTop.length > 0 ? (
            <Box
              sx={{
                width: { lg: "25%", xs: "100%" },
                background: palette.cardBg,
                marginRight: { lg: 2, xs: 0 },
                marginBottom: { lg: 0, xs: 2 },
                borderRadius: 3,
                border: `1px solid ${palette.borderSubtle}`,
                boxShadow: '0 6px 20px -6px rgba(0,0,0,0.30)',
                backdropFilter: 'blur(4px)',
                overflow: 'hidden' // ensure header respects rounded corners
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["CONSULTA", "TOTAL"].map((header) => (
                        <TableCell
                          key={header}
                          align="left"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: palette.primary,
                            color: '#fff',
                            borderBottom: `1px solid ${palette.borderSubtle}`
                          }}
                        >
                          <Typography sx={{ fontSize: "12px" }}>
                            {header}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logsDataTop.map((log) => (
                      <TableRow
                        key={log.id}
                        onClick={() => setSelectedEndpoint(log.endpoint)}
                        sx={{
                          cursor: "pointer",
                          transition: 'background-color .3s, box-shadow .3s',
                          '&:hover': { backgroundColor: palette.accentSoft },
                          backgroundColor: selectedEndpoint === log.endpoint ? palette.accentSoft : 'transparent',
                          '&:active': { boxShadow: 'inset 0 0 0 1px ' + palette.accent },
                          '&:nth-of-type(odd)': { backgroundColor: selectedEndpoint === log.endpoint ? palette.accentSoft : 'rgba(255,255,255,0.10)' }
                        }}
                      >
                        <TableCell align="left" sx={{ fontSize: "12px" }}>
                          {log.endpoint}
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: "12px" }}>
                          {log.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box
              sx={{
                marginRight: { lg: 2, xs: 0 },
                width: { lg: "25%", xs: "100%" },
                textAlign: "center",
                background: palette.cardBg,
                borderRadius: 3,
                border: `1px solid ${palette.borderSubtle}`,
                backdropFilter: 'blur(4px)'
              }}
            >
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
          )}

          <Box
            sx={{
              width: { lg: "75%", xs: "100%" },
              height: "100%",
              background: palette.cardBg,
              borderRadius: 3,
              border: `1px solid ${palette.borderSubtle}`,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 8px 26px -8px rgba(0,0,0,0.35)',
            }}
          >
            {!isSubmittingTime && logsDataTime && logsDataTime.length > 0 ? (
              <Box sx={{ marginY: 1, height: "50%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ py: 1.2, px: 2, textAlign: "center", fontWeight: 600, color: palette.primary, letterSpacing: .4 }}
                >
                  Diario de Consultas
                </Typography>
                <LineChart
                  height={250}
                  grid={{ vertical: true, horizontal: true }}
                  yAxis={[
                    {
                      width: 100,
                      colorMap: {
                        type: "piecewise",
                        thresholds: [0, 500],
                        colors: ["blue", "green", "red"],
                      },
                    },
                  ]}
                  xAxis={[
                    {
                      data: logsDataTime.map((item) => item.intervalo),
                      scaleType: "point",
                    },
                  ]}
                  series={[
                    {
                      data: logsDataTime.map((item) => item.total),
                      label: "Total de consultas por intervalo :",
                      color: "green",
                      curve: "linear",
                    },
                  ]}
                  margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
                />
              </Box>
            ) : !isSubmittingTime &&
              logsDataTime &&
              logsDataTime.length === 0 ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  No hay datos disponibles para mostrar.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                  background: 'transparent',
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={250} />
              </Box>
            )}
            <Divider />
            {!isSubmittingEndpoint &&
            logDataEndpoint &&
            logDataEndpoint.length > 0 ? (
              <Box sx={{ marginY: 1, height: "50%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ py: 1.2, px: 2, textAlign: "center", fontWeight: 600, color: palette.primary, letterSpacing: .4 }}
                >
                  {selectedEndpoint
                    ? selectedEndpoint
                    : "Diario de Consultas por Endpoint"}
                </Typography>
                <LineChart
                  height={250}
                  grid={{ vertical: true, horizontal: true }}
                  yAxis={[
                    {
                      width: 100,
                      colorMap: {
                        type: "piecewise",
                        thresholds: [0, 500],
                        colors: ["blue", "green", "red"],
                      },
                    },
                  ]}
                  xAxis={[
                    {
                      data: logDataEndpoint.map((item) => item.intervalo),
                      scaleType: "point",
                    },
                  ]}
                  series={[
                    {
                      data: logDataEndpoint.map((item) => item.total),
                      label: "Total de consultas por intervalo :",
                      color: "green",
                      curve: "linear",
                    },
                  ]}
                  margin={{ left: 80, right: 50, top: 50, bottom: 50 }}
                />
              </Box>
            ) : !isSubmittingEndpoint &&
              logDataEndpoint &&
              logDataEndpoint.length === 0 ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  No hay datos disponibles para mostrar.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                  background: 'transparent',
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={250} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default LogQueryStats;

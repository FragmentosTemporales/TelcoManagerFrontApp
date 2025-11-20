import { Box, CircularProgress } from "@mui/material";

import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { getReversaData, getReversaDataUpdate } from "../api/logisticaAPI";
import { useEffect, useState } from "react";
import palette from "../theme/palette";

function ReversaCharts() {
  // authState token is handled centrally by the API client; no local token needed
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState([]);
  const [chartData, setChartData] = useState({
    fechas: [],
    atcData: [],
    vtrRmData: [],
    vtrVRegionData: []
  });
  const [weeklyChartData, setWeeklyChartData] = useState({
    weeks: [],
    centroCostoData: {}
  });

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  // Función para obtener el número de semana del año
  const getWeekNumber = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Copiar fecha para no modificar la original
    const tempDate = new Date(date.getTime());

    // Ajustar al jueves de la misma semana (ISO 8601)
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));

    // Obtener el primer día del año
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);

    // Calcular el número de semana
    const weekNumber = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);

    return `Semana ${weekNumber}`;
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await getReversaData();
      const processedData = response.map((item) => ({
        ...item,
        fecha: extractDate(item.fecha), // Process Fecha with extractDate
      }));
      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await getReversaDataUpdate();
      const processedData = response.map((item) => ({
        ...item,
        fechaEntrega: extractDate(item.fechaEntrega),
        week: getWeekNumber(extractDate(item.fechaEntrega))
      }));
      setDataUpdate(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChartData();
    fetchChartDataUpdate();
  }, []);

  // Procesar datos por semana cuando dataUpdate cambie
  useEffect(() => {
    if (dataUpdate && dataUpdate.length > 0) {
      processWeeklyData();
    }
  }, [dataUpdate]);

  const processWeeklyData = () => {
    // Agrupar por semana y centro de costo
    const weekMap = {};
    const centrosCostoSet = new Set();

    dataUpdate.forEach(item => {
      const week = item.week;
      const centroCosto = item.CENTRO_COSTO || 'Sin Centro Costo';

      centrosCostoSet.add(centroCosto);

      if (!weekMap[week]) {
        weekMap[week] = {};
      }

      weekMap[week][centroCosto] = (weekMap[week][centroCosto] || 0) + 1;
    });

    // Ordenar semanas
    const weeks = Object.keys(weekMap).sort((a, b) => {
      const weekA = parseInt(a.match(/\d+/)[0]);
      const weekB = parseInt(b.match(/\d+/)[0]);
      const yearA = parseInt(a.split(' - ')[1]);
      const yearB = parseInt(b.split(' - ')[1]);

      if (yearA !== yearB) return yearA - yearB;
      return weekA - weekB;
    });

    // Crear series por cada centro de costo
    const centroCostoData = {};
    centrosCostoSet.forEach(centroCosto => {
      centroCostoData[centroCosto] = weeks.map(week =>
        weekMap[week][centroCosto] || 0
      );
    });

    setWeeklyChartData({ weeks, centroCostoData })
  };

  // Process chart data whenever data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const fechas = data.map(item => item.fecha);
      const atcData = data.map(item => item.ATC);
      const vtrRmData = data.map(item => item.VTR_RM);
      const vtrVRegionData = data.map(item => item.VTR_V_REGION);

      setChartData({
        fechas,
        atcData,
        vtrRmData,
        vtrVRegionData
      });
    }
  }, [data]);

  const margin = { right: 24 };

  const wrapperSx = {
    display: 'flex',
    flexDirection: { xs: 'column', lg: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    mt: 2,
    borderRadius: 3,
    border: `1px solid ${palette.borderSubtle}`,
    background: palette.cardBg,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {isLoading ? (
        <Box sx={{ ...wrapperSx, justifyContent: 'center', minHeight: 250 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={wrapperSx}>
          <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ mb: 2, color: palette.textPrimary, fontWeight: 'bold' }}>
              Registros por Día y Centro de Costo
            </Box>
            <LineChart
              height={260}
              grid={{ vertical: true, horizontal: true }}
              series={[
                { data: chartData.atcData, label: 'ATC', color: palette.primary },
                { data: chartData.vtrRmData, label: 'VTR RM', color: palette.accent },
                { data: chartData.vtrVRegionData, label: 'VTR V Región', color: palette.textMuted },
              ]}
              xAxis={[{ scaleType: 'point', data: chartData.fechas, tickLabelStyle: { fill: palette.textMuted } }]}
              yAxis={[{ width: 50, tickLabelStyle: { fill: palette.textMuted } }]}
              margin={margin}
            />
          </Box>
        </Box>
      )}

      {dataUpdate && dataUpdate.length > 0 && (
        <Box sx={wrapperSx}>
          <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ mb: 2, color: palette.textPrimary, fontWeight: 'bold' }}>
              Registros por Semana y Centro de Costo
            </Box>
            <BarChart
              height={300}
              series={Object.entries(weeklyChartData.centroCostoData).map(([centroCosto, data], index) => ({
                data,
                label: centroCosto,
                color: index === 0 ? palette.primary : index === 1 ? palette.accent : palette.textMuted
              }))}
              xAxis={[{
                scaleType: 'band',
                data: weeklyChartData.weeks,
                tickLabelStyle: {
                  angle: -45,
                  textAnchor: 'end',
                  fill: palette.textMuted,
                  fontSize: 10
                }
              }]}
              yAxis={[{
                tickLabelStyle: { fill: palette.textMuted }
              }]}
              margin={{ bottom: 120, right: 24, left: 50, top: 20 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ReversaCharts;

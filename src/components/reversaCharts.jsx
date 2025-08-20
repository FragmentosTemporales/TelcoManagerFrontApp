import { Box, CircularProgress } from "@mui/material";

import { LineChart } from '@mui/x-charts/LineChart';
import { getReversaData } from "../api/logisticaAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import palette from "../theme/palette";

function ReversaCharts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    fechas: [],
    atcData: [],
    vtrRmData: [],
    vtrVRegionData: []
  });

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await getReversaData(token);
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

  useEffect(() => {
    fetchChartData();
  }, []);

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
            <LineChart
              height={260}
              grid={{ vertical: true, horizontal: true }}
              series={[
                { data: chartData.atcData, label: 'ATC', color: palette.primary },
                { data: chartData.vtrRmData, label: 'VTR RM', color: palette.accent },
                { data: chartData.vtrVRegionData, label: 'VTR V Región', color: palette.primaryDark },
              ]}
              xAxis={[{ scaleType: 'point', data: chartData.fechas, tickLabelStyle: { fill: palette.textMuted } }]}
              yAxis={[{ width: 50, tickLabelStyle: { fill: palette.textMuted } }]}
              margin={margin}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ReversaCharts;

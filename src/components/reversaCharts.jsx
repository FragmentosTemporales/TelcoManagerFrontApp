import {
  Box,
  CircularProgress,
} from "@mui/material";

import { LineChart } from '@mui/x-charts/LineChart';
import { getReversaData } from "../api/logisticaAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: "90%",
            marginTop: 2,
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: 2,
            borderRadius: 2,
            border: "2px solid #dfdeda",
            backgroundColor: "#fff",
          }}
        >

          <Box sx={{ width: "100%", padding: 3 }}>
            <LineChart
              height={250}
              grid={{ vertical: true, horizontal: true }}
              series={[
                { data: chartData.atcData, label: 'ATC' },
                { data: chartData.vtrRmData, label: 'VTR RM' },
                { data: chartData.vtrVRegionData, label: 'VTR V Región' },
              ]}
              xAxis={[{ scaleType: 'point', data: chartData.fechas }]}
              yAxis={[{ width: 50 }]}
              margin={margin}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ReversaCharts;

import {
    Box,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    CardContent,
    InputLabel,
    TextField,
    Typography,
  } from "@mui/material";
  import {
    BarChart,
    Bar,
    CartesianGrid,
    LabelList,
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
  } from "recharts";
  import { getReversaData } from "../api/logisticaAPI";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  
  function ReversaCharts() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(undefined);

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
              width: "90%",
              marginTop: 2,
              padding: 2,
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", lg: "100%" },
                marginBottom: { xs: 2, lg: 0 },
              }}
            >
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "initial" }}>
                Reversas recibidas por día
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ angle: -45, textAnchor: "end", fontSize: 10 }} // Reduce font size
                  height={40} // Increase height to provide more space for labels
                />
                <Legend verticalAlign="top" height={36} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <YAxis />
                <Line dataKey="ATC" type="monotone" stroke="#FF5733" strokeWidth={2} /> 
                <Line dataKey="VTR_RM" type="monotone" stroke="#345f78" strokeWidth={2} /> 
                <Line dataKey="VTR_V_REGION" type="monotone" stroke="#3357FF" strokeWidth={2} /> 
              </LineChart>
            </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
  
  export default ReversaCharts;

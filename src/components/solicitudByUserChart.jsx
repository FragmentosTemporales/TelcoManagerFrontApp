import {
    Box,
    CircularProgress,
    Typography,
  } from "@mui/material";
  import {
    BarChart,
    Bar,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import {
    getSolicitudeStatsByUser,
  } from "../api/solicitudAPI";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  
  function SolicitudChartsByUser() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(undefined);
  
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await getSolicitudeStatsByUser(token);
        const sortedData = response.sort((a, b) => b.Q - a.Q);
        setData(sortedData);
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
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Conteo de solicitudes por estado
        </Typography>
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
              <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={data}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="Estado" fontSize={10} />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <Bar dataKey="Q" fill="#8884d8">
                        <LabelList dataKey="Q" position="inside" fill="#ffffff" fontWeight={"bold"} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
  
  export default SolicitudChartsByUser;
  
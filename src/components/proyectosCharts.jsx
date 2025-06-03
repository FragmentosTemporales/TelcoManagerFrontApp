import {
  Box,
  Button,
  CircularProgress,
  TextField,
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
  getQMacroEstado
} from "../api/onnetAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function ProyectosCharts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [dataMacro, setDataMacro] = useState(undefined);

  const fetchChartDataMacro = async () => {
    setIsLoading(true);
    try {
      const response = await getQMacroEstado(token);
      setDataMacro(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChartDataMacro();
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
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", lg: "100%" },
              padding: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Q de Proyectos por Estado
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataMacro} layout="horizontal">
                  <defs>
                    <linearGradient
                      id="barGradient1"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#124fb9 " stopOpacity={1} />
                      <stop offset="100%" stopColor="#0d3984" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="estado" fontSize={10} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Bar dataKey="Q" fill="url(#barGradient1)">
                    <LabelList
                      dataKey="Q"
                      position="inside"
                      fill="#ffffff"
                      fontWeight={"bold"}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

        </Box>
      )}
    </Box>
  );
}

export default ProyectosCharts;

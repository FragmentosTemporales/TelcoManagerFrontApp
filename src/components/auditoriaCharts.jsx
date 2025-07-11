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
  getAuditoriasStats,
  getAuditoriasStatsEstado,
} from "../api/calidadAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function AuditoriaCharts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [dataEstado, setDataEstado] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await getAuditoriasStats(token);
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataEstado = async () => {
    setIsLoading(true);
    try {
      const response = await getAuditoriasStatsEstado(token);
      setDataEstado(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchChartDataEstado();
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
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Auditorías últimos 30 días
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <ResponsiveContainer width="50%" height={200}>
                <BarChart data={data} layout="horizontal">
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
                  <XAxis dataKey="nombre" fontSize={10} />
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
              <ResponsiveContainer width="50%" height={200}>
                <BarChart data={dataEstado} layout="horizontal">
                  <defs>
                    <linearGradient
                      id="barGradient2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ff3333" stopOpacity={1} />
                      <stop offset="100%" stopColor="#b22323" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="auditoria" fontSize={10} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Bar dataKey="Q" fill="url(#barGradient2)">
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

export default AuditoriaCharts;

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
import { getDataAgendamientos, getDataHistoricaAgendamientos } from "../api/despachoAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function AgendamientoCharts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [dataHistorica, setDataHistorica] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const fetchData = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const [chartResponse, historicalResponse] = await Promise.all([
        getDataAgendamientos(token, fecha),
        getDataHistoricaAgendamientos(token),
      ]);

      const sortedChartData = chartResponse.sort((a, b) => b.Q - a.Q);
      const processedHistoricalData = historicalResponse.map((item) => ({
        ...item,
        fecha: extractDate(item.fecha),
      }));

      setData(sortedChartData);
      setDataHistorica(processedHistoricalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsSubmitting(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            required
            id="fecha"
            type="date" // Changed to "date" for simplicity
            name="fecha"
            variant="outlined"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)} // Fixed onChange to update fecha
            sx={{ minWidth: "50%" }}
          />
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={isSubmitting}
            onClick={fetchData}
            sx={{
              background: "#0b2f6d",
              height: 30,
              width: "50%",
              borderRadius: "20px",
              fontWeight: "bold", // Make text bold
            }}
          >
            {isSubmitting ? "Cargando..." : "Buscar"}
          </Button>
        </Box>
      </Box>
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
            flexDirection: { xs: "column" },
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} layout="horizontal">
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
                  
                <Bar dataKey="Q" fill="#8884d8">
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
          <Box
            sx={{
              width: { xs: "100%", lg: "100%" },
              marginTop: { xs: 2, lg: 0 },
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dataHistorica} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ angle: -45, textAnchor: "end", fontSize: 10 }} // Reduce font size
                  height={40} // Increase height to provide more space for labels
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <YAxis />
                <Line dataKey="Q" type="monotone" stroke="#8884d8" strokeWidth={2} /> 
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AgendamientoCharts;

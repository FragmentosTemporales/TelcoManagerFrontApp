import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts"; // Import LabelList
import { useEffect, useState } from "react";
import { getMotivoStats } from "../api/statsApi";
import { useSelector } from "react-redux";

function ChartMotivoStats() {
  const [data, setData] = useState([]);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const fetchData = async () => {
    try {
      const res = await getMotivoStats(token);
      const formattedData = res.map(item => ({
        ...item,
        porcentaje: parseFloat(item.porcentaje.toFixed(1))
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", boxShadow: 5 , minHeight: 600}}>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
          >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffa500" stopOpacity={0.8} />
            </linearGradient>
          </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
              }}
              itemStyle={{ color: "#8884d8" }}
              cursor={{ fill: "rgba(200, 200, 200, 0.5)" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="porcentaje" fill="url(#gradient)">
              <LabelList
                dataKey="porcentaje"
                position="right"
                style={{ fill: "black", fontSize: 12 }}
              />
            </Bar>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="descriMotivo"
              width={200}
              fontSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default ChartMotivoStats;


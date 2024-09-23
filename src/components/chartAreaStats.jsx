import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useEffect, useState } from "react";
import { getAreaStats } from "../api/statsApi";
import { useSelector } from "react-redux";

function ChartAreaStats() {
  const [data, setData] = useState(null);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#6A5ACD'];

  const fetchData = async () => {
    try {
      const res = await getAreaStats(token);
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
  }, [token]);

  return (
    <Box sx={{ width: "100%", boxShadow: 5 }}>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="porcentaje"
              nameKey="nombreArea"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
          </PieChart>
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

export default ChartAreaStats;

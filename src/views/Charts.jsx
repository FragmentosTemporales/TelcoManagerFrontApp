import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDataAgendamientos,
  getDataAgendamientosCC,
} from "../api/despachoAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
function Charts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [data, setData] = useState(undefined);
  const [dataCC, setDataCC] = useState(undefined);
  const [dias, setDias] = useState(1);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await getDataAgendamientos(token, dias);
      console.log(response);
      const sortedData = response.sort((a, b) => b.Q - a.Q);
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataCC = async () => {
    setIsLoading2(true);
    try {
      const response = await getDataAgendamientosCC(token);
      setDataCC(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading2(false);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    fetchChartData();
  }, [dias]);

  useEffect(() => {
    fetchChartDataCC();
  }, []);

  useEffect(() => {
    console.log(dataCC);
  }, [dias]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "70px",
      }}
    >
      <Card
        sx={{
          width: "90%",
          marginTop: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: "20px",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              Selección de días
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "start",
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0b2f6d", width: "150px" }}
            onClick={() => setDias(1)}
          >
            1 Día
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0b2f6d", width: "150px" }}
            onClick={() => setDias(7)}
          >
            7 Días
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0b2f6d", width: "150px" }}
            onClick={() => setDias(30)}
          >
            30 Días
          </Button>
        </CardContent>
      </Card>
      {isLoading || isLoading2 ? (
        <Box
          sx={{
            width: "90%",
            marginTop: 2,
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
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
              width: { xs: "100%", lg: "70%" },
              marginBottom: { xs: 2, lg: 0 },
            }}
          >
            <Card
              sx={{
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "20px",
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial", textAlign: "center" }}>
                    Días de Agendamientos : {dias}
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "start",
                }}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={data}
                    layout="horizontal"
                    margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="nombre" fontSize={8} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Bar dataKey="Q" fill="#8884d8">
                      <LabelList dataKey="Q" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", lg: "30%" },
            }}
          >
            <Card
              sx={{
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "20px",
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial", textAlign: "center" }}>
                   Histórico Centro de Costo
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "start",
                }}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart width={"100%"} height={400}>
                    <Pie
                      data={dataCC}
                      cx="50%"
                      cy="50%"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="q2"
                    >
                      {dataCC &&
                        dataCC.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                      formatter={(value, name, props) => (
                        <>
                          <span>
                            Centro de Costo: {props.payload.Centro_costo}
                          </span>
                          <br />
                          <span>Valor: {props.payload.q2}</span>
                        </>
                      )}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ fontSize: "12px" }}>
                          {entry.payload?.Centro_costo || "N/A"}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Charts;

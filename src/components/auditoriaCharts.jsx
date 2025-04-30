import {
    Box,
    Button,
    CircularProgress,
    TextField,
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
  import { getAuditoriasStats } from "../api/calidadAPI";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  
  function AuditoriaCharts() {
    const authState = useSelector((state) => state.auth);
    const { token } = authState;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  
    const fetchChartData = async () => {
      setIsLoading(true);
      setIsSubmitting(true);
      try {
        const response = await getAuditoriasStats(token, fecha);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
      setIsSubmitting(false);
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
      ><Box
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
          onClick={fetchChartData}
          sx={{
            background: "#0b2f6d",
            height: 30,
            width: "50%",
            borderRadius: "20px",
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
          </Box>
        )}
      </Box>
    );
  }
  
  export default AuditoriaCharts;
  
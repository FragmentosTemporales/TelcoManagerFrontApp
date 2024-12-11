import {
  Alert,
  Box,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Typography,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChartGestionSolicitud from "../components/chartGestionSolicitud";
import ChartAreaStats from "../components/chartAreaStats";
import ChartMotivoStats from "../components/chartMotivoStats";
import { useState } from "react";

function Charts({ open, handleClose, message }) {
  const [chart, setChart] = useState("");
  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  const opciones = [
    {
      value: "ChartGestion",
      label: "Gráfico de Estados",
    },
    {
      value: "ChartArea",
      label: "Gráfico de Áreas",
    },
    {
      value: "ChartMotivos",
      label: "Gráfico de Motivos",
    },
  ];

  const setCardContainer = () => (
    <CardContent
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "500px",
          }}
        >
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">
              Seleccione el gráfico
            </InputLabel>
            <Select
              required
              labelId="chart-select-label"
              id="chart-select"
              value={chart || ""}
              label="Seleccione el gráfico"
              onChange={(event) => {
                setChart(event.target.value);
              }}
            >
              {opciones.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </form>
    </CardContent>
  );

  const setGrafico = () => {
    if (chart && chart !== "") {
      switch (chart) {
        case "ChartGestion":
          return (
            <Card
              sx={{
                borderRadius: 0,
                width: "100%",
                height: "100%",
                overflow: "auto", // Permitir scroll en caso de contenido grande
                boxShadow: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                    ESTADISTICA SEGUN ESTADO
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "start",
                }}
              />
              <Box sx={{ flex: 1, display: "flex", overflow: "auto" }}>
                <ChartGestionSolicitud />
              </Box>
            </Card>
          );
        case "ChartArea":
          return (
            <Card
              sx={{
                borderRadius: 0,
                width: "100%",
                height: "100%",
                overflow: "auto", // Permitir scroll en caso de contenido grande
                boxShadow: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                   ESTADISTICA SEGUN AREAS
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "start",
                }}
              />
              <Box sx={{ flex: 1, display: "flex", overflow: "auto" }}>
                <ChartAreaStats />
              </Box>
            </Card>
          );
        case "ChartMotivos":
          return (
            <Card
              sx={{
                borderRadius: 0,
                width: "100%",
                height: "100%",
                overflow: "auto", // Permitir scroll en caso de contenido grande
                boxShadow: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                   ESTADISTICA SEGUN MOTIVOS
                  </Typography>
                }
                sx={{
                  background: "#0b2f6d",
                  color: "white",
                  textAlign: "start",
                }}
              />
              <Box sx={{ flex: 1, display: "flex", overflow: "auto" }}>
                <ChartMotivoStats />
              </Box>
            </Card>
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "85vh",
        paddingTop: 8,
        mt: 2,
      }}
    >
      {open && renderAlert()}

      <Card
        sx={{
          borderRadius: 0,
          width: "70%",
          height: "600px",
          overflow: "hidden",
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              REPORTES
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
          avatar={<BarChartIcon />}
        />
        {setCardContainer()}
        {setGrafico()}
      </Card>
    </Box>
  );
}

export default Charts;

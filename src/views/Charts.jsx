import { Box, Alert, Card, CardHeader, Typography } from "@mui/material";
import ChartGestionSolicitud from "../components/chartGestionSolicitud";
import ChartAreaStats from "../components/chartAreaStats";
import ChartMotivoStats from "../components/chartMotivoStats";
import ReportesPowerBiTelco from "../components/reportBi";

function Charts({ open, handleClose, message }) {
  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingTop: 8,
        mt: 2,
      }}
    >
      {open && renderAlert()}

      <Card
        sx={{
          borderRadius: 0,
          width: "70%",
          height: 500,
          overflow: "hidden",
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title="ESTADISTICA SEGUN AREAS"
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
            padding: "8px 16px",
          }}
        />
        <Box sx={{ flex: 1, display: "flex" }}>
          <ChartAreaStats />
        </Box>
      </Card>

      <Card
        sx={{
          borderRadius: 0,
          width: "70%",
          height: 500,
          overflow: "hidden",
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title="ESTADISTICA SEGUN ESTADOS"
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
            padding: "8px 16px",
          }}
        />
        <Box sx={{ flex: 1, display: "flex" }}>
          <ChartGestionSolicitud />
        </Box>
      </Card>

      <Card
        sx={{
          borderRadius: 0,
          width: "70%",
          height: "100%",
          overflow: "hidden",
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title="ESTADISTICA SEGUN MOTIVOS"
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "center",
            padding: "8px 16px",
          }}
        />
        <Box sx={{ flex: 1, display: "flex" }}>
          <ChartMotivoStats />
        </Box>
      </Card>

      {/*
      <Box>
        <ReportesPowerBiTelco
          name="CHILE - MVS - Reporte Operaciones ATC - Mensual"
          reportId="da9c521d-25e9-48a4-b143-1da684aff555"
          groupId="1367bc65-9ea5-44d2-9430-946090220353"
          url="https://app.powerbi.com/reportEmbed?reportId=da9c521d-25e9-48a4-b143-1da684aff555&groupId=1367bc65-9ea5-44d2-9430-946090220353&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d"
        />
      </Box>
      */}

    </Box>
  );
}

export default Charts;

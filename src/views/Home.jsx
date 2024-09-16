import { Box, Alert, Card, CardHeader, Typography } from "@mui/material";
import ChartGestionSolicitud from "../components/chartGestionSolicitud";
import ChartAreaStats from "../components/chartAreaStats";
import ChartMotivoStats from "../components/chartMotivoStats";

function Home({ open, handleClose, message }) {
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
          height: '100%',
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
    </Box>
  );
}

export default Home;

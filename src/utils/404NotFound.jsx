import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function ErrorHandler() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        bgcolor: "#f5f7fa",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "#0b2f6d",
          fontWeight: 700,
          fontSize: { xs: "5rem", md: "8rem" },
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#0b2f6d",
          mb: 4,
          textAlign: "center",
        }}
      >
        Página no encontrada
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
          bgcolor: "#0b2f6d",
          color: "#fff",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontSize: "1.1rem",
          boxShadow: 2,
          "&:hover": {
            bgcolor: "#174ea6",
          },
        }}
      >
        Volver al Inicio
      </Button>
      <Typography
        variant="body2"
        sx={{
          color: "#0b2f6d",
          mt: 2,
          textAlign: "center",
        }}
      >
        La página que buscas no existe o ha sido movida.
      </Typography>
    </Box>
  );
}

export default ErrorHandler;
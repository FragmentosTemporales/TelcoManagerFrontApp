import { Box, Button, Alert, Typography } from "@mui/material";
import FormSolicitud from "../components/formSolicitud";
import { Link } from "react-router-dom";

function CreateArea({ open, handleClose, message }) {
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
        height: "90vh",
        backgroundColor: "#f5f5f5",
        paddingY: "60px",
      }}
    >
      {open && renderAlert()}
      <Box
        sx={{
            width: "50%"
        }}
      >
        <Link to="/modulo:solicitudes">
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", borderRadius: 2, width: "200px" }}
          >
            <Typography sx={{ color: "white" }}>
              Volver
            </Typography>
          </Button>
        </Link>
      </Box>
      <FormSolicitud />
    </Box>
  );
}

export default CreateArea;

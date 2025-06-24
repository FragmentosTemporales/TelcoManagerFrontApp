import { Box, Button, Alert } from "@mui/material";
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
        paddingTop: 8,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {open && renderAlert()}

      <FormSolicitud />
    </Box>
  );
}

export default CreateArea;

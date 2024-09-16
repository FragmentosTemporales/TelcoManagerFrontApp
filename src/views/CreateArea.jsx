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
        height: "100%",
        paddingTop: 8,
        borderRadius: 2,
      }}
    >
      {open && renderAlert()}
      <Box sx={{
              width: "50%",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              borderRadius: "0",
              mt: 3
            }}>
            <Link to='/solicitudes'>
            <Button variant="contained" sx={{background:'#0b2f6d'}}>
              ir a Solicitudes
            </Button>
            </Link>
        </Box>
      <FormSolicitud />
    </Box>
  );
}

export default CreateArea;
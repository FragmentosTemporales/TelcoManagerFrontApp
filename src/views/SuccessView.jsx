import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function SuccessView() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ width: "100%", display:'flex', justifyContent:'center', pb:4 }}>
        <Typography variant="h5">CREADO CORRECTAMENTE</Typography>
      </Box>
      <Link to="/">
        <Button
          variant="contained"
          sx={{ background: "#0b2f6d", borderRadius: "0px" }}
        >
          Volver
        </Button>
      </Link>
    </Box>
  );
}

export default SuccessView;

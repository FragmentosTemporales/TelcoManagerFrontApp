import { Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
const Whatsapp = () => {
  return (
    <Tooltip title="Reportar error">
      <Box
        sx={{
          position: "fixed",
          width: "55px",
          height: "55px",
          bottom: "30px",
          right: "30px",
          background: "#0df053",
          borderRadius: "50px",
          textAlign: "center",
          boxShadow: 5,
          transition: "transform 0.2s", // añadir transición al contenedor
          "&:hover": {
            transform: "scale(1.3)", // escalar el contenedor
          },
        }}
      >
        <Link
          to="https://api.whatsapp.com/send?phone=56950056126&text=Hola, quiero reportar una falla..."
          target="blank"
          style={{}}
        >
          <WhatsAppIcon sx={{ color: "white", height: "55px", fontSize:'40px' }} />
        </Link>
      </Box>
    </Tooltip>
  );
};

export default Whatsapp;

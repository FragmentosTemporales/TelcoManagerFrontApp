import { Box, Button, Tooltip, Typography } from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { downloadFile } from "../api/downloadApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function FlotaViewer({ data }) {
  const [filePath, setFilePath] = useState("");
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const downloader = async () => {
    try {
      const payload = { file_path: filePath };
      await downloadFile(payload, token);
      console.log("Archivo descargado exitosamente");
    } catch (error) {
      console.error("Error descargando el archivo:", error);
    }
  };

  useEffect(() => {
    if (data && data.Archivo !== "None") {
      setFilePath(data.Archivo);
    }
  }, [data]);

  return (
    <Box
      sx={{
        display: "column",
        alignItems: "flex-start",
        mb: 2,
        width: "100%",
      }}
    >
      {data && data["Fecha Evento"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
            Fecha Evento:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Fecha Evento"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Fecha Asignación"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
            Fecha Asignación:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Fecha Asignación"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Modelo Vehículo"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Modelo Vehículo:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Modelo Vehículo"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Patente"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Patente:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Patente"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Velocidad"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Velocidad:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Velocidad"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Ubicación"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Ubicación:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
          >
            {`${data["Ubicación"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Archivo"] !== "None" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
            Archivo:
          </Typography>
          <Tooltip title="Descargar Archivo" placement="right">
            <Button
              variant="contained"
              color="info"
              sx={{ fontWeight: "bold", ml: 2 }}
              onClick={downloader}
            >
              <SimCardDownloadIcon />
            </Button>
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
}

export default FlotaViewer;

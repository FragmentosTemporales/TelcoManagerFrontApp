import {
  Box,
  Button,
  CardContent,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
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
    <>
      <Box sx={{ width: "100%", textAlign: "start" }}>
        {data && data["Fecha Evento"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Fecha Evento:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Fecha Evento"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Fecha Asignación"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Fecha Asignación:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Fecha Asignación"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Modelo Vehículo"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Modelo Vehículo:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Modelo Vehículo"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Patente"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Patente:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Patente"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Velocidad"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Velocidad:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Velocidad"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Ubicación"] != "Sin información" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Ubicación:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {`${data["Ubicación"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Archivo"] !== "None" ? (
        <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: "text.primary",
                paddingLeft: 1,
              }}
            >
              Archivo:
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "75%",
                p: 1,
              }}
            >
              <Button
                onClick={downloader}
                variant="outlined"
                size="small"
                sx={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Descargar
              </Button>
            </Box>
          </Box>
      ) : null}

      </Box>
    </>
  );
}

export default FlotaViewer;

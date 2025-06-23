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

function RrhhViewer({ data }) {
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
      {data && data["Fecha Marcaje"] != "Sin información" ? (
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
            Fecha Marcaje:
          </Typography>
          <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
            {`${data["Fecha Marcaje"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Fecha Subida Documento"] != "Sin información" ? (
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
            Fecha Subida Documento:
          </Typography>
          <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
            {`${data["Fecha Subida Documento"]}`}
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

export default RrhhViewer;

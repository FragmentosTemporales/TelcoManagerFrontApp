import {
  Box,
  Button,
  CardContent,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { downloadFile } from "../api/downloadApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function PrevencionViewer({ data }) {
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
        {data && data["Auditor"] !== "Sin información" && (
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
              Auditor:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Auditor"]}
            </Typography>
          </Box>
        )}

        {data && data["Fecha Auditoria"] !== "Sin información" && (
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
              Fecha Auditoria:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Fecha Auditoria"]}
            </Typography>
          </Box>
        )}

        {data && data["Epp Auditado"] !== "Sin información" && (
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
              Epp Auditado:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Epp Auditado"]}
            </Typography>
          </Box>
        )}

        {data && data["Fecha Entrega Epp"] !== "Sin información" && (
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
              Fecha Entrega Epp:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Fecha Entrega Epp"]}
            </Typography>
          </Box>
        )}

        {data && data["Dirección"] !== "Sin información" && (
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
              Dirección:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Dirección"]}
            </Typography>
          </Box>
        )}

        {data && data["Declaración"] !== "Sin información" && (
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
              Declaración:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "75%",
              }}
            >
              {data["Declaración"]}
            </Typography>
          </Box>
        )}

        {data && data["Archivo"] !== "None" && (
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
        )}
      </Box>
    </>
  );
}

export default PrevencionViewer;

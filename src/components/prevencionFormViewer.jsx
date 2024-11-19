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
      <CardContent >
        <Paper sx={{ width: "100%", textAlign: "start" }}>
          {data && data["Auditor"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Auditor:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Auditor"]}
              </Typography>
            </Box>
          )}

          {data && data["Fecha Auditoria"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Fecha Auditoria:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Fecha Auditoria"]}
              </Typography>
            </Box>
          )}

          {data && data["Epp Auditado"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Epp Auditado:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Epp Auditado"]}
              </Typography>
            </Box>
          )}

          {data && data["Fecha Entrega Epp"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Fecha Entrega Epp:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Fecha Entrega Epp"]}
              </Typography>
            </Box>
          )}

          {data && data["Dirección"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Dirección:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Dirección"]}
              </Typography>
            </Box>
          )}

          {data && data["Declaración"] !== "Sin información" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Declaración:
              </Typography>
              <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
                {data["Declaración"]}
              </Typography>
            </Box>
          )}

          {data && data["Archivo"] !== "None" && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >
                Archivo:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", width: "70%", p: 1 }}>
                <Tooltip title="Descargar Archivo" placement="right">
                  <Button
                    onClick={downloader}
                    size="small"
                    sx={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: "bold",
                    }}
                  >
                    Descargar
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Paper>
      </CardContent>
    </>
  );
}

export default PrevencionViewer;

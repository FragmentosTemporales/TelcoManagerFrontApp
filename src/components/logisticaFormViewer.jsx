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

function LogisticaViewer({ data }) {
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
      {data && data["Fecha Evento"] != "Sin información" ? (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1,
                  width: "30%",
                }}
              >Fecha Evento:
          </Typography>
          <Typography sx={{ fontFamily: "initial", p: 1, width: "70%" }}>
            {`${data["Fecha Evento"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Archivo"] !== "None" ? (
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
      ) : null}
    </Paper>
      </CardContent>
    </>
  );
}

export default LogisticaViewer;

import { Box, Button, Tooltip, Typography } from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
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
    <Box
      sx={{
        display: "column",
        alignItems: "flex-start",
        mb: 2,
        width: "100%",
      }}
    >
      {data && data["Auditor"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Auditor:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Auditor"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Fecha Auditoria"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Fecha Auditoria:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Fecha Auditoria"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Epp Auditado"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Epp Auditado:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Epp Auditado"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Fecha Entrega Epp"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Fecha Entrega Epp:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Fecha Entrega Epp"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Dirección"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Dirección:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Dirección"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Declaración"] != "Sin información" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Declaración:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary", pl: 1 }}
          >
            {`${data["Declaración"]}`}
          </Typography>
        </Box>
      ) : null}

      {data && data["Archivo"] !== "None" ? (
        <Box sx={{ display: "flex", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
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

export default PrevencionViewer;

import { Box, Button, Typography } from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { downloadFile } from "../api/downloadApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import palette from "../theme/palette";

function FlotaViewer({ data }) {
  const [filePath, setFilePath] = useState("");
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  const downloader = async () => {
    try {
      const payload = { file_path: filePath };
  await downloadFile(payload);
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

  const rowSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2,
    px: 2,
    py: 1.2,
    mb: 1.2,
    border: `1px solid ${palette.borderSubtle}`,
    background: palette.cardBg,
    backdropFilter: "blur(6px)",
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "border-color .25s, box-shadow .25s, transform .25s",
    '&:hover': {
      borderColor: palette.accent,
      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)"
    }
  };

  const labelSx = {
    width: { lg: "25%", md: "40%", sm: "50%", xs: "55%" },
    color: palette.primary,
    fontWeight: 600,
    fontSize: 14.5,
    letterSpacing: 0.2,
    pr: 2,
    lineHeight: 1.4
  };

  const valueSx = {
    width: "75%",
    color: palette.textMuted,
    fontWeight: 500,
    fontSize: 14.5,
    lineHeight: 1.4,
    wordBreak: "break-word"
  };

  const gradientBtn = {
    background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 100%)`,
    color: '#fff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 13,
    px: 2.2,
    py: 0.9,
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    '&:hover': {
      background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)`,
      boxShadow: '0 6px 18px rgba(0,0,0,0.22)'
    }
  };

  const rows = [
    { key: 'Fecha Evento', label: 'Fecha Evento' },
    { key: 'Fecha Asignación', label: 'Fecha Asignación' },
    { key: 'Modelo Vehículo', label: 'Modelo Vehículo' },
    { key: 'Patente', label: 'Patente' },
    { key: 'Velocidad', label: 'Velocidad' },
    { key: 'Ubicación', label: 'Ubicación' }
  ];

  return (
    <Box sx={{ width: '100%', textAlign: 'start' }}>
      {rows.map(r => (
        data && data[r.key] !== 'Sin información' && (
          <Box key={r.key} sx={rowSx}>
            <Typography sx={labelSx}>{r.label}:</Typography>
            <Typography sx={valueSx}>{data[r.key]}</Typography>
          </Box>
        )
      ))}

      {data && data['Archivo'] !== 'None' && (
        <Box sx={rowSx}>
          <Typography sx={labelSx}>Archivo:</Typography>
          <Box sx={{ width: '75%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button onClick={downloader} size="small" sx={gradientBtn} startIcon={<SimCardDownloadIcon sx={{ fontSize: 18 }} />}>Descargar</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default FlotaViewer;

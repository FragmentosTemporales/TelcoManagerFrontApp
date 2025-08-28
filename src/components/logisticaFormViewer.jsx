import { Box, Button, Typography } from "@mui/material";
import { downloadFile } from "../api/downloadApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { palette } from "../theme/palette";

function LogisticaViewer({ data }) {
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

  return (
    <>
  <Box sx={{ width: "100%", textAlign: "start" }}>
        {data && data["Fecha Evento"] != "Sin información" ? (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, mb: .5, borderRadius: 2, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, boxShadow: '0 4px 10px -4px rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
        color: palette.primary,
        pl: 1,
        fontWeight: 600,
              }}
            >
              Fecha Evento:
            </Typography>
            <Typography
              sx={{
        color: palette.textMuted,
                width: "75%",
        fontWeight: 500,
              }}
            >
              {`${data["Fecha Evento"]}`}
            </Typography>
          </Box>
        ) : null}

        {data && data["Archivo"] !== "None" ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, mb: .5, borderRadius: 2, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, boxShadow: '0 4px 10px -4px rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
            <Typography
              sx={{
                width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                color: palette.primary,
                pl: 1,
                fontWeight: 600,
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
                variant="contained"
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 75%)`,
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2.5,
                  borderRadius: 2,
                  boxShadow: '0 6px 16px -4px rgba(0,0,0,0.45)',
                  '&:hover': { background: palette.primaryDark }
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

export default LogisticaViewer;

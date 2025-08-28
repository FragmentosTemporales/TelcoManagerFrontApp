import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAst } from "../api/prevencionAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";

function AstViewer() {
  const { formID } = useParams();
  const authState = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAst(formID);
      setData(res);
      setWorker(res.usuario);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rowInfoSx = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 2,
    px: 2,
    py: 1.2,
    mb: 1.2,
    border: `1px solid ${palette.borderSubtle}`,
    background: palette.cardBg,
    backdropFilter: 'blur(6px)',
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  };

  const labelSx = {
    width: { lg: '25%', md: '40%', sm: '50%', xs: '55%' },
    color: palette.primary,
    fontWeight: 600,
    fontSize: 14.5,
    pr: 1,
    lineHeight: 1.4
  };

  const valueSx = {
    width: '75%',
    color: palette.textMuted,
    fontWeight: 500,
    fontSize: 14.5,
    lineHeight: 1.4,
    wordBreak: 'break-word'
  };

  const longRowSx = {
    ...rowInfoSx,
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  const gradientBtn = {
    background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primaryDark} 85%)`,
    borderRadius: 2,
    width: 200,
    fontWeight: 600,
    letterSpacing: .4,
    boxShadow: '0 4px 14px -6px rgba(0,0,0,0.55)',
    '&:hover': { background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primary} 90%)` }
  };

  return (
    <MainLayout showNavbar={false}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', width: '100%', overflow: 'auto', background: palette.bgGradient, position: 'relative', py: 8,
        '::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 24% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)', pointerEvents: 'none' }
      }}>
        <Box sx={{ width: '80%', mt: 2 }}>
          <Link to="/form-ast-list" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={gradientBtn}>
              <Typography fontWeight={700} sx={{ color: '#fff' }}>VOLVER</Typography>
            </Button>
          </Link>
        </Box>
        {isLoading ? (
          <Box sx={{ width: '80%', mb: 4, mt: 3, border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', p: 3 }}>
            <Skeleton variant="rounded" width={'100%'} height={260} />
          </Box>
        ) : (
          <Box sx={{ width: '80%', mb: 6, mt: 3, border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)` }}>
              <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center', fontWeight: 700, letterSpacing: .6 }}>
                ANALISIS SEGURO DEL TRABAJO
              </Typography>
            </Box>
            <Box sx={{ p: 3, pt: 2 }}>
              {[
                { label: 'Nombre', value: worker.nombre },
                { label: 'Rut', value: worker.numDoc },
                { label: 'Empresa', value: worker.empresa.nombre },
                { label: 'Fecha', value: extractDate(data.fechaForm) },
              ].map((item, idx) => (
                <Box key={idx} sx={rowInfoSx}>
                  <Typography sx={labelSx}>{item.label}:</Typography>
                  <Typography sx={valueSx}>{item.value || 'Sin Información'}</Typography>
                </Box>
              ))}

              {[
                { label: '¿Existe riesgo de ser golpeado por un objeto?', value: data.golpeadoPor },
                { label: '¿Existe riesgo de una descarga eléctrica?', value: data.descargaElectrica },
                { label: '¿Existe riesgo de una caída en altura?', value: data.caidaAltura },
                { label: '¿Existe riesgo de tropiezo?', value: data.tropiezo },
                { label: '¿Existe la posibilidad de una distensión muscular, producto de un levantamiento, flexión o dislocación?', value: data.distensionMuscular },
                { label: '¿Existe la posibilidad de ser colisionado por otro vehículo?', value: data.colicionadoPor },
                { label: '¿Las condiciones del vehículo son adecuadas para desempeñar las labores diarias?', value: data.condicionVehicular },
                { label: '¿Se han identificado en el área de trabajo los posibles riesgos como piso resbaladizos, obstáculos, etc?', value: data.areaTrabajo },
                { label: '¿Se ha realizado la ventilación adecuada del espacio de trabajo en caso de realizar actividades en cámaras subterráneas?', value: data.ventilacionAdecuada },
                { label: '¿Se ha delimitado correctamente el área con barreras físicas, cintas de seguridad, conos, vallas u otros elementos?', value: data.areaDelimitada },
                { label: 'Medidas de control definidas', value: data.observacion },
              ].map((item, idx) => (
                <Box key={`long-${idx}`} sx={longRowSx}>
                  <Typography sx={{ ...labelSx, width: '100%', pr: 0 }}>{item.label}</Typography>
                  <Typography sx={{ ...valueSx, width: '100%', mt: 0.5 }}>{item.value || 'Sin Información'}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
export default AstViewer;

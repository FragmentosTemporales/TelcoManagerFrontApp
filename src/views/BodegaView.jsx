import { Box, Card, CardContent, CardHeader, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getNumeros } from "../api/totemAPI";
import { playAlertSound } from "../helpers/sounds";
import palette from "../theme/palette";

function BodegaViewer() {
  const [dataBodega, setDataBodega] = useState([]);
  const [dataLogistica, setDataLogistica] = useState([]);
  const [atencionBodega, setAtencionBodega] = useState([]);
  const [atencionLogistica, setAtencionLogistica] = useState([]);
  const [esperaBodega, setEsperaBodega] = useState([]);
  const [esperaLogistica, setEsperaLogistica] = useState([]);

  const estilo = { fontSize: '1rem', paddingY: '5px' };

  // shared styles
  const glassCard = {
    borderRadius: 3,
    overflow: 'hidden',
    m: 1,
    border: `1px solid ${palette.borderSubtle}`,
    background: palette.cardBg,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
  };
  const headerSx = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    color: '#fff',
    textAlign: 'center',
    py: 1
  };
  const personPaper = {
    p: '10px',
    m: '10px auto',
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(6px)',
    border: `1px solid ${palette.borderSubtle}`,
    transition: 'transform .25s, box-shadow .25s, background .3s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
      background: 'rgba(255,255,255,0.75)'
    }
  };

  const fetchData = async () => {
    try {
      const response = await getNumeros();
      const filteredDataBodega = response.filter(
        (item) => item.Estacion_ID === 400
      );
      const filteredDataLogistica = response.filter(
        (item) => item.Estacion_ID === 300
      );

      setDataBodega(filteredDataBodega);
      setDataLogistica(filteredDataLogistica);
    } catch (error) {
      console.error(error);
    }
  };

  const set_interval = () => (esperaBodega.length > 0 && esperaLogistica.length > 0 ? 7000 : 15000);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, set_interval());
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const NewAtencionBodega = dataBodega.filter(
      (item) => item.Estado === "En atención"
    );
    verificarAtencion(NewAtencionBodega, 1);
    setAtencionBodega(NewAtencionBodega);
    setEsperaBodega(dataBodega.filter((item) => item.Estado === "En espera"));
  }, [dataBodega]);

  useEffect(() => {
    const NewAtencionLogistica = dataLogistica.filter(
      (item) => item.Estado === "En atención"
    );
    verificarAtencion(NewAtencionLogistica, 2);
    setAtencionLogistica(NewAtencionLogistica);

    setEsperaLogistica(
      dataLogistica.filter((item) => item.Estado === "En espera")
    );
  }, [dataLogistica]);

  const verificarAtencion = (data, flag) => {
    if (data.length === 0) return;
    if (flag === 1) {
      if (JSON.stringify(atencionBodega) !== JSON.stringify(data)) playAlertSound();
    } else if (flag === 2) {
      if (JSON.stringify(atencionLogistica) !== JSON.stringify(data)) playAlertSound();
    }
  };

  const AtencionBodegaCard = ({ atencion }) => (
    <Card sx={glassCard}>
      <CardHeader title={<Typography variant="h6">EN ATENCIÓN BODEGA</Typography>} sx={headerSx} />
      <CardContent>
        {atencion && atencion.length > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {atencion.map((item, index) => (
                <Paper elevation={0} key={`ab-${index}`} sx={personPaper}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '2rem', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N° {item.Numero}</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '2rem', textAlign: 'center' }}>{item.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>Proceso: {item.Proceso}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>Atiende: {item.Atendedor}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>No hay personas en atención</Typography>
        )}
      </CardContent>
    </Card>
  );

  const AtencionLogisticaCard = ({ atencion }) => (
    <Card sx={glassCard}>
      <CardHeader title={<Typography variant="h6">EN ATENCIÓN LOGÍSTICA</Typography>} sx={headerSx} />
      <CardContent>
        {atencion && atencion.length > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {atencion.map((item, index) => (
                <Paper elevation={0} key={`al-${index}`} sx={personPaper}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '2rem', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N° {item.Numero}</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '2rem', textAlign: 'center' }}>{item.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>Proceso: {item.Proceso}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>Atiende: {item.Atendedor}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>No hay personas en atención</Typography>
        )}
      </CardContent>
    </Card>
  );

  const EsperaCard = ({ data, title }) => (
    <Card sx={glassCard}>
      <CardHeader title={<Typography variant="h6">{title}</Typography>} sx={headerSx} />
      <CardContent>
        {data && data.length > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {data.filter((_, i) => i % 2 === 0).map((item, idx) => (
                <Paper elevation={0} key={`e1-${idx}`} sx={personPaper}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Proceso:</Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Número:</Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Nombre:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.Proceso}</Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.Numero}</Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.nombre}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
            <Grid item xs={6}>
              {data.filter((_, i) => i % 2 !== 0).map((item, idx) => (
                <Paper elevation={0} key={`e2-${idx}`} sx={personPaper}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Proceso:</Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Número:</Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>Nombre:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.Proceso}</Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.Numero}</Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>{item.nombre}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>No hay personas en espera</Typography>
        )}
      </CardContent>
    </Card>
  );

  const EsperaLogisticaCard = null; // legacy removed

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', py: 6, minHeight: '90vh', background: palette.bgGradient, position: 'relative', '::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.09), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.07), transparent 65%)', pointerEvents: 'none' } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-evenly', width: '100%', gap: 2, px: 2 }}>
        <CardContent sx={{ width: '100%' }}>
          <AtencionLogisticaCard atencion={atencionLogistica} />
          <EsperaCard data={esperaLogistica} title="EN ESPERA LOGÍSTICA" />
        </CardContent>
        <CardContent sx={{ width: '100%' }}>
          <AtencionBodegaCard atencion={atencionBodega} />
          <EsperaCard data={esperaBodega} title="EN ESPERA BODEGA" />
        </CardContent>
      </Box>
    </Box>
  );
}

export default BodegaViewer;

// CLEAN REWRITE
import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardHeader, CardContent, LinearProgress, Skeleton } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import palette from '../theme/palette';
import { getInfoProyecto } from '../api/onnetAPI';

function ProyectoConsolidadoView() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const orderedFields = [
    'Proyecto','Nombre','Region','Agencia','Comuna','Direccion','Central FTTx','Target RTS','Semana Proyectada RTS','Semana Liberada','Prioridad Planificación','Semana Para Construir','Semana Aprobación Construcción','Estado Proyecto','Estado ONFC','Estado ONFI','Estado Recursos','Estado de Validacion Construccion','Estado Calidad','Estado Cruzada Logica','Estado Cruzada Fisica','Estado Permiso Privado','Estado Visita','Estado O&M','Tipo','Q Total CTO','Semana Actual','Rechazos Calidad','diasBandeja','uip','fixed_uip','Avance Empalmes','Avance Lineas','Informable SGS','Proyectos Construidos','Despliegue','Origen','NumeroVisitas','Gestor Permiso','Carta Entregada','Motivo Avance Permiso Privado','Carta Permiso Privado Firmada','Fecha Carta Permiso Privado Firmada','Fecha validacion Construccion','Semana Validación Construcción','Requiere Permisos','Fecha Liberado a Ventas','Orden Ingenieria','Orden Construccion','Fecha Permiso Obtenido','Empresa Adjudicada','Prioridad'
  ];

  const formatFecha = (k, v) => {
    if (k?.startsWith('Fecha') && v) {
      const d = new Date(v);
      if (!isNaN(d)) return d.toLocaleDateString();
    }
    return v;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await getInfoProyecto(id);
      setData(resp[0]);
    } catch (e) {
      setMessage('Error al cargar el proyecto');
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const gradient = palette.bgGradient;
  const glass = {
    position: 'relative',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.80) 100%)',
    backdropFilter: 'blur(14px)',
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: 3,
    boxShadow: '0 8px 28px -4px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)',
      pointerEvents: 'none',
      mixBlendMode: 'overlay'
    }
  };

  return (
    <Box sx={{ py:6, px:{xs:2,sm:3}, minHeight:'90vh', width:'100%', background:gradient, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', '::before':{content:'""', position:'absolute', inset:0, background:'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 65%)', pointerEvents:'none'} }}>
      {open && (
        <Alert severity="info" onClose={() => setOpen(false)} sx={{ mb:3, borderRadius:2, boxShadow:3 }}>
          {message}
        </Alert>
      )}
      <Box sx={{ width:'100%', maxWidth:1350, mx:'auto', mb:3 }}>
        <Link to="/proyectos-onnet">
          <Button variant="contained" sx={{ borderRadius:2, fontWeight:'bold', borderColor:palette.primary, color:palette.primary, minWidth:200 }}>Volver</Button>
        </Link>
      </Box>
      {isLoading ? (
        <Card sx={{ ...glass, width:'100%', maxWidth:1350 }}>
          <CardHeader titleTypographyProps={{ fontSize:18, fontWeight:'bold' }} title="Cargando Proyecto" sx={{ background:`linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`, color:'#fff', py:1.2 }} />
          <CardContent>
            <LinearProgress />
            <Skeleton variant="rectangular" animation="wave" sx={{ mt:3, width:'100%', height:260, borderRadius:2 }} />
          </CardContent>
        </Card>
      ) : data && (
        <Card sx={{ ...glass, width:'100%', maxWidth:1350 }}>
          <CardHeader titleTypographyProps={{ fontSize:18, fontWeight:'bold' }} title={`Proyecto: ${data.Proyecto || data.Nombre || 'Detalle'}`} subheader={data.Nombre || ''} subheaderTypographyProps={{ sx:{ color:'rgba(255,255,255,0.9)', fontSize:12 } }} sx={{ background:`linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`, color:'#fff', py:1.2 }} />
          <CardContent>
            <Box component="table" sx={{ width:'100%', borderCollapse:'collapse' }}>
              <Box component="thead">
                <Box component="tr">
                  {['Ítem','Valor','Ítem','Valor'].map(h => (
                    <Box component="th" key={h} sx={{ textAlign:'left', borderBottom:1, p:1, bgcolor:palette.primaryDark, color:'#fff', fontWeight:'bold', fontSize:13 }}>{h}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {(() => {
                  const entries = orderedFields.map(k => [k, data[k]]).filter(([k,_]) => k in data);
                  const rows = [];
                  for (let i=0;i<entries.length;i+=2){
                    const [k1,v1] = entries[i];
                    const pair2 = entries[i+1];
                    const k2 = pair2?pair2[0]:'';
                    const v2 = pair2?pair2[1]:'';
                    rows.push(
                      <Box component="tr" key={k1}>
                        <Box component="td" sx={{ p:1, borderBottom:1, borderColor:'#eee', bgcolor:'rgba(255,255,255,0.55)', fontWeight:'bold', width:'18%' }}>{k1}</Box>
                        <Box component="td" sx={{ p:1, borderBottom:1, borderColor:'#eee', width:'32%', fontSize:13 }}>{v1 === null || v1 === '' ? <em>Sin información</em> : formatFecha(k1, v1)}</Box>
                        <Box component="td" sx={{ p:1, borderBottom:1, borderColor:'#eee', bgcolor:'rgba(255,255,255,0.55)', fontWeight:'bold', width:'18%' }}>{k2}</Box>
                        <Box component="td" sx={{ p:1, borderBottom:1, borderColor:'#eee', width:'32%', fontSize:13 }}>{k2 === '' ? '' : (v2 === null || v2 === '' ? <em>Sin información</em> : formatFecha(k2, v2))}</Box>
                      </Box>
                    );
                  }
                  return rows;
                })()}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ProyectoConsolidadoView;

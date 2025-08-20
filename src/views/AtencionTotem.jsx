import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Grid, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Typography, Divider } from '@mui/material';
import { getUserInfo, getNumeros, getSiguiente, saltarNumero, enAtencion } from '../api/totemAPI';
import { getReversas, updateReversas } from '../api/logisticaAPI';
import { useSelector } from 'react-redux';
import { extractDateOnly } from '../helpers/main';
import { MainLayout } from './Layout';
import palette from '../theme/palette';

function AtencionTotem() {
  const { token } = useSelector((s) => s.auth);
  const [estaciones, setEstaciones] = useState([]);
  const [selectedEstacion, setSelectedEstacion] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fila, setFila] = useState([]);
  const [espera, setEspera] = useState([]);
  const [atencion, setAtencion] = useState();
  const [data, setData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const gradient = `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`;
  const glass = { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', border: `1px solid ${palette.borderSubtle}`, borderRadius: 2, boxShadow: '0 6px 20px rgba(0,0,0,0.18)' };
  const headCell = { background: gradient, color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: '.4px' };
  const primaryBtn = { background: gradient, color: '#fff', fontWeight: 'bold', borderRadius: 2, boxShadow: '0 4px 14px rgba(0,0,0,0.25)', '&:hover': { background: palette.primaryDark } };

  useEffect(() => { (async () => { try { const res = await getUserInfo(token); setEstaciones(res); } catch (e) { console.log(e); } })(); }, [token]);

  const fetchData = async () => { if (!selectedEstacion) return; try { setIsSubmitting(true); const res = await getNumeros(); setFila(res.filter(r => r.Estacion_ID === selectedEstacion.EstacionID)); } catch (e) { console.log(e); } finally { setIsSubmitting(false); } };
  useEffect(() => { fetchData(); }, [selectedEstacion]);

  useEffect(() => { setEspera(fila.filter(f => f.Estado === 'En espera')); (async () => { if (!selectedEstacion) return; try { const res = await enAtencion(token, selectedEstacion.EstacionID, selectedEstacion.Modulo); setAtencion(res[0]); } catch (e) { console.log(e); } })(); }, [fila, selectedEstacion, token]);

  useEffect(() => { if (!selectedEstacion) return; const id = setInterval(() => { if (!atencion && espera.length === 0) fetchData(); }, 5000); return () => clearInterval(id); }, [selectedEstacion, atencion, espera]);

  const loadReversas = async () => { if (!atencion) return; setIsSubmitting(true); try { const res = await getReversas(token, atencion.Rut); setData(res.data.filter(i => i.entregado !== 1)); setFormattedData(res.data.map(i => ({ id: i.id, print: i.print ?? 1, entrega: i.entregado ?? 1, fuente: i.fuente ?? 1 }))); } catch (e) { console.log(e); } finally { setIsSubmitting(false); } };
  useEffect(() => { loadReversas(); }, [atencion]);

  const toggleCheckbox = (id, key) => setFormattedData(fd => fd.map(r => r.id === id ? { ...r, [key]: r[key] === 1 ? 0 : 1 } : r));
  const updateReversasSubmit = async () => { setIsSubmitting(true); try { await updateReversas(token, formattedData); } catch (e) { console.log(e); } finally { setIsSubmitting(false); fetchData(); } };
  const atenderSiguiente = async () => { if (!selectedEstacion) return; setIsSubmitting(true); try { await getSiguiente(token, selectedEstacion.EstacionID, selectedEstacion.Modulo); } catch (e) { console.log(e); } finally { setIsSubmitting(false); fetchData(); } };
  const SaltarNumero = async () => { if (!selectedEstacion) return; setIsSubmitting(true); try { await saltarNumero(token, selectedEstacion.EstacionID, selectedEstacion.Modulo); } catch (e) { console.log(e); } finally { setIsSubmitting(false); fetchData(); } };

  const reversasTable = (selectedEstacion && atencion && data.length > 0) ? (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Box sx={{ p: 2, ...glass }}>
        <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>LISTA DE REVERSAS PENDIENTES</Typography>
        <TableContainer sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {['FECHA','ORDEN','ANI','EQUIPO','SERIE','ENTREGADO','FUENTE'].map(h => <TableCell key={h} align="center" sx={headCell}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => { const f = formattedData.find(i => i.id === row.id) || {}; return (
                <TableRow key={row.id}>
                  <TableCell align="center" sx={{ fontSize: 12 }}>{extractDateOnly(row.fecha)}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>{row.orden}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>{row.ANI}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>{row.equipo}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>{row.serie}</TableCell>
                  <TableCell align="center"><Checkbox size="small" checked={f.entrega === 1} onChange={() => toggleCheckbox(row.id,'entrega')} /></TableCell>
                  <TableCell align="center"><Checkbox size="small" checked={f.fuente === 1} onChange={() => toggleCheckbox(row.id,'fuente')} /></TableCell>
                </TableRow> ); })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" sx={primaryBtn} disabled={isSubmitting} onClick={updateReversasSubmit}>{isSubmitting ? 'Procesando...' : 'Actualizar Reversa'}</Button>
        </Box>
      </Box>
    </Box>
  ) : null;

  return (
    <MainLayout>
      <Box sx={{ py: 6, px: { xs: 1.5, sm: 3 }, minHeight: '90vh', width: '100%', background: palette.bgGradient, position: 'relative', '::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 65%)', pointerEvents: 'none' }, overflowX: 'hidden' }}>
        <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', position: 'relative' }}>
        {!selectedEstacion && (
          <Box sx={{ width: '100%' }}>
            <Grid container justifyContent="center" spacing={2}>
              {estaciones.map((est, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Box
                    sx={{
                      p: 2,
                      minHeight: 150,
                      cursor: 'pointer',
                      ...glass,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform .25s, box-shadow .25s',
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 10px 26px rgba(0,0,0,0.34)' }
                    }}
                    onClick={() => setSelectedEstacion(est)}
                  >
                    <Box sx={{ background: gradient, color: '#fff', py: 1, borderRadius: 1, textAlign: 'center', mb: 1 }}>
                      <Typography fontWeight="bold" fontSize={{ xs: 14, md: 15 }}>{est.CENTRO}</Typography>
                    </Box>
                    <Typography fontWeight="bold" textAlign="center" fontSize={{ xs: 13, md: 14 }} sx={{ lineHeight: 1.2 }}>{est.Nombre_Estacion}</Typography>
                    <Typography fontWeight="bold" textAlign="center" fontSize={12} sx={{ opacity: .85 }}>Módulo #{est.Modulo}</Typography>
                  </Box>
                </Grid>
              ))}
              {estaciones.length === 0 && <Typography sx={{ mt: 4 }} color="text.secondary" textAlign="center" width="100%">No hay estaciones para seleccionar</Typography>}
            </Grid>
          </Box>
        )}
        {selectedEstacion && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1, background: gradient, color: '#fff', p: 2, borderRadius: 2, textAlign: 'center', fontWeight: 'bold', letterSpacing: '.5px' }}>{selectedEstacion.Nombre_Estacion}</Typography>
              <Button variant="contained" sx={{ ...primaryBtn, minWidth: { xs: '100%', md: 180 }, alignSelf: { xs: 'stretch', md: 'center' } }} onClick={() => setSelectedEstacion(undefined)}>Volver</Button>
            </Box>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, ...glass, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ mb: 1 }}>EN ATENCIÓN</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ flex: 1, minHeight: 140, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', px: 1 }}>
                    {atencion ? (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: 36, md: 42 }, lineHeight: 1 }}>{atencion.Numero || '00'}</Typography>
                        <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: 18, md: 22 }, mt: .5 }}>{atencion.nombre || 'Sin Nombre'}</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: 14, md: 16 } }}>{atencion.Rut || 'Sin Rut'}</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: 14, md: 16 }, mt: .5 }}>{atencion.Nombre_Proceso || 'Sin Proceso'}</Typography>
                      </Box>
                    ) : (
                      <Typography fontWeight="bold" sx={{ opacity: .7 }}>Sin Información</Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" color="error" disabled={isSubmitting} onClick={SaltarNumero} sx={{ fontWeight: 'bold', borderRadius: 2, flex: 1, minWidth: 150 }}>{isSubmitting ? '...' : 'Saltar'}</Button>
                    <Button variant="contained" disabled={isSubmitting} onClick={atenderSiguiente} sx={{ ...primaryBtn, flex: 1, minWidth: 150 }}>{isSubmitting ? '...' : 'Llamar'}</Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, ...glass, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ mb: 1 }}>EN ESPERA</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {espera.length > 0 ? (
                    <TableContainer sx={{ maxHeight: 320, flex: 1, overflowX: 'auto', borderRadius: 1, '::-webkit-scrollbar': { height: 6 }, '::-webkit-scrollbar-thumb': { background: palette.primaryDark, borderRadius: 3 } }}>
                      <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead>
                          <TableRow>{['NÚMERO','NOMBRE'].map(h => <TableCell key={h} align="center" sx={headCell}>{h}</TableCell>)}</TableRow>
                        </TableHead>
                        <TableBody>
                          {espera.map((e,i) => (
                            <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(240,245,250,0.55)' }}>
                              <TableCell align="center"><Typography fontWeight="bold" sx={{ fontSize: 12, overflowWrap: 'anywhere' }}>{e.Numero || '—'}</Typography></TableCell>
                              <TableCell align="center"><Typography fontWeight="bold" sx={{ fontSize: 12, overflowWrap: 'anywhere' }}>{e.nombre || '—'}</Typography></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography fontWeight="bold" textAlign="center" sx={{ opacity: .7 }}>SIN INFORMACIÓN</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>{reversasTable}</Box>
          </Box>
        )}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default AtencionTotem;

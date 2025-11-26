import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Modal,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from '@mui/material';
import { useEffect, useState } from "react";
import {
  getNumeros,
  darSalida,
  cancelarAtencion,
  getUserInfo,
} from "../api/totemAPI";
import { MainLayout } from "./Layout";
import palette from '../theme/palette';

function SupervisorViewRM() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [trabajador, setTrabajador] = useState(undefined);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [openModalSalida, setOpenModalSalida] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const fetchData = async () => {
    if (!userData || !userData.CENTRO) return;
    try {
      setIsSubmitting(true);
      const response = await getNumeros();
      const filteredData = response.filter((item) => item.CENTRO == userData.CENTRO);
      setData(filteredData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo();
      setUserData(res[0]);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  function validateSalida(trabajador) {
    if (trabajador) {
      if (trabajador.Estacion_ID === 500 || trabajador.Estacion_ID === 501) {
        return true;
      }
    }
    return false;
  }

  const handleSubmitSalida = async () => {
    try {
  setIsSubmittingModal(true);
  await darSalida(trabajador.Rut);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingModal(false);
      setTrabajador(undefined);
      setData([]);
      handleClose();
      fetchData();
    }
  };

  const handleSubmitCancelar = async () => {
    try {
  setIsSubmittingModal(true);
  await cancelarAtencion(trabajador.Rut);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingModal(false);
      setTrabajador(undefined);
      setData([]);
      handleClose();
      fetchData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setOpenModalCancelar(false);
    setOpenModalSalida(false);
  };

  const gradient = `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`;
  const glass = {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: 2,
    boxShadow: '0 8px 26px rgba(0,0,0,0.18)'
  };
  const headCell = { background: gradient, color: '#fff', fontWeight: 'bold' };
  const actionBtn = {
    background: gradient,
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 2,
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    '&:hover': { background: palette.primaryDark }
  };

  const modalBase = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 420, md: 460 },
    p: 3,
    ...glass
  };

  const setModalCancelar = () => (
    <Modal open={openModalCancelar} onClose={handleClose}>
      <Box sx={modalBase}>
        <Typography variant='h6' fontWeight='bold' textAlign='center' sx={{ mb: 1 }}>Cancelar Número</Typography>
        <Divider />
        <Typography sx={{ mt: 2, fontSize: 15, textAlign: 'center' }}>¿Deseas cancelar el número asignado al técnico seleccionado?</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant='contained' sx={actionBtn} disabled={isSubmittingModal} onClick={handleSubmitCancelar}>
            {isSubmittingModal ? 'Procesando...' : 'Cancelar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  // Fetch user info on mount (and if token changes)
  useEffect(() => {
    fetchUserInfo();
    window.scrollTo(0, 0);
  }, []);

  // Once userData (CENTRO) is available, fetch queue data and start polling
  useEffect(() => {
    if (!userData || !userData.CENTRO) return;
    fetchData();
    const id = setInterval(() => {
      fetchData();
    }, 6000);
    return () => clearInterval(id);
  }, [userData]);

  const setModalSalida = () => (
    <Modal open={openModalSalida} onClose={handleClose}>
      <Box sx={modalBase}>
        <Typography variant='h6' fontWeight='bold' textAlign='center' sx={{ mb: 1 }}>Dar Salida</Typography>
        <Divider />
        <Typography sx={{ mt: 2, fontSize: 15, textAlign: 'center' }}>¿Deseas dar salida al técnico seleccionado?</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant='contained' sx={actionBtn} disabled={isSubmittingModal} onClick={handleSubmitSalida}>
            {isSubmittingModal ? 'Procesando...' : 'Salida'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
  const trabajadorFields = trabajador ? [
    { label: 'Nombre', value: trabajador.nombre },
    { label: 'Rut', value: trabajador.Rut },
    { label: 'Estación', value: trabajador.Estacion },
    { label: 'Centro', value: trabajador.CENTRO },
    { label: 'Proceso', value: trabajador.Proceso },
    { label: 'Estado', value: trabajador.Estado },
    { label: 'Atendedor', value: trabajador.Atendedor },
    { label: 'Número', value: trabajador.Numero },
  ] : [];

  return (
    <MainLayout showNavbar={true}>
      <Box sx={{ py: 6, px: { xs: 1.5, sm: 3 }, minHeight: '90vh', background: palette.bgGradient, position: 'relative', '::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.12), transparent 55%), radial-gradient(circle at 86% 78%, rgba(255,255,255,0.09), transparent 60%)', pointerEvents: 'none' } }}>
        {openModalCancelar && setModalCancelar()}
        {openModalSalida && setModalSalida()}
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          {isSubmitting && data.length === 0 ? (
            <Skeleton variant='rounded' sx={{ width: '100%', height: 420, borderRadius: 3, opacity: .5 }} />
          ) : (
            <>
              {trabajador && (
                <Card sx={{ mb: 4, ...glass, overflow: 'hidden' }}>
                  <CardHeader title={<Typography fontWeight='bold' sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' }, letterSpacing: '.5px' }}>Técnico Seleccionado</Typography>} sx={{ background: gradient, color: '#fff', textAlign: 'center', py: 1.5 }} />
                  <CardContent sx={{ pt: 3 }}>
                    <Grid container spacing={1}>
                      {trabajadorFields.map((f,i) => (
                        <Grid key={i} item xs={6} sm={3} md={3}>
                          <Box sx={{ p: 1, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 'bold', opacity: .7 }}>{f.label}</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 'bold', mt: .5 }}>{f.value || `Sin ${f.label}`}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                      <Button variant='contained' color='error' onClick={() => setOpenModalCancelar(true)} disabled={isSubmittingModal} sx={{ fontWeight: 'bold', flex: 1, minWidth: 140 }}>Cancelar</Button>
                      <Button variant='contained' disabled={!validateSalida(trabajador) || isSubmittingModal} onClick={() => setOpenModalSalida(true)} sx={{ ...actionBtn, flex: 1, minWidth: 140 }}>Salida</Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
              {data.length > 0 ? (
                <Card sx={{ ...glass }}>
                  <TableContainer sx={{ maxHeight: 480 }}>
                    <Table stickyHeader size='small'>
                      <TableHead>
                        <TableRow>
                          {['NOMBRE','ESTACIÓN','ACCIONES'].map(h => (
                            <TableCell key={h} align='center' sx={headCell}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item, idx) => (
                          <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(240,245,250,0.55)' }}>
                            <TableCell align='center' sx={{ fontSize: 12 }}>{item.nombre || 'Sin Nombre'}</TableCell>
                            <TableCell align='center' sx={{ fontSize: 12 }}>{item.Estacion || 'Sin Estación'}</TableCell>
                            <TableCell align='center'>
                              <Button variant='contained' size='small' sx={actionBtn} onClick={() => { setTrabajador(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Seleccionar</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ) : (
                <Alert severity='info' sx={{ mt: 4, borderRadius: 2, fontWeight: 'bold' }}>Sin información</Alert>
              )}
            </>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default SupervisorViewRM;

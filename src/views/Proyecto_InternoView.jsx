import {
  Alert,
  Box,
  Button,
  Modal,
  MenuItem,
  Select,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from '@mui/icons-material/Close';
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProyectosByArea, UpdateTarea, DeleteProyectoInterno } from "../api/proyectos_internos_api";
import { palette } from "../theme/palette";
import { MainLayout } from "./Layout";
import ModuleHeader from "../components/ModuleHeader";

function ProyectoInternoView() {
  const authState = useSelector((state) => state.auth);
  const { area, user_id } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState(undefined);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const estados = [
    { value: "PENDIENTE", label: "PENDIENTE" },
    { value: "GESTIONANDO", label: "GESTIONANDO" },
    { value: "FINALIZADA", label: "FINALIZADA" },
    { value: "CANCELADA", label: "CANCELADA" },
  ];

  const [tarea, setTarea] = useState({});

  const [localEstados, setLocalEstados] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const toggleProject = (projectIndex) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectIndex]: !prev[projectIndex],
    }));
  };

  const fetchData = async () => {
    setIsSubmitting(true);
    try {
      const response = await getProyectosByArea(area.areaID, page);
      setData(response.data);
      setPages(response.pages);
      setTotal(response.total);
      // Reset local estados when fetching new data
      setLocalEstados({});
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage(
        "Error al obtener los datos. Por favor, inténtelo de nuevo más tarde."
      );
      setAlertType("error");
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEstadoChange = async (e) => {
    const payload = {
      titulo: tarea.titulo,
      estado: tarea.estado,
      descripcion: tarea.descripcion,
      proyecto_id: tarea.proyecto_id,
      userID: tarea.userID
    }
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await UpdateTarea(tarea.id, payload);
      setMessage("Estado de tarea actualizado correctamente");
      setAlertType("success");
      fetchData(); // Refresh data after updating estado
    } catch (error) {
      console.error("Error updating estado:", error);
      setMessage("Error al actualizar el estado de la tarea");
      setAlertType("error");
    }
    setOpen(true);
    setIsSubmitting(false);
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
    fetchData();
  };

  const getButtons = () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={{ background: "#142a3d" }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={{ background: "#142a3d" }}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{ background: "#142a3d" }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </Box>
  );

  const modalRender = () => (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',   // mantener ancho
        bgcolor: palette.cardBg,
        borderRadius: 3,
        border: `1px solid ${palette.borderSubtle}`,
        boxShadow: '0 18px 48px -12px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        backdropFilter: 'blur(6px)',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.2,
          background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 55%, ${palette.accent} 130%)`,
          color: '#fff'
        }}>
          <Typography id="modal-title" variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: .5 }}>
            Confirmar cambio de estado
          </Typography>
          <IconButton size="small" onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { color: '#fff' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between' }}>
          <Typography id="modal-description" sx={{ fontSize: '.95rem', color: palette.primaryDark, lineHeight: 1.35 }}>
            El nuevo estado será:
            {' '}<Chip size='small' label={tarea.estado || '—'} sx={{ ml: .5, fontWeight: 600, bgcolor: tarea.estado === 'FINALIZADA' ? palette.accent : (tarea.estado === 'CANCELADA' ? palette.danger : palette.primary), color: '#fff' }} />
          </Typography>
          <Divider sx={{ borderColor: palette.borderSubtle }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: .5 }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ minWidth: 120, textTransform: 'none', borderColor: palette.borderSubtle, color: palette.primary, fontWeight: 500, '&:hover': { borderColor: palette.accent, backgroundColor: palette.accentSoft } }} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="contained" onClick={handleEstadoChange} disabled={isSubmitting} sx={{ minWidth: 140, backgroundColor: palette.primary, textTransform: 'none', fontWeight: 600, letterSpacing: .4, boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)', '&:hover': { backgroundColor: palette.primaryDark } }}>
              {isSubmitting ? 'Procesando...' : 'Confirmar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )


  const getSelectValue = (tarea) => {
    // First check if there's a local state for this task
    if (localEstados[tarea.id]) {
      return localEstados[tarea.id];
    }

    // Otherwise, use the original state from the task
    return tarea.estado
      ? tarea.estado
      : "";
  };

  useEffect(() => {
    area && area.areaID && fetchData();
  }, [area]);


  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          minHeight: "90vh",
          py: "70px",
          position: "relative",
          background: palette.bgGradient,
          overflow: "hidden",
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: "radial-gradient(circle at 18% 25%, rgba(255,255,255,0.09), transparent 60%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.06), transparent 65%)",
            pointerEvents: 'none'
          }
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{ width: "90%", mb: 2, borderRadius: 3, boxShadow: 4, backdropFilter: 'blur(4px)', background: palette.cardBg, border: `1px solid ${palette.borderSubtle}` }}
          >
            {message}
          </Alert>
        )}

        <ModuleHeader
          title={area ? area.descri : "Cargando..."}
          subtitle="Gestión y seguimiento de proyectos internos"
          divider
        />

        <Box
          sx={{
            width: "95%",
            mt: 2,
            px: 2,
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/modulo:crear-proyecto-interno"
            sx={{
              width: "200px",
              background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
              color: '#fff',
              fontWeight: 600,
              letterSpacing: '.5px',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              textShadow: '0 1px 2px rgba(0,0,0,0.35)',
              boxShadow: '0 6px 18px -4px rgba(0,0,0,0.45), 0 2px 6px -1px rgba(0,0,0,0.35)',
              transition: 'all .35s',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
              },
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
              },
              '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
              '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
            }}
          >
            Crear Nuevo
          </Button>
        </Box>

        {isSubmitting && (!data || data.length === 0) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}
        {modalRender()}
        {data && data.length > 0 && data.map((proyecto, index) => (
          <Box
            key={index}
            sx={{
              width: '95%',
              background: palette.cardBg,
              borderRadius: 3,
              p: 2,
              my: 2,
              border: `1px solid ${palette.borderSubtle}`,
              backdropFilter: 'blur(4px)',
              transition: 'border-color .3s, box-shadow .35s, transform .35s',
              boxShadow: '0 6px 20px -6px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)',
                opacity: 0,
                transition: 'opacity .6s'
              },
              '&:hover': { borderColor: palette.accent, boxShadow: '0 14px 34px -6px rgba(0,0,0,0.42)', transform: 'translateY(-4px)', '&:before': { opacity: 1 } }
            }}
          >
            <Box
              onClick={() => toggleProject(index)}
              sx={{
                borderRadius: 2,
                py: 1,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': { backgroundColor: palette.accentSoft }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 600, mb: 1, ml: 1, color: palette.primary, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {proyecto.nombre ? proyecto.nombre : 'Sin Nombre'}
                  {proyecto.tareas && proyecto.tareas.length > 0 && (
                    <Chip size='small' label={`${proyecto.tareas.length} tarea${proyecto.tareas.length !== 1 ? 's' : ''}`} sx={{ bgcolor: palette.accentSoft, color: palette.primary, fontWeight: 500 }} />
                  )}
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ mb: 1, ml: 1, fontSize: '14px', fontStyle: 'italic', color: palette.textMuted }}
                >
                  {proyecto.descripcion ? proyecto.descripcion : 'Sin Descripcion'}
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    to={`/modulo:crear-tarea-interna/${proyecto.id}`}
                    variant='contained'
                    sx={{ ml: 1, mb: 1, width: '200px', backgroundColor: palette.primary, textTransform: 'none', fontWeight: 600, letterSpacing: .4, '&:hover': { backgroundColor: palette.primaryDark } }}
                    disabled={!(proyecto.userID == user_id) || isSubmitting}
                  >
                    Gestionar Tareas
                  </Button>
                  <Button
                    variant='contained'
                    sx={{ ml: 1, mb: 1, width: '100px', backgroundColor: palette.primary, textTransform: 'none', fontWeight: 600, letterSpacing: .4, '&:hover': { backgroundColor: palette.primaryDark } }}
                    component={Link}
                    to={`/modulo:crear-proyecto-interno/${proyecto.id}`}
                    disabled={!(proyecto.userID == user_id) || isSubmitting}
                  >
                    Editar
                  </Button>
                  <Tooltip title={!(proyecto.userID == user_id) ? 'Solo el creador puede eliminar' : 'Eliminar proyecto definitivamente'} arrow>
                    <span>
                      <Button
                        variant='contained'
                        disabled={!(proyecto.userID == user_id) || isSubmitting}
                        color='error'
                        sx={{ ml: 1, mb: 1, width: '100px', textTransform: 'none', fontWeight: 600, letterSpacing: .4 }}
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
                            setIsSubmitting(true);
                            try {
                              const response = await DeleteProyectoInterno(proyecto.id);
                              console.log('Proyecto eliminado:', response);
                              setMessage('Proyecto eliminado correctamente');
                              setAlertType('success');
                              fetchData();
                            } catch (error) {
                              console.error('Error eliminando proyecto:', error);
                              setMessage('Error al eliminar el proyecto');
                              setAlertType('error');
                            } finally {
                              setOpen(true);
                              setIsSubmitting(false);
                            }
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
              {proyecto.tareas && proyecto.tareas.length > 0 && (
                <IconButton sx={{ transition: 'transform .4s', color: palette.primary, '&:hover': { color: palette.accent }, transform: expandedProjects[index] ? 'rotate(180deg)' : 'none' }}>
                  {expandedProjects[index] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </Box>
            {!isSubmitting && proyecto.tareas && proyecto.tareas.length > 0 && expandedProjects[index] && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, ml: 1, color: palette.primary }}>Tareas</Typography>
                {proyecto.tareas.map((tarea, tareaIndex) => (
                  <Box
                    key={tareaIndex}
                    sx={{
                      backgroundColor: palette.accentSoft,
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                      mx: 1,
                      border: `1px solid ${palette.borderSubtle}`,
                      display: 'flex',
                      flexDirection: { lg: 'row', xs: 'column' },
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'box-shadow .35s, transform .35s, border-color .35s',
                      boxShadow: '0 3px 12px -4px rgba(0,0,0,0.18)',
                      '&:hover': { boxShadow: '0 10px 26px -6px rgba(0,0,0,0.30)', borderColor: palette.accent, transform: 'translateY(-3px)' }
                    }}
                  >
                    <Box sx={{ width: { lg: '100%' } }}>
                      <Typography variant='body1' sx={{ fontWeight: 600, mb: 0.5, color: palette.primary }}>
                        {tarea.titulo ? tarea.titulo : 'Sin Titulo'}
                      </Typography>
                      {/* Estado como chip visual */}
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 600, mt: 0.5, color: palette.primaryDark, display: 'inline-flex', alignItems: 'center', gap: 1 }}
                      >
                        {tarea.estado && (
                          <Chip
                            label={tarea.estado}
                            size='small'
                            sx={{
                              fontWeight: 600,
                              letterSpacing: .4,
                              bgcolor: tarea.estado === 'FINALIZADA' ? palette.accent : (tarea.estado === 'CANCELADA' ? palette.danger : palette.primary),
                              color: '#fff'
                            }}
                          />
                        )}
                      </Typography>
                      <Typography variant='body2' sx={{ mt: 0.5, fontStyle: 'italic', color: palette.textMuted }}>
                        {tarea.usuario && tarea.usuario.nombre ? tarea.usuario.nombre : 'Sin Estado'}
                      </Typography>
                      <Typography variant='body2' sx={{ mt: 0.5, fontStyle: 'italic', color: palette.textMuted }}>
                        {tarea.descripcion ? tarea.descripcion : 'Sin Descripcion'}
                      </Typography>
                    </Box>
                    <Box sx={{ width: { lg: '100%' }, my: 1 }}>
                      <form>
                        <Select
                          disabled={!(tarea.userID == user_id) || isSubmitting}
                          variant='outlined'
                          size='small'
                          onChange={(e) => { setTarea({ ...tarea, estado: e.target.value }); setOpenModal(true); }}
                          sx={{ width: '100%', mt: 1, bgcolor: 'white', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: palette.borderSubtle }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.accent }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.accent }, fontSize: '.85rem' }}
                          value={getSelectValue(tarea)}
                        >
                          {estados.map((estado) => (
                            <MenuItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </form>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
        <Fade in timeout={400}>
          <Box sx={{ mt: 1 }}>{getButtons()}</Box>
        </Fade>
      </Box>
    </MainLayout>
  );
}

export default ProyectoInternoView;

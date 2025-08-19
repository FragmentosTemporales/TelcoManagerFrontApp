import {
  Alert,
  Box,
  Button,
  Divider,
  Modal,
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  IconButton,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProyectosByArea, UpdateTarea, DeleteProyectoInterno } from "../api/proyectos_internos_api";
import { MainLayout } from "./Layout";

function ProyectoInternoView() {
  const authState = useSelector((state) => state.auth);
  const { token, area, user_id } = authState;
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
      const response = await getProyectosByArea(token, area.areaID, page);
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
      await UpdateTarea(tarea.id, payload, token);
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
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "150px",
        width: "600px",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="modal-title" variant="h6" component="h2">
          ¿Desea modificar el estado de la tarea?
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          El nuevo estado será : {tarea.estado}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" sx={{ backgroundColor: "#142a3d" }} onClick={handleEstadoChange} disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Confirmar"}
          </Button>
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
          backgroundColor: "#f5f5f5",
          minHeight: "90vh",
          paddingY: "70px",
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{ width: "90%", marginBottom: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box
          sx={{
            width: "95%",
            backgroundColor: "white",
            borderRadius: 2,
            padding: 2,
            border: "2px solid #dfdeda",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {area ? area.descri : "Cargando..."}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "95%",
            marginTop: 2,
            paddingX: 2,
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/modulo:crear-proyecto-interno"
            sx={{
              backgroundColor: "#142a3d",
              color: "white",
              borderRadius: 2,
              width: "200px"
            }}
          >
            Crear Nuevo
          </Button>
        </Box>

        {isSubmitting && (!data || data.length === 0) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}
        {modalRender()}
        {data && data.length > 0
          ? data.map((proyecto, index) => (
            <Box
              key={index}
              sx={{
                width: "95%",
                backgroundColor: "white",
                borderRadius: 2,
                padding: 2,
                marginY: 2,
                border: "1px solid #dfdeda",
              }}
            >
              <Box
                onClick={() => toggleProject(index)}
                sx={{
                  borderRadius: 2,
                  paddingY: 1,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: 1, marginLeft: 1 }}
                  >
                    {proyecto.nombre ? proyecto.nombre : "Sin Nombre"}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 1,
                      marginLeft: 1,
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#555",
                    }}
                  >
                    {proyecto.descripcion
                      ? proyecto.descripcion
                      : "Sin Descripcion"}
                  </Typography>
                  <Box>
                    <Button
                      component={Link}
                      to={`/modulo:crear-tarea-interna/${proyecto.id}`}
                      variant="contained"
                      sx={{ marginLeft: 1, marginBottom: 1, width: "200px", backgroundColor: "#142a3d" }}
                      disabled={!(proyecto.userID == user_id) || isSubmitting}
                    >
                      Gestionar Tareas
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ marginLeft: 1, marginBottom: 1, width: "100px", backgroundColor: "#142a3d" }}
                      component={Link}
                      to={`/modulo:crear-proyecto-interno/${proyecto.id}`}
                      disabled={!(proyecto.userID == user_id) || isSubmitting}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="contained"
                      disabled={!(proyecto.userID == user_id) || isSubmitting}
                      color="error"
                      sx={{ marginLeft: 1, marginBottom: 1, width: "100px" }}
                      onClick={async () => {
                        if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.")) {
                          setIsSubmitting(true);
                          try {
                            const response = await DeleteProyectoInterno(token, proyecto.id);
                            console.log("Proyecto eliminado:", response);
                            setMessage("Proyecto eliminado correctamente");
                            setAlertType("success");
                            fetchData(); // Refresh data after deletion
                          } catch (error) {
                            console.error("Error eliminando proyecto:", error);
                            setMessage("Error al eliminar el proyecto");
                            setAlertType("error");
                          } finally {
                            setOpen(true);
                            setIsSubmitting(false);
                          }
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                  {proyecto.tareas && proyecto.tareas.length > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        marginLeft: 1,
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      {proyecto.tareas.length} tarea
                      {proyecto.tareas.length !== 1 ? "s" : ""}
                    </Typography>
                  )}
                </Box>
                {proyecto.tareas && proyecto.tareas.length > 0 && (
                  <IconButton>
                    {expandedProjects[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>

              {isSubmitting && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                  <CircularProgress />
                </Box>
              )}
              {!isSubmitting && proyecto.tareas &&
                proyecto.tareas.length > 0 &&
                expandedProjects[index] && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: 1,
                        marginLeft: 1,
                      }}
                    >
                      Tareas
                    </Typography>
                    {proyecto.tareas.map((tarea, tareaIndex) => (
                      <Box
                        key={tareaIndex}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          padding: 2,
                          borderRadius: 1,
                          marginBottom: 1,
                          marginX: 1,
                          border: "1px solid #e0e0e0",
                          display: "flex",
                          flexDirection: { lg: "row", xs: "column" },
                        }}
                      >
                        <Box sx={{ width: { lg: "100%" } }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", marginBottom: 0.5 }}
                          >
                            {tarea.titulo ? tarea.titulo : "Sin Titulo"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", marginTop: 0.5 }}
                          >
                            {tarea.estado && tarea.estado
                              ? tarea.estado
                              : "Sin Estado"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ marginTop: 0.5, fontStyle: "italic" }}
                          >
                            {tarea.usuario && tarea.usuario.nombre
                              ? tarea.usuario.nombre
                              : "Sin Estado"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ marginTop: 0.5, fontStyle: "italic" }}
                          >
                            {tarea.descripcion
                              ? tarea.descripcion
                              : "Sin Descripcion"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: { lg: "100%" },
                            marginY: 1,
                          }}
                        >
                          <form>
                            <Select
                              disabled={!(tarea.userID == user_id) || isSubmitting}
                              variant="standard"
                              onChange={(e) => {
                                //                                handleSelectChange(tarea.id, e.target.value);
                                setTarea({ ...tarea, estado: e.target.value })
                                setOpenModal(true);

                              }}
                              sx={{ width: "100%", marginTop: 1 }}
                              value={getSelectValue(tarea)}
                            >
                              {estados.map((estado) => (
                                <MenuItem
                                  key={estado.value}
                                  value={estado.value}
                                >
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
          ))
          : null}
          {getButtons()}
      </Box>
    </MainLayout>
  );
}

export default ProyectoInternoView;

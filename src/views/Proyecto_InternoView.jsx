import {
  Alert,
  Box,
  Button,
  Divider,
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
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProyectosByArea, crearEstadoTarea } from "../api/proyectos_internos_api";

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
  const estados = [
    { value: "PENDIENTE", label: "PENDIENTE" },
    { value: "GESTIONANDO", label: "GESTIONANDO" },
    { value: "FINALIZADA", label: "FINALIZADA" },
    { value: "CANCELADA", label: "CANCELADA" },
  ];
  const [estadoForm, setEstadoForm] = useState({
    tarea_id: "",
    descripcion: "",
  });
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
      console.log("Response from API:", response);
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
    e.preventDefault();
    setIsSubmitting(true);
    try {

      const response = await crearEstadoTarea(estadoForm, token);
      console.log("Estado actualizado:", response);
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
  };

  const handleSelectChange = (tareaId, newValue) => {
    // Update local state for immediate UI feedback
    setLocalEstados(prev => ({
      ...prev,
      [tareaId]: newValue
    }));

    // Update form state for submission
    setEstadoForm({
      tarea_id: tareaId,
      descripcion: newValue,
    });
  };

  const getSelectValue = (tarea) => {
    // First check if there's a local state for this task
    if (localEstados[tarea.id]) {
      return localEstados[tarea.id];
    }

    // Otherwise, use the original state from the task
    return tarea.estado_tarea && tarea.estado_tarea.length > 0
      ? tarea.estado_tarea[tarea.estado_tarea.length - 1].descripcion
      : "";
  };

  useEffect(() => {
    area && area.areaID && fetchData();
  }, [area]);

  return (
    <Box
      sx={{
        paddingTop: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        minHeight: "90vh",
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
          disabled
          sx={{ 
            backgroundColor: "#0b2f6d", 
            color: "white", 
            borderRadius: 2, 
            width: "200px" }}
        >
          Crear Nuevo
        </Button>
      </Box>

      {isSubmitting && (!data || data.length === 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

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
                          {tarea.estado_tarea && tarea.estado_tarea.length > 0
                            ? tarea.estado_tarea[
                              tarea.estado_tarea.length - 1
                            ].descripcion
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
                        <form onSubmit={handleEstadoChange}>
                          <Select
                            disabled={!(tarea.userID == user_id) || isSubmitting}
                            variant="standard"
                            onChange={(e) => {
                              console.log(e.target.value);
                              handleSelectChange(tarea.id, e.target.value);
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
                          <Button
                            variant="contained"
                            sx={{
                              marginTop: 1,
                              width: "100%",
                              backgroundColor: "#0b2f6d",
                            }}
                            disabled={!(tarea.userID == user_id) || isSubmitting}
                            type="submit"
                            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                          >
                            {isSubmitting ? "Actualizando..." : "Actualizar"}
                          </Button>
                        </form>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
          </Box>
        ))
        : null}
    </Box>
  );
}

export default ProyectoInternoView;

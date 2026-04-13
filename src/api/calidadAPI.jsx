import client from './axiosClient';

export const createRegistroReparacion = async (payload) => {
  try {
    const response = await client.post('/create-reparacion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createZonaCalidad = async (payload) => {
  try {
    const response = await client.post('/create-zona', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTecnicoCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tecnico', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTipoFaltaCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tipo-falta', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTipoInspeccionCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tipo-inspeccion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparaciones = async (page, payload) => {
  try {
    const response = await client.post(`/get-reparaciones/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getRespaldos = async (page, payload) => {
  try {
    const response = await client.post(`/get-respaldos/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparacionByID = async (reparacion_id) => {
  try {
    const response = await client.get(`/get-reparacion/${reparacion_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getRespaldoByID = async (respaldo_id) => {
  try {
    const response = await client.get(`/get-respaldo/${respaldo_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getRespaldosUsers = async () => {
  try {
    const response = await client.get(`/get-respaldo-users`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getZonaItoTecnico = async () => {
  try {
    const response = await client.get(`/get-zona-ito-tecnico`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTecnicos = async () => {
  try {
    const response = await client.get(`/get-tecnicos`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparacionesExcel = async () => {
  try {
    const response = await client.get('/get-all-reparaciones-excel', { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'reparaciones.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const getRespaldosExcel = async () => {
  try {
    const response = await client.get('/get-all-respaldos-excel', { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'respaldos.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const getFormulariosCalidadReactiva = async (page, payload) => {
  try {
    const response = await client.post(`/POST/formularios-calidad-reactiva/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getFormularioCalidadReactiva = async (id) => {
  try {
    const response = await client.get(`/GET/formulario-calidad-reactiva/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getFormulariosReactivosExcel = async () => {
  try {
    const response = await client.get('/GET/all-formularios-calidad-reactiva-excel', { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'formularios_calidad_reactiva.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const getPlantillaQuickBaseSGS = async (id_qb, pro) => {
  try {
    const response = await client.get(`/GET/planilla-quickbase-sgs/${id_qb}&${pro}`, { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', `Actividades_Materiales_${id_qb}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const getListaRelatoresTallerCalidad = async (zona_id) => {
  try {
    const response = await client.get(`/GET/lista-relatores-taller-calidad/${zona_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getListaZonasTallerCalidad = async () => {
  try {
    const response = await client.get(`/GET/lista-zonas-taller-calidad`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getListaCursosCalidad = async () => {
  try {
    const response = await client.get(`/GET/lista-cursos-calidad`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTop20CursosAgendados = async () => {
  try {
    const response = await client.get(`/GET/top20-cursos-agendados`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getCursosActivos = async () => {
  try {
    const response = await client.get(`/GET/cursos-agendados-disponibles`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getInscritosCurso = async (curso_agendado_id) => {
  try {
    const response = await client.get(`/GET/inscritos-curso/${curso_agendado_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createRelatorTallerCalidad = async (payload) => {
  try {
    const response = await client.post('/POST/create-relator-taller-calidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createZonaTallerCalidad = async (payload) => {
  try {
    const response = await client.post('/POST/create-zona-taller-calidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createInscripcionTecnico = async (payload) => {
  try {
    const response = await client.post('/POST/agendar-tecnico-curso-calidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createCursoCalidad = async (payload) => {
  try {
    const response = await client.post('/POST/create-curso-calidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const agendarCursoCalidad = async (payload) => {
  try {
    const response = await client.post('/POST/agendar-curso-calidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateRelatorTallerCalidad = async (id, payload) => {
  try {
    const response = await client.put(`/PUT/update-relator-taller-calidad/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateZonaTallerCalidad = async (id, payload) => {
  try {
    const response = await client.put(`/PUT/update-zona-taller-calidad/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateCursoCalidad = async (id, payload) => {
  try {
    const response = await client.put(`/PUT/update-curso-calidad/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getCursosAsignados = async () => {
  try {
    const response = await client.get(`/GET/cursos-asignados-relator`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateTecnicoInscritoCurso = async (tecnico_id, payload) => {
  try {
    const response = await client.put(`/PUT/update-tecnico-inscrito-curso/${tecnico_id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
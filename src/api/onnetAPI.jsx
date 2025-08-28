import client from './axiosClient';

export const getQMacroEstado = async () => {
  try {
    const response = await client.get('/get-q-macro-estado');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getQProyectosConResponsable = async () => {
  try {
    const response = await client.get('/get-q-estado-con-responsable');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getQProyectosSinResponsable = async () => {
  try {
    const response = await client.get('/get-q-estado-sin-responsable');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getInfoProyecto = async (proyecto) => {
  try {
    const response = await client.get(`/get-info-proyecto/${proyecto}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectosFiltrados = async (payload, page) => {
  try {
    const response = await client.post(`/get-proyectos-filtrados/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getOptionToFilter = async () => {
  try {
    const response = await client.get('/get-option-filters');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const sendPlantillaConstruccion = async (payload) => {
  try {
    const response = await client.post('/load-construccion-geral', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const sendPlantillaAgendaProyecto = async (payload) => {
  try {
    const response = await client.post('/load-agenda-visitas-geral', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

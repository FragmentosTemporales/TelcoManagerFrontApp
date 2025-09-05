import client from './axiosClient';


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

export const loadConsumosOnnet = async (payload) => {
  try {
    const response = await client.post(`/load-plantilla`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectosByEmpresa = async () => {
  try {
    const response = await client.get(`/get-proyectos-asignados-por-empresa`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectobyID = async (proyecto_id) => {
  try {
    const response = await client.get(`/get-proyecto-filtrado-onnet-cubicado/${proyecto_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateValidacionEstado = async (payload) => {
  try {
    const response = await client.put('/update-cubicado-estado', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
import client from './axiosClient';


export const getInfoProyecto = async (proyecto) => {
  try {
    const response = await client.get(`/get-info-proyecto/${proyecto}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectosFiltradosCubicados = async (payload, page) => {
  try {
    const response = await client.post(`/get-proyectos-filtrados-cubicados/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectosFiltradosLinkVNO = async (payload, page) => {
  try {
    const response = await client.post(`/get-proyectos-filtrados-link-vno/${page}`, payload);
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

export const loadConsumosOnnetVNO = async (payload) => {
  try {
    const response = await client.post(`/load-plantilla-vno`, payload);
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

export const getProyectoVNObyID = async (proyecto_id) => {
  try {
    const response = await client.get(`/get-proyecto-filtrado-onnet-link-vno/${proyecto_id}`);
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

export const updateValidacionEstadoVNO = async (payload) => {
  try {
    const response = await client.put('/update-cubicado-vno-estado', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const loadOnnetAprobados = async (proyecto_id) => {
  try {
    const response = await client.get(`/load-info-onnet-quickbase/${proyecto_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createCubicadoUnitario = async (payload) => {
  try {
    const response = await client.post('/create-cubicado-onnet', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createCubicadoVNOUnitario = async (payload) => {
  try {
    const response = await client.post('/create-cubicado-onnet-vno', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getRelateds = async () => {
  try {
    const response = await client.get(`/get-relateds`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateCubicadoRecord = async (payload) => {
  try {
    const response = await client.post('/create-registro-actualizacion-record', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

import client from './axiosClient';

const prefix = '/proyecto-interno';

export const getProyectosByArea = async (areaID, page) => {
  try {
    const response = await client.get(`${prefix}/get-proyectos-by-area/${page}&${areaID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUsuariosByArea = async (areaID) => {
  try {
    const response = await client.get(`${prefix}/get-usuarios-by-area/${areaID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProyectobyID = async (proyectoID) => {
  try {
    const response = await client.get(`${prefix}/get-proyecto-by-id/${proyectoID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const crearEstadoTarea = async (payload) => {
  try {
    const response = await client.post('/proyecto-interno/create-estado-tarea', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const crearProyectoInterno = async (payload) => {
  try {
    const response = await client.post(`${prefix}/create-proyecto`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const crearTareaProyectoInterno = async (payload) => {
  try {
    const response = await client.post(`${prefix}/create-tarea`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const UpdateProyectoInterno = async (proyectoID, payload) => {
  try {
    const response = await client.put(`${prefix}/update-proyecto-interno/${proyectoID}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const UpdateTarea = async (tareaID, payload) => {
  try {
    const response = await client.put(`${prefix}/update-tarea/${tareaID}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const DeleteProyectoInterno = async (proyectoID) => {
  try {
    const response = await client.delete(`${prefix}/update-proyecto-interno/${proyectoID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
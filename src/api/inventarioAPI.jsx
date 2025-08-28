import client from './axiosClient';

const prefix = '/inventario';

export const getTecnicos = async (payload) => {
  try {
    const response = await client.post(`${prefix}/get-usuarios`, payload);
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTecnicosStats = async () => {
  try {
    const response = await client.get(`${prefix}/get-usuarios-stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const avanzarTecnico = async (payload) => {
  try {
    const response = await client.post(`${prefix}/avanzar-usuarios`, payload);
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


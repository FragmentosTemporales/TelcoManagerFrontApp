import client from './axiosClient';

export const createRegistroReparacion = async (payload) => {
  try {
    const response = await client.post('/create-reparacion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparaciones = async (page) => {
  try {
    const response = await client.get(`/get-reparaciones/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

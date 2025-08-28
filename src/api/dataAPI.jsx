import client from './axiosClient';

export const getObjetivos = async (gerencia, mes) => {
  try {
    const response = await client.get(`/get-objetivos/${gerencia}/${mes}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateObjetivo = async (objetivoID, payload) => {
  try {
    const response = await client.put(`/update-objetivo/${objetivoID}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

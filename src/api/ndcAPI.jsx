import client from './axiosClient';

export const fetchConsumidasMensual = async () => {
  try {
    const response = await client.get('/GET/ordenes-consumidas-mensual');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
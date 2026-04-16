import client from './axiosClient';

export const fetchResumenOrdenesNDC = async () => {
  try {
    const response = await client.get('/GET/resumen-ordenes-ndc');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const fetchDetalleOrdenConsumida = async (orden) => {
  try {
    const response = await client.get(`/GET/detalle-orden-consumida/${orden}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
import client from './axiosClient';

export const getLogQueryTimeTotal = async () => {
  try {
    const response = await client.get('/get-log-query-time-total');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getLogQueryTimeTotalByEndpoint = async (endpoint) => {
  try {
    const response = await client.get(`/get-log-query-time-total-by-endpoint/${endpoint}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTopLogQuery = async () => {
  try {
    const response = await client.get('/get-top-log-query');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getLogQuerySemanal = async () => {
  try {
    const response = await client.get('/get-log-query-semanal');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
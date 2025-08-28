import client from './axiosClient';

export const getCategoriasTicket = async () => {
  try {
    const response = await client.get('/get-ticket-categorias');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getStatsTicket = async () => {
  try {
    const response = await client.get('/get-ticket-stats');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTicket = async (payload) => {
  try {
    const response = await client.post('/create-ticket', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUserTicket = async (page) => {
  try {
    const response = await client.get(`/get-ticket-by-user/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTicketera = async (payload) => {
  try {
    const response = await client.post('/get-ticketera-interna', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateTicketEstado = async (payload) => {
  try {
    const response = await client.post('/update-ticket-gestion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getTicketInfo = async (logID) => {
  try {
    const response = await client.get(`/get-ticket-info/${logID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const sendTicketInfo = async (logID) => {
  try {
    const response = await client.get(`/send-ticket-info/${logID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

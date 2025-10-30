import client from './axiosClient';

export const fetchReversas = async () => {
  try {
    const response = await client.get('/get-reversa');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReversas = async (rut) => {
  try {
    const response = await client.get(`/reversa-serie/${rut}`);
    return response;
  } catch (error) {
    throw error.message;
  }
};

export const updateReversas = async (dataform) => {
  try {
    const data = { data: dataform };
    const response = await client.put('/reversa_serie_pendiente', data);
    return response.data;
  } catch (error) {
    console.error(
      'Error response:',
      error.response ? error.response.data : error.message
    );
    throw error.message;
  }
};

export const getReversaData = async () => {
  try {
    const response = await client.get('/get-data-reversas');
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const fetchPendientesSinConsumo = async (tipo) => {
  try {
    const response = await client.get(`/ndc-bot/get-pendientes-sin-consumo/${tipo}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const fetchErroresConConsumo = async () => {
  try {
    const response = await client.get('/ndc-bot/errores_con_consumo');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const fetchLogsErrores = async () => {
  try {
    const response = await client.get('/ndc-bot/ndc-logs-error');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const fetchLogsSessions = async () => {
  try {
    const response = await client.get('/ndc-bot/ndc-sessions-info-stats');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const fetchSessionsFamiliaMateriales = async (sessionId) => {
  try {
    const response = await client.get(`/ndc-bot/ndc-sessions-info-grupo-material/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


export const updateOrdenSinConsumo = async (payload) => {
  try {
    const data = { data: payload };
    const response = await client.put('/ndc-bot/update-pendientes-sin-consumo', data);
    return response.data;
  } catch (error) {
    console.error(
      'Error response:',
      error.response ? error.response.data : error.message
    );
    throw error.message;
  }
};


export const createOrdenValidada = async (payload) => {
  try {
    const response = await client.post('/ndc-bot/ndc-create-orden-validada', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

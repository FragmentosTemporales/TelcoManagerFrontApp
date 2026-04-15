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

export const getReversaDataUpdate = async () => {
  try {
    const response = await client.get('/get-data-reversas-update');
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

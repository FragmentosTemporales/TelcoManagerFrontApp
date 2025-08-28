import client from './axiosClient';

export const createFormFlota = async (payload) => {
  try {
    const response = await client.post('/create-formflota', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createFormPrevencion = async (payload) => {
  try {
    const response = await client.post('/create-formprevencion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createFormCalidad = async (payload) => {
  try {
    const response = await client.post('/create-formcalidad', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createFormRRHH = async (payload) => {
  try {
    const response = await client.post('/create-formrrhh', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createFormOperaciones = async (payload) => {
  try {
    const response = await client.post('/create-formoperaciones', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createFormLogistica = async (payload) => {
  try {
    const response = await client.post('/create-formlogistica', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

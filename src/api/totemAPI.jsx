import client from './axiosClient';

export const getNumeros = async () => {
  try {
    const response = await client.get('/get-numeros');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await client.get('/get-user-info');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSiguiente = async (EstacionID, moduloID) => {
  try {
    const response = await client.get(`/atender-siguiente/${EstacionID}&${moduloID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const saltarNumero = async (EstacionID, moduloID) => {
  try {
    const response = await client.get(`/saltar-numero/${EstacionID}&${moduloID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const darSalida = async (Rut) => {
  try {
    const response = await client.get(`/dar-salida/${Rut}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const cancelarAtencion = async (Rut) => {
  try {
    const response = await client.get(`/cancelar-numero/${Rut}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const enAtencion = async (EstacionID, moduloID) => {
  try {
    const response = await client.get(`/get-atencion/${EstacionID}&&${moduloID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
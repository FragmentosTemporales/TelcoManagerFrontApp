import client from './axiosClient';

export const getAllBacklog = async (page, payload) => {
  try {
    const response = await client.post(`/get-backlog-list/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBacklog = async (payload) => {
  try {
    const response = await client.post('/get-backlog', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createBacklogEstado = async (payload) => {
  try {
    const response = await client.post('/create-backlog-estado', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBacklogEstado = async (orden) => {
  try {
    const response = await client.get(`/get-backlog-estado/${orden}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getOrdenInfo = async (orden) => {
  try {
    const response = await client.get(`/get-orden/${orden}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
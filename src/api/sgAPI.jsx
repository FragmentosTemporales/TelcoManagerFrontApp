import client from './axiosClient';

export const createSG = async (payload) => {
  try {
    const response = await client.post('/create-sg', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

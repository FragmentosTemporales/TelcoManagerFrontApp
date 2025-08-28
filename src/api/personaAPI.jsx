import client from './axiosClient';

export const getPersona = async () => {
  try {
    const response = await client.get('/get-persona');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};



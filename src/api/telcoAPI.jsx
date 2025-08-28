import client from './axiosClient';

export const getLatestLogs = async () => {
  try {
    const response = await client.get('/latest-logs');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
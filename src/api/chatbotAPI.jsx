import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createChat = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-chat`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createChatValue = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-valoration`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

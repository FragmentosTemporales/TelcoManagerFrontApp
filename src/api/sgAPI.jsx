import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSG = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-sg`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

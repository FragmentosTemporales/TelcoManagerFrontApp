import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getPersona = async (token) => {
  try {
    const url = `${baseUrl}/get-persona`;
    const response = await axios.get(url, {
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



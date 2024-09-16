import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const onLogin = async (payload) => {
  try {
    const url = `${baseUrl}/login`;
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createPermiso = async (payload, token) => {
    try {
      const url = `${baseUrl}/create-permiso`;
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  };
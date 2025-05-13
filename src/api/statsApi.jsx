import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const getSGEstados = async (token) => {
    try {
      const url = `${baseUrl}/get-sg/estados`;
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


export const getMotivoStats = async (token) => {
    try {
      const url = `${baseUrl}/get-motivo/stats`;
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
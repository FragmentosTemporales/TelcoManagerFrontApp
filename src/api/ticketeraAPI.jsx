import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const getCategoriasTicket = async (token) => {
    try {
      const url = `${baseUrl}/get-ticket-categorias`;
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

  export const createTicket = async (payload, token) => {
    try {
      const url = `${baseUrl}/create-ticket`;
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
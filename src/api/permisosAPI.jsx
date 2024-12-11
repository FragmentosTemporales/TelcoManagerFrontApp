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
      throw error.response.data.error;
    }
  };

  export const getPermisos = async (token, id) => {
    try {
      const url = `${baseUrl}/get-permisos/${id}`;
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

  export const updatePermiso = async (token, payload, id) => {
    try {
      const url = `${baseUrl}/update-permiso/${id}`;
      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  }
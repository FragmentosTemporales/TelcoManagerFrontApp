import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSolicitudEstado = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-se`;
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

export const getSolicitudEstado = async (token) => {
  try {
    const url = `${baseUrl}/get-se`;
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

export const getUniqueSolicitudEstado = async (token, se_id) => {
  try {
    const id = se_id;
    const url = `${baseUrl}/get-se/${id}`;
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

export const updateSolicitudEstado = async (token, se_id, payload) => {
  try {
    const id = se_id;
    const data = payload
    const url = `${baseUrl}/update-se/${id}`;
    const response = await axios.put(url, data, {
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

export const deleteSolicitudEstado = async (token, se_id) => {
  try {
    const id = se_id;
    const url = `${baseUrl}/update-se/${id}`;
    const response = await axios.delete(url, {
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

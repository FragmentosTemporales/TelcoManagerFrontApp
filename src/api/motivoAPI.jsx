import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createMotivo = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-motivo`;
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

export const getMotivo = async (token) => {
  try {
    const url = `${baseUrl}/get-motivo`;
    const response = await axios.get(url, {
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

export const getUniqueMotivo = async (token, motivo_id) => {
  try {
    const id = motivo_id;
    const url = `${baseUrl}/get-motivo/${id}`;
    const response = await axios.get(url, {
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

export const getMotivoList = async (token, area_id) => {
  try {
    const id = area_id;
    const url = `${baseUrl}/get-motivos/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log('respuesta motivo list', response)
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const updateMotivo = async (token, motivo_id, payload) => {
  try {
    const id = motivo_id;
    const data = payload
    const url = `${baseUrl}/update-motivo/${id}`;
    const response = await axios.put(url, data, {
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

export const deleteMotivo = async (token, cargo_id) => {
  try {
    const id = cargo_id;
    const url = `${baseUrl}/update-motivo/${id}`;
    const response = await axios.delete(url, {
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

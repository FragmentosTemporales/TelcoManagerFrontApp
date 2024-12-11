import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSubMotivo = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-submotivo`;
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

export const getSubMotivo = async (token) => {
  try {
    const url = `${baseUrl}/get-submotivo`;
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

export const getUniqueSubMotivo = async (token, submotivo_id) => {
  try {
    const id = submotivo_id;
    const url = `${baseUrl}/get-submotivo/${id}`;
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

export const getSubMotivoList = async (token, motivo_id) => {
  try {
    const id = motivo_id;
    const url = `${baseUrl}/get-submotivos/${id}`;
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

export const updateSubMotivo = async (token, motivo_id, payload) => {
  try {
    const id = motivo_id;
    const data = payload
    const url = `${baseUrl}/update-submotivo/${id}`;
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

export const deleteSubMotivo = async (token, motivo_id) => {
  try {
    const id = motivo_id;
    const url = `${baseUrl}/update-submotivo/${id}`;
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

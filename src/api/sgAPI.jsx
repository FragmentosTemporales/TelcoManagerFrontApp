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
    throw error.message;
  }
};

export const getSG = async (token) => {
  try {
    const url = `${baseUrl}/get-sg`;
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

export const getUniqueSG = async (token, sg_id) => {
  try {
    const id = sg_id;
    const url = `${baseUrl}/get-sg/${id}`;
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

export const getSGList = async (token, logID) => {
  try {
    const id = logID;
    const url = `${baseUrl}/get-sgs/${id}`;
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

export const updateSG = async (token, sg_id, payload) => {
  try {
    const id = sg_id;
    const data = payload
    const url = `${baseUrl}/update-sg/${id}`;
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

export const deleteSG = async (token, motivo_id) => {
  try {
    const id = motivo_id;
    const url = `${baseUrl}/update-sg/${id}`;
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

import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createCCPA = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-ccpa`;
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

export const getCCPA = async (token) => {
  try {
    const url = `${baseUrl}/get-ccpa`;
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

export const getUniqueCCPA = async (token, ccpa_id) => {
  try {
    const id = ccpa_id;
    const url = `${baseUrl}/get-ccpa/${id}`;
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

export const updateCCPA = async (token, ccpa_id, payload) => {
  try {
    const id = ccpa_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-ccpa/${id}`;
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

export const deleteCCPA = async (token, ccpa_id) => {
  try {
    const id = ccpa_id;
    const url = `${baseUrl}/update-ccpa/${id}`;
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

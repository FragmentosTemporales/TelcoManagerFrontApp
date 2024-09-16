import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createArea = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-area`;
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

export const getArea = async (token) => {
  try {
    const url = `${baseUrl}/get-area`;
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

export const getUniqueArea = async (token, area_id) => {
  try {
    const id = area_id;
    const url = `${baseUrl}/get-area/${id}`;
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

export const updateArea = async (token, area_id, payload) => {
  try {
    const id = area_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-area/${id}`;
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

export const deleteArea = async (token, area_id) => {
  try {
    const id = area_id;
    const url = `${baseUrl}/update-area/${id}`;
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

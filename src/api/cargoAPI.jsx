import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createCargo = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-cargo`;
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

export const getCargo = async (token) => {
  try {
    const url = `${baseUrl}/get-cargo`;
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

export const getUniqueCargo = async (token, cargo_id) => {
  try {
    const id = cargo_id;
    const url = `${baseUrl}/get-cargo/${id}`;
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

export const updateCargo = async (token, cargo_id, payload) => {
  try {
    const id = cargo_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-cargo/${id}`;
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

export const deleteCargo = async (token, cargo_id) => {
  try {
    const id = cargo_id;
    const url = `${baseUrl}/update-cargo/${id}`;
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

import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createMP = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-mp`;
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

export const getMP = async (token) => {
  try {
    const url = `${baseUrl}/get-mp`;
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

export const getUniqueMP = async (token, mp_id) => {
  try {
    const id = mp_id;
    const url = `${baseUrl}/get-mp/${id}`;
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

export const updateMP = async (token, mp_id, payload) => {
  try {
    const id = mp_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-cc/${id}`;
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

export const deleteMP = async (token, mp_id) => {
  try {
    const id = mp_id;
    const url = `${baseUrl}/update-mp/${id}`;
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

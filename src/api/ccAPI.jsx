import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createCC = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-cc`;
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

export const getCC = async (token) => {
  try {
    const url = `${baseUrl}/get-cc`;
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

export const getUniqueCC = async (token, cc_id) => {
  try {
    const id = cc_id;
    const url = `${baseUrl}/get-cc/${id}`;
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

export const updateCC = async (token, cc_id, payload) => {
  try {
    const id = cc_id;
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

export const deleteCC = async (token, cc_id) => {
  try {
    const id = cc_id;
    const url = `${baseUrl}/update-cc/${id}`;
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

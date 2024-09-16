import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createCCP = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-ccp`;
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

export const getCCP = async (token) => {
  try {
    const url = `${baseUrl}/get-ccp`;
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

export const getUniqueCCP = async (token, ccp_id) => {
  try {
    const id = ccp_id;
    const url = `${baseUrl}/get-ccp/${id}`;
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

export const updateCCP = async (token, ccp_id, payload) => {
  try {
    const id = ccp_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-ccp/${id}`;
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

export const deleteCCP = async (token, ccp_id) => {
  try {
    const id = ccp_id;
    const url = `${baseUrl}/update-ccp/${id}`;
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

import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getLogQueryTimeTotal = async (token) => {
  try {
    const url = `${baseUrl}/get-log-query-time-total`;
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

export const getLogQueryTimeTotalByEndpoint = async (token, endpoint) => {
  try {
    const url = `${baseUrl}/get-log-query-time-total-by-endpoint/${endpoint}`;
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

export const getTopLogQuery = async (token) => {
  try {
    const url = `${baseUrl}/get-top-log-query`;
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

export const getLogQuerySemanal = async (token) => {
  try {
    const url = `${baseUrl}/get-log-query-semanal`;
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
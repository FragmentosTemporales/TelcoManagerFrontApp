import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getAllBacklog = async (token, page, payload) => {
  try {
    const url = `${baseUrl}/get-backlog-list/${page}`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const CreateBacklogPriority = async (token, payload) => {
  try {
    const url = `${baseUrl}/set-backlog-priority`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const getBacklog = async (payload, token) => {
  try {
    const url = `${baseUrl}/get-backlog`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createBacklogEstado = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-backlog-estado`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const getBacklogEstado = async (token, orden) => {
  try {
    const url = `${baseUrl}/get-backlog-estado/${orden}`;
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

export const getOrdenInfo = async (token, orden) => {
  try {
    const url = `${baseUrl}/get-orden/${orden}`;
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
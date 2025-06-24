import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getCategoriasTicket = async (token) => {
  try {
    const url = `${baseUrl}/get-ticket-categorias`;
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

export const createTicket = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-ticket`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const getUserTicket = async (page, token) => {
  try {
    const url = `${baseUrl}/get-ticket-by-user/${page}`;
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

export const getTicketera = async (payload, token) => {
  try {
    const url = `${baseUrl}/get-ticketera-interna`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const updateTicketEstado = async (payload, token) => {
  try {
    const url = `${baseUrl}/update-ticket-gestion`;
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

export const getTicketInfo = async (logID, token) => {
  try {
    const url = `${baseUrl}/get-ticket-info/${logID}`;
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
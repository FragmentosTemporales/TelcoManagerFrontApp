import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const createRegistroReparacion = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-reparacion`;
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

export const getReparaciones = async (token, page) => {
  try {
    const url = `${baseUrl}/get-reparaciones/${page}`;
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

import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const prefixUrl = `${baseUrl}/inventario`;


export const getTecnicos = async (payload, token) => {
  try {

    const url = `${prefixUrl}/get-usuarios`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error.response.data.error;
  }
};


export const avanzarTecnico = async (payload, token) => {
  try {

    const url = `${prefixUrl}/avanzar-usuarios`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error.response.data.error;
  }
};


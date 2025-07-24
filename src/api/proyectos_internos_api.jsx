import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getProyectosByArea = async (token, areaID, page) => {
  try {
    const url = `${baseUrl}/proyecto-interno/get-proyectos-by-area/${page}&${areaID}`;
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

export const crearEstadoTarea = async (payload, token) => {
  try {
    const url = `${baseUrl}/proyecto-interno/create-estado-tarea`;
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
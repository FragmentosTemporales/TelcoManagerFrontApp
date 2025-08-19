import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const prefixUrl = `${baseUrl}/proyecto-interno`;

export const getProyectosByArea = async (token, areaID, page) => {
  try {
    const url = `${prefixUrl}/get-proyectos-by-area/${page}&${areaID}`;
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

export const getUsuariosByArea = async (token, areaID) => {
  try {
    const url = `${prefixUrl}/get-usuarios-by-area/${areaID}`;
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

export const getProyectobyID = async (token, proyectoID) => {
  try {
    const url = `${prefixUrl}/get-proyecto-by-id/${proyectoID}`;
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

export const crearProyectoInterno = async (payload, token) => {
  try {
    const url = `${prefixUrl}/create-proyecto`;
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

export const crearTareaProyectoInterno = async (payload, token) => {
  try {
    const url = `${prefixUrl}/create-tarea`;
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

export const UpdateProyectoInterno = async (proyectoID, payload, token ) => {
  try {
    const url = `${prefixUrl}/update-proyecto-interno/${proyectoID}`;
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const UpdateTarea = async (tareaID, payload, token ) => {
  try {
    const url = `${prefixUrl}/update-tarea/${tareaID}`;
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const DeleteProyectoInterno = async (token, proyectoID) => {
  try {
    const url = `${prefixUrl}/update-proyecto-interno/${proyectoID}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
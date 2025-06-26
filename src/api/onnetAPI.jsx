import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const getQMacroEstado = async (token) => {
  try {
    const url = `${baseUrl}/get-q-macro-estado`;
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

export const getQProyectosConResponsable = async (token) => {
  try {
    const url = `${baseUrl}/get-q-estado-con-responsable`;
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

export const getQProyectosSinResponsable = async (token) => {
  try {
    const url = `${baseUrl}/get-q-estado-sin-responsable`;
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

export const getInfoProyecto = async (token, proyecto) => {
  try {
    const url = `${baseUrl}/get-info-proyecto/${proyecto}`;
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

export const getInfoSeguimiento = async (token, proyecto) => {
  try {
    const url = `${baseUrl}/get-seguimiento-proyecto/${proyecto}`;
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

export const getProyectosFiltrados = async (token, payload, page) => {
  try {
    const url = `${baseUrl}/get-proyectos-filtrados/${page}`;
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

export const getOptionToFilter = async (token) => {
  try {
    const url = `${baseUrl}/get-option-filters`;
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

export const sendPlantillaConstruccion = async (payload, token) => {
  try {
    const url = `${baseUrl}/load-construccion-geral`;
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

export const sendPlantillaAgendaProyecto = async (payload, token) => {
  console.log(payload);
  try {
    const url = `${baseUrl}/load-agenda-visitas-geral`;
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

export const createSeguimientoProyecto = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-seguimiento-proyecto`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response.data.error;
  }
};

export const updateSeguimientoProyecto = async (payload, token) => {
  try {
    const url = `${baseUrl}/update-seguimiento-proyecto`;
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response.data.error;
  }
};
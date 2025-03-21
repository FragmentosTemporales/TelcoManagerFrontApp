import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSolicitud = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-solicitud`;
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

export const getSolicitudes = async (token, page) => {
  try {
    const pagina = page
    const url = `${baseUrl}/get-solicitudes/${pagina}`;
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

export const getFilteredSolicitudes = async (token, estadoID, page) => {
  try {
    const pagina = page
    const estado = estadoID
    const url = `${baseUrl}/get-solicitudes/${estado}&${pagina}`;
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

export const getUniqueSolicitud = async (token, solicitud_id) => {
  try {
    const id = solicitud_id;
    const url = `${baseUrl}/get-solicitud/${id}`;
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

export const updateSolicitud = async (token, solicitud_id, payload) => {
  try {
    const id = solicitud_id;
    const data = payload
    const url = `${baseUrl}/update-solicitud/${id}`;
    const response = await axios.put(url, data, {
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

export const deleteSolicitud = async (token, solicitud_id) => {
  try {
    const id = solicitud_id;
    const url = `${baseUrl}/update-solicitud/${id}`;
    const response = await axios.delete(url, {
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

export const createFolio = async (payload, token) => {
  try {

    const url = `${baseUrl}/create-folio`;
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
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

export const getSolicitudesByUser = async (token, page) => {
  try {
    const url = `${baseUrl}/get-solicitudes-by-user/${page}`;
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

export const getSolicitudeStats = async (token) => {
  try {
    const url = `${baseUrl}/get-stats-solicitudes`;
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

export const getSolicitudeCCStats = async (token) => {
  try {
    const url = `${baseUrl}/get-stats-solicitud-cc`;
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

export const getSolicitudeTOPStats = async (token) => {
  try {
    const url = `${baseUrl}/get-stats-solicitud-tops`;
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

export const getSolicitudeStatsByUser = async (token) => {
  try {
    const url = `${baseUrl}/get-stats-solicitudes-by-user`;
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

export const getSolicitudesExcel = async (token) => {
  try {
    const url = `${baseUrl}/get-all-solicitudes-excel`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob", // Set the response type to "blob" to handle binary data
    });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", "solicitudes.xlsx"); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    return "Archivo descargado exitosamente."; // Optional success message
  } catch (error) {
    throw error.response?.data?.error || "Error al descargar el archivo.";
  }
};

export const getSolicitudesFiltradas = async (token, payload, page) => {
  try {
    const url = `${baseUrl}/get-filtered-solicitudes/${page}`;
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
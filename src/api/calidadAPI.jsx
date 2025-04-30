import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createAuditoria = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-auditoria`;
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

export const getAuditorias = async (token, page) => {
  try {
    const url = `${baseUrl}/get-auditorias/${page}`;
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

export const getAllAuditorias = async (token) => {
  try {
    const url = `${baseUrl}/get-all-auditorias`;
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
    link.setAttribute("download", "auditorias.xlsx"); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    return "Archivo descargado exitosamente."; // Optional success message
  } catch (error) {
    throw error.response?.data?.error || "Error al descargar el archivo.";
  }
};

export const getAuditoriasFiltradas = async (token, payload, page) => {
  try {
    const url = `${baseUrl}/get-filtered-auditorias/${page}`;
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

export const getAuditoriasStats = async (token, fecha) => {
  try {
    const url = `${baseUrl}/get-stats-auditorias/${fecha}`;
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

export const getAuditores = async (token) => {
  try {
    const url = `${baseUrl}/get-auditores`;
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
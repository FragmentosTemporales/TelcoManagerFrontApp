import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createAgendamiento = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-agendamiento`;
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

export const getAgendamientos = async (token, page) => {
  try {
    const url = `${baseUrl}/get-agendamientos/${page}`;
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

export const getAllAgendamientos = async (token, page) => {
  try {
    const url = `${baseUrl}/get-all-agendamientos/${page}`;
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

export const getDataAgendamientos = async (token, fecha) => {
  try {
    const url = `${baseUrl}/get-data-agendamientos/${fecha}`;
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

export const getDataFuturaAgendamientos = async (token) => {
  try {
    const url = `${baseUrl}/get-data-futura-agendamiento`;
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

export const getDataHistoricaAgendamientos = async (token) => {
  try {
    const url = `${baseUrl}/get-data-historica-agendamiento`;
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

export const filterAgendamiento = async (token, fechaInicio, fechaFin) => {
  try {
    const url = `${baseUrl}/agendamientos-filtered/${fechaInicio}&${fechaFin}`;
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

export const getDespachosSemenalExcel = async (token) => {
  try {
    const url = `${baseUrl}/get-despachos-semanales-excel`;
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
    link.setAttribute("download", "despachos.xlsx"); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    return "Archivo descargado exitosamente."; // Optional success message
  } catch (error) {
    throw error.response?.data?.error || "Error al descargar el archivo.";
  }
};
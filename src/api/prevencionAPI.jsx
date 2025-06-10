import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createAST = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formast`;
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


export const getAstList = async (token, page, payload) => {
  try {
    const url = `${baseUrl}/get-ast-list/${page}`;
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

export const getAst  = async (token, ID) => {
  try {
    const url = `${baseUrl}/get-ast/${ID}`;
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

export const getAstUsers  = async (token) => {
  try {
    const url = `${baseUrl}/get-ast-users`;
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

export const getNotAstCC  = async (token) => {
  try {
    const url = `${baseUrl}/get-ast-data-centro-costo`;
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

export const getDataCCStats = async (token, payload) => {
  try {
    const url = `${baseUrl}/get-filter-data-by-centro-costo`;
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

export const getAstHistoricoExcel = async (token) => {
  try {
    const url = `${baseUrl}/get-all-ast-form-excel`;
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
    link.setAttribute("download", "historicoAst.xlsx"); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    return "Archivo descargado exitosamente."; // Optional success message
  } catch (error) {
    throw error.response?.data?.error || "Error al descargar el archivo.";
  }
};
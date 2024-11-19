import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getProyectos = async (token) => {
  try {
    const url = `${baseUrl}/get-proyectos-consolidado`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

export const getProyectoUnico = async (token, proyectoID) => {
  try {
    const url = `${baseUrl}/unique-project/${proyectoID}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

export const getEmpresas = async (token) => {
  try {
    const url = `${baseUrl}/get-empresas`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw new Error("Failed to fetch");
  }
};

export const getAsignados = async (token) => {
  try {
    const url = `${baseUrl}/get-proyectos-asignados`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching asignados:", error);
    throw new Error("Failed to fetch asignados");
  }
};

export const getaLLAsignados = async (token) => {
  try {
    const url = `${baseUrl}/get-all-proyectos-asignados`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching asignados:", error);
    throw new Error("Failed to fetch asignados");
  }
};

export const createProject = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-proyecto`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

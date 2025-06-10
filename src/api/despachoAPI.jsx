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
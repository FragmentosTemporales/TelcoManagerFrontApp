import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchReversas = async (token) => {
  try {
    const url = `${baseUrl}/get-reversa`;

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

export const getReversas = async (token, rut) => {
  try {
    const url = `${baseUrl}/reversa-serie/${rut}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error.message;
  }
};

export const updateReversas = async (token, dataform) => {
  try {
    const data = { data: dataform };

    const url = `${baseUrl}/reversa_serie_pendiente`;

    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error response:",
      error.response ? error.response.data : error.message
    );
    throw error.message;
  }
};

export const getReversaData = async (token) => {
  try {
    const url = `${baseUrl}/get-data-reversas`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const fetchPendientesSinConsumo = async (token, tipo) => {
  try {
    const url = `${baseUrl}/ndc-bot/get-pendientes-sin-consumo/${tipo}`;

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

export const fetchPendientesStats = async (token) => {
  try {
    const url = `${baseUrl}/ndc-bot/get-pendientes-stats`;

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

export const fetchErroresConConsumo = async (token) => {
  try {
    const url = `${baseUrl}/ndc-bot/errores_con_consumo`;

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

export const fetchLogsErrores = async (token) => {
  try {
    const url = `${baseUrl}/ndc-bot/ndc-logs-error`;

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

export const fetchLogsSessions = async (token) => {
  try {
    const url = `${baseUrl}/ndc-bot/ndc-sessions-info-stats`;

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

export const fetchSessionsFamiliaMateriales = async (token, sessionId) => {
  try {
    const url = `${baseUrl}/ndc-bot/ndc-sessions-info-grupo-material/${sessionId}`;

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

export const updateOrdenSinConsumo = async (token, payload) => {
  try {
    const data = { data: payload };
    const url = `${baseUrl}/ndc-bot/update-pendientes-sin-consumo`;

    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error response:",
      error.response ? error.response.data : error.message
    );
    throw error.message;
  }
};


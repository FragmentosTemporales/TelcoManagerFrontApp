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
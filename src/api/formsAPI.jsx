import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createFormFlota = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formflota`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const createFormPrevencion = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formprevencion`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const createFormCalidad = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formcalidad`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const createFormRRHH = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formrrhh`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const createFormOperaciones = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formoperaciones`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const createFormLogistica = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formlogistica`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

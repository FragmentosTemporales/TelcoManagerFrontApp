import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const getNumeros = async (token) => {
    try {
      const url = `${baseUrl}/get-numeros`;
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

export const getUserInfo = async (token) => {
  try {
    const url = `${baseUrl}/get-user-info`;
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

export const getSiguiente = async (token, EstacionID, moduloID) => {
  try {
    const url = `${baseUrl}/atender-siguiente/${EstacionID}&${moduloID}`;
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

export const saltarNumero = async (token, EstacionID, moduloID) => {
  try {
    const url = `${baseUrl}/saltar-numero/${EstacionID}&${moduloID}`;
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

export const darSalida = async (token, Rut) => {
  try {
    const url = `${baseUrl}/dar-salida/${Rut}`;
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

export const cancelarAtencion = async (token, Rut) => {
  try {
    const url = `${baseUrl}/cancelar-numero/${Rut}`;
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
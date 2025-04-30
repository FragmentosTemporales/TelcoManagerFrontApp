import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const onLogin = async (payload) => {
  try {
    const url = `${baseUrl}/login`;
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createUser = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-user`;
    console.log(payload)
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

export const getUsers = async (token) => {
  try {
    const url = `${baseUrl}/get-users`;
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

export const getUsersEmpresa = async (token, empresaID) => {
  try {
    const url = `${baseUrl}/get-trabajadores/${empresaID}`;
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

export const updatePass = async (payload, token) => {
  try {
    const url = `${baseUrl}/update-password`;
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    throw error.response.data.error;
  }
}
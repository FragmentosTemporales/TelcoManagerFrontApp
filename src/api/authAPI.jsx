import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const dominionUrl = import.meta.env.VITE_DOMINION_URL

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

export const onLoginDominion = async (payload) => {
  try {
    const url = `${dominionUrl}/login`;
    
    // Convertir el payload a formato URL codificada
    const formData = new URLSearchParams();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
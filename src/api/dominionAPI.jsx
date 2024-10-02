import axios from "axios";

const baseUrl = import.meta.env.VITE_DOMINION_URL


export const onLoginDominion = async (payload) => {
  try {
    const url = `${baseUrl}/login`;
    
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
    throw error.message;
  }
};

export const getReversas = async (token, rut) => {
    try {
      const url = `${baseUrl}/reversa_serie/${rut}`;
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
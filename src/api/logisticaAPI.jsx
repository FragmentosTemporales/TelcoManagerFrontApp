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
    console.log(response)
    return response;
  } catch (error) {
    throw error.message;
  }
};
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getObjetivos = async (token, gerencia, mes) => {
  try {
    const url = `${baseUrl}/get-objetivos/${gerencia}/${mes}`;
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

export const updateObjetivo = async (token, objetivoID, payload) => {
  try {
    const id = objetivoID;
    const data = payload
    const url = `${baseUrl}/update-objetivo/${id}`;
    const response = await axios.put(url, data, {
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
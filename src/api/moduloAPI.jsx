import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getModulos = async (token) => {
  try {
    const url = `${baseUrl}/get-modulos`;
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
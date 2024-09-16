import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getNotificaciones = async (token) => {
  try {
    const url = `${baseUrl}/get-notificacion`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the full error object
    throw new Error("Failed to fetch notifications");
  }
};

export const updateNotificacion = async (token, payload, id) => {
  try {
    const notificacionID = id
    const url = `${baseUrl}/update-notificacion/${notificacionID}`;
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw new Error("Failed in update notifications");
  }
}
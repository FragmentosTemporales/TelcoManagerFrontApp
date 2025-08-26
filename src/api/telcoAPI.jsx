import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getLatestLogs = async () => {
  try {
    const url = `${baseUrl}/latest-logs`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
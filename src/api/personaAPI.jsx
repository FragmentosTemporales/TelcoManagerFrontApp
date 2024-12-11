import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createPersona = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-persona`;
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

export const getPersona = async (token) => {
  try {
    const url = `${baseUrl}/get-persona`;
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

export const getUniquePersona = async (token, persona_id) => {
  try {
    const id = persona_id;
    const url = `${baseUrl}/get-persona/${id}`;
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

export const updatePersona = async (token, persona_id, payload) => {
  try {
    const id = persona_id;
    const data = payload
    console.log('DATA: ', data)
    const url = `${baseUrl}/update-persona/${id}`;
    const response = await axios.put(url, data, {
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

export const deletePersona = async (token, persona_id) => {
  try {
    const id = persona_id;
    const url = `${baseUrl}/update-persona/${id}`;
    const response = await axios.delete(url, {
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

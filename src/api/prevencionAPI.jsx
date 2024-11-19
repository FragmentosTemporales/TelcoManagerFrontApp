import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const createAST = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-formast`;
    const response = await axios.post(url, payload, {
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


export const getAstList = async (token, page) => {
  try {
    const url = `${baseUrl}/get-ast-list/${page}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching AST List:", error);
    throw new Error("Failed to fetch AST List");
  }
};


export const getAstListUser  = async (token, ID, page) => {
  try {
    const url = `${baseUrl}/get-ast-list/${ID}&${page}`;
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


export const getAst  = async (token, ID) => {
  try {
    const url = `${baseUrl}/get-ast/${ID}`;
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
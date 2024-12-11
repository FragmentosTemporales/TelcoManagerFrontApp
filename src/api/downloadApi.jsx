import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const downloadFile = async (payload, token) => {
  try {
    const url = `${baseUrl}/download`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob", // Especifica que la respuesta será un blob
    });

    const contentType = response.headers["content-type"];
    const fileName = response.headers["content-disposition"]?.split("filename=")[1] || "archivo";

    // Crea un enlace para descargar
    const urlBlob = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = fileName; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob); // Libera la URL

  } catch (error) {
    console.error("Error al descargar el archivo:", error.message);
    throw error; // Lanza el error para que pueda ser manejado por quien llame a la función
  }
};

export const fetchFileUrl = async (payload, token) => {
  try {
    const url = `${baseUrl}/view-image`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    });

    // Crea un objeto URL temporal
    const fileUrl = URL.createObjectURL(response.data);
    return fileUrl;

  } catch (error) {
    console.error("Error al obtener el archivo:", error.message);
    throw error;
  }
};
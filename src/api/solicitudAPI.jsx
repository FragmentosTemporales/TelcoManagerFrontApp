import client from './axiosClient';

export const createSolicitud = async (payload) => {
  try {
    const response = await client.post('/create-solicitud', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSolicitudes = async (page) => {
  try {
    const response = await client.get(`/get-solicitudes/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSolicitudesByUser = async (page) => {
  try {
    const response = await client.get(`/get-solicitudes-by-user/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSolicitudePendientes = async () => {
  try {
    const response = await client.get('/get-solicitudes-pendientes');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


export const getSolicitudesExcel = async () => {
  try {
    const response = await client.get('/get-all-solicitudes-excel', { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'solicitudes.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const getSolicitudesFiltradas = async (payload, page) => {
  try {
    const response = await client.post(`/get-filtered-solicitudes/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getFilteredSolicitudes = async (estadoID, page) => {
  try {
    const response = await client.get(`/get-solicitudes/${estadoID}&${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUniqueSolicitud = async (solicitud_id) => {
  try {
    const response = await client.get(`/get-solicitud/${solicitud_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAreaMotivos = async () => {
  try {
    const response = await client.get('/get-motivos-solicitudes');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


export const createFolio = async (payload) => {
  try {
    const response = await client.post('/create-folio', payload);
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
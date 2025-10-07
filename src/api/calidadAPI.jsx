import client from './axiosClient';

export const createRegistroReparacion = async (payload) => {
  try {
    const response = await client.post('/create-reparacion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createZonaCalidad = async (payload) => {
  try {
    const response = await client.post('/create-zona', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTecnicoCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tecnico', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTipoFaltaCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tipo-falta', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createTipoInspeccionCalidad = async (payload) => {
  try {
    const response = await client.post('/create-tipo-inspeccion', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparaciones = async (page, payload) => {
  try {
    const response = await client.post(`/get-reparaciones/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparacionByID = async (reparacion_id) => {
  try {
    const response = await client.get(`/get-reparacion/${reparacion_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getZonaItoTecnico = async () => {
  try {
    const response = await client.get(`/get-zona-ito-tecnico`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getReparacionesExcel = async () => {
  try {
    const response = await client.get('/get-all-reparaciones-excel', { responseType: 'blob' });

    // Create a download link for the Excel file
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'reparaciones.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

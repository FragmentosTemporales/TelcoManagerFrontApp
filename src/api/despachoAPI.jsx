import client from './axiosClient';

export const createAgendamiento = async (payload) => {
  try {
    const response = await client.post('/create-agendamiento', payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.error || error.message;
  }
};

export const getAgendamientos = async (page) => {
  try {
    const response = await client.get(`/get-agendamientos/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAllAgendamientos = async (page) => {
  try {
    const response = await client.get(`/get-all-agendamientos/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataAgendamientos = async (fecha) => {
  try {
    const response = await client.get(`/get-data-agendamientos/${fecha}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataFuturaAgendamientos = async () => {
  try {
    const response = await client.get('/get-data-futura-agendamiento');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataHistoricaAgendamientos = async () => {
  try {
    const response = await client.get('/get-data-historica-agendamiento');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const filterAgendamiento = async (fechaInicio, fechaFin) => {
  try {
    const response = await client.get(`/agendamientos-filtered/${fechaInicio}&${fechaFin}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDespachosSemenalExcel = async () => {
  try {
    const response = await client.get('/get-despachos-semanales-excel', { responseType: 'blob' });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'despachos.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

export const createMigracion = async (payload) => {
  try {
    const response = await client.post('/despacho/create-migracion-proactiva', payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.error || error.message;
  }
};

export const getDataMigracionesProactivas = async (page) => {
  try {
    const response = await client.get(`/despacho/get-migraciones-proactivas/${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataMigracionesPendientes = async () => {
  try {
    const response = await client.get('/despacho/get-migraciones-pendientes');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataMigracionesComunas = async () => {
  try {
    const response = await client.get('/despacho/get-migraciones-comunas');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getMigracionUnica = async (id) => {
  try {
    const response = await client.get(`/despacho/get-migracion/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getMigracionGestiones = async (id) => {
  try {
    const response = await client.get(`/despacho/get-migracion-gestion/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getQMigracionesPendientesdeVista = async () => {
  try {
    const response = await client.get('/despacho/get-q-migraciones-pendientes');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getMigracionFiltrada = async (id_vivienda) => {
  try {
    const response = await client.get(`/despacho/get-migracion-filtrada/${id_vivienda}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getClienteMigracion = async (payload) => {
  try {
    const response = await client.post('/despacho/get-migracion-proactiva', payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.error || error.message;
  }
};

export const getMigracionesExcel = async () => {
  try {
    const response = await client.get('/despacho/get-migraciones-historicas-excel', { responseType: 'blob' });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'migraciones.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};

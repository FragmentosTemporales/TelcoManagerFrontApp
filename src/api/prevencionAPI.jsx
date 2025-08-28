import client from './axiosClient';

export const createAST = async (payload) => {
  try {
    const response = await client.post('/create-formast', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAstList = async (page, payload) => {
  try {
    const response = await client.post(`/get-ast-list/${page}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAst = async (ID) => {
  try {
    const response = await client.get(`/get-ast/${ID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAstUsers = async () => {
  try {
    const response = await client.get('/get-ast-users');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getNotAstCC = async () => {
  try {
    const response = await client.get('/get-ast-data-centro-costo');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getDataCCStats = async (payload) => {
  try {
    const response = await client.post('/get-filter-data-by-centro-costo', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getAstHistoricoExcel = async () => {
  try {
    const response = await client.get('/get-all-ast-form-excel', { responseType: 'blob' });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'historicoAst.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return 'Archivo descargado exitosamente.';
  } catch (error) {
    throw error.response?.data?.error || 'Error al descargar el archivo.';
  }
};
// Removed duplicated axios-based implementations; the file uses the centralized client above.
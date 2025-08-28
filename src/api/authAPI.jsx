import client from './axiosClient';

export const onLogin = async (payload) => {
  try {
    const response = await client.post('/login', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createUser = async (payload) => {
  try {
    const response = await client.post('/create-user', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await client.get('/get-users');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUsersEmpresa = async (empresaID) => {
  try {
    const response = await client.get(`/get-trabajadores/${empresaID}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updatePass = async (payload) => {
  try {
    const response = await client.put('/update-password', payload);
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
}

export const getEmpresas = async () => {
  try {
    const response = await client.get('/get-empresas');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

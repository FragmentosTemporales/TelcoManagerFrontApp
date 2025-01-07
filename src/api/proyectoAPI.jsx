import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getProyectos = async (token) => {
  try {
    const url = `${baseUrl}/get-proyectos-consolidado`;

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

export const getProyectoUnico = async (token, proyectoID) => {
  try {
    const url = `${baseUrl}/unique-project/${proyectoID}`;

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

export const getComponenteUnico = async (token, componenteID) => {
  try {
    const url = `${baseUrl}/unique-component/${componenteID}`;

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

export const getFormComponente = async (token, tipoComponenteID) => {
  try {
    const url = `${baseUrl}/form-component/${tipoComponenteID}`;

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

export const getEmpresas = async (token) => {
  try {
    const url = `${baseUrl}/get-empresas`;

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

export const getAsignados = async (token, page) => {
  try {
    const url = `${baseUrl}/get-proyectos-asignados/${page}`;

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

export const getAsignadosUser = async (token) => {
  try {
    const url = `${baseUrl}/get-asignados-by-user`;

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

export const getaLLAsignados = async (token, page) => {
  try {
    const url = `${baseUrl}/get-all-proyectos-asignados/${page}`;

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

export const createProject = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-proyecto`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createComponentList = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-componente`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createUniqueComponent = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-unique-componente`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createRecurso = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-recurso`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createAvance = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-avance`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const deleteRecurso = async (recursoID, token) => {
  try {
    const url = `${baseUrl}/delete-recurso/${recursoID}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const deleteAvance = async (avanceID, token) => {
  try {
    const url = `${baseUrl}/delete-avance/${avanceID}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const createMedicionCTO = async (payload, token) => {
  try {
    const url = `${baseUrl}/create-medicioncto`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const deleteMedicion = async (medicionctoID, token) => {
  try {
    const url = `${baseUrl}/delete-medicioncto/${medicionctoID}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
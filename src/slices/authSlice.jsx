import { createSlice } from "@reduxjs/toolkit";

// Función para verificar si el token ha caducado
const isTokenExpired = () => {
  const tokenTimestamp = localStorage.getItem('token_timestamp');
  if (tokenTimestamp) {
    const now = new Date().getTime();
    const tokenAge = now - parseInt(tokenTimestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    return tokenAge > maxAge;
  }
  return true; // Si no hay timestamp, el token es inválido
};

// Si el token ha expirado, limpiamos el localStorage
if (isTokenExpired()) {
  localStorage.removeItem('token');
  localStorage.removeItem('token_timestamp');
  localStorage.removeItem('correo');
  localStorage.removeItem('nombre');
  localStorage.removeItem('numDoc');
  localStorage.removeItem('user_id');
}

const state = {
  is_loading: false,
  is_load: false,
  token: localStorage.getItem('token') || null,
  nombre: localStorage.getItem('nombre') || null,
  numDoc: localStorage.getItem('numDoc') || null,
  user_id: localStorage.getItem('user_id') || null,
  correo: localStorage.getItem('correo') || null,
  message: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,

  reducers: {
    setLogout: (state) => {
      state.correo = null;
      state.nombre = null;
      state.numDoc = null;
      state.token = null;
      state.is_load = false;
      state.is_loading = false;
      localStorage.removeItem('correo');
      localStorage.removeItem('nombre');
      localStorage.removeItem('numDoc');
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token_timestamp');
    },
    onLoading: (state) => {
      state.is_loading = true;
      state.is_load = false;
    },
    onLoad: (state, action) => {
      const payload = action.payload;
      const now = new Date().getTime(); // Obtener la marca de tiempo actual

      state.correo = payload.correo;
      state.token = payload.token;
      state.user_id = payload.user_id;
      state.nombre = payload.nombre; 
      state.numDoc = payload.numDoc; 
      state.is_loading = false;
      state.is_load = true;

      localStorage.setItem('correo', payload.correo);
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user_id', payload.user_id);
      localStorage.setItem('nombre', payload.nombre);
      localStorage.setItem('token_timestamp', now.toString()); // Guardar la marca de tiempo
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const { setLogout, onLoading, onLoad, setMessage } = authSlice.actions;
export default authSlice.reducer;

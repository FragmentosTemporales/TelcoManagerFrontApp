import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  token: localStorage.getItem('token') || '',
  nombre: localStorage.getItem('nombre') || null,
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
      state.token = '';
      state.is_load = false;
      state.is_loading = false;
      localStorage.removeItem('correo');
      localStorage.removeItem('nombre');
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
    },
    onLoading: (state) => {
      state.is_loading = true;
      state.is_load = false;
    },
    onLoad: (state, action) => {
      const payload = action.payload;
      state.correo = payload.correo;
      state.token = payload.token;
      state.user_id = payload.user_id;
      state.nombre = payload.nombre;
      state.is_loading = false;
      state.is_load = true;
      localStorage.setItem('correo', payload.correo);
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user_id', payload.user_id);
      localStorage.setItem('nombre', payload.nombre);
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const { setLogout, onLoading, onLoad, setMessage } = authSlice.actions;
export default authSlice.reducer;

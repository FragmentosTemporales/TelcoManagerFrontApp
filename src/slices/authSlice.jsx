import { createSlice } from "@reduxjs/toolkit";


const state = {
  is_loading: false,
  is_load: false,
  token: localStorage.getItem('token') || null,
  nombre: localStorage.getItem('nombre') || null,
  numDoc: localStorage.getItem('numDoc') || null,
  user_id: localStorage.getItem('user_id') || null,
  correo: localStorage.getItem('correo') || null,
  permisos: JSON.parse(localStorage.getItem('permisos')) || null,
  empresa: JSON.parse(localStorage.getItem('empresa')) || null,
  message: null,
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
      state.permisos = null;
      state.is_load = false;
      state.is_loading = false;
      localStorage.removeItem('correo');
      localStorage.removeItem('nombre');
      localStorage.removeItem('numDoc');
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('permisos');
      localStorage.removeItem('empresa');
    },
    onLoading: (state) => {
      state.is_loading = true;
      state.is_load = false;
    },
    onLoad: (state, action) => {
      const payload = action.payload;

      state.token = payload.token;
      const usuario = payload.usuario

      state.correo = usuario.correo;
      state.user_id = usuario.userID;
      state.nombre = usuario.nombre; 
      state.numDoc = usuario.numDoc; 
      state.permisos = usuario.permisos
      state.empresa = usuario.empresa
      state.is_loading = false;
      state.is_load = true;

      localStorage.setItem('correo', usuario.correo);
      localStorage.setItem('token', usuario.token);
      localStorage.setItem('user_id', usuario.userID);
      localStorage.setItem('nombre', usuario.nombre);
      localStorage.setItem('permisos', JSON.stringify(usuario.permisos));
      localStorage.setItem('empresa', JSON.stringify(usuario.empresa));
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const { setLogout, onLoading, onLoad, setMessage } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";


const state = {
  is_loading: false,
  is_load: false,
  token: null,
  nombre: null,
  numDoc: null,
  user_id: null,
  correo: null,
  permisos: null,
  empresa: null,
  message: null,
  area: null,
  estacion: null
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
      const usuario = payload.usuario;

      state.correo = usuario.correo;
      state.user_id = usuario.userID;
      state.nombre = usuario.nombre; 
      state.numDoc = usuario.numDoc; 
      state.permisos = usuario.permisos;
      state.empresa = usuario.empresa;
      state.area = usuario.area;
      state.estacion = usuario.estacion;
      state.is_loading = false;
      state.is_load = true;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const { setLogout, onLoading, onLoad, setMessage } = authSlice.actions;
export default authSlice.reducer;

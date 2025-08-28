import { createSlice } from "@reduxjs/toolkit";

// helpers to safely read from localStorage (protect against SSR or missing window)
const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

const safeGetJSON = (key) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
};

const state = {
  is_loading: false,
  // mark as loaded if we have a token in localStorage
  is_load: safeGet('token') ? true : false,
  token: safeGet('token'),
  // timestamp in ms when token expires
  token_expires_at: safeGet('token_expires_at') ? Number(safeGet('token_expires_at')) : null,
  nombre: safeGet('nombre'),
  numDoc: safeGet('numDoc'),
  user_id: safeGet('user_id'),
  correo: safeGet('correo'),
  permisos: safeGetJSON('permisos'),
  empresa: safeGet('empresa'),
  message: null,
  area: safeGetJSON('area'),
  estacion: safeGet('estacion')
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
      localStorage.removeItem('area');
      localStorage.removeItem('estacion');
    },
    onLoading: (state) => {
      state.is_loading = true;
      state.is_load = false;
    },
    onLoad: (state, action) => {
      const payload = action.payload;

      state.token = payload.token;

  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
      let tokenStartAt = Date.now();
      try {
        const parts = payload.token.split('.');
        if (parts.length === 3) {
          const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(atob(b64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const tpayload = JSON.parse(json);
          if (tpayload.iat) {
            tokenStartAt = tpayload.iat * 1000; // iat is seconds
          }
        }
      } catch (e) {
        // ignore decode errors and keep tokenStartAt as Date.now()
      }

      state.token_expires_at = expiresAt;
      const usuario = payload.usuario;

      state.correo = usuario.correo;
      state.user_id = usuario.userID;
      state.nombre = usuario.nombre;
      state.numDoc = usuario.numDoc;
      state.permisos = usuario.permisos;
      state.empresa = usuario.empresa;
      if (typeof usuario.area === 'string') {
        try {
          state.area = JSON.parse(usuario.area);
        } catch (e) {
          state.area = usuario.area; // fallback to raw string
        }
      } else {
        state.area = usuario.area;
      }
      state.estacion = usuario.estacion;
      state.is_loading = false;
      state.is_load = true;
      try {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('token_expires_at', String(expiresAt));
        localStorage.setItem('correo', usuario.correo ?? '');
        localStorage.setItem('user_id', usuario.userID ?? '');
        localStorage.setItem('nombre', usuario.nombre ?? '');
        localStorage.setItem('numDoc', usuario.numDoc ?? '');
        localStorage.setItem('permisos', JSON.stringify(usuario.permisos ?? null));
        localStorage.setItem('empresa', usuario.empresa ?? '');
        // store area as JSON so objects are preserved
        try {
          localStorage.setItem('area', JSON.stringify(usuario.area ?? null));
        } catch (e) {
          // fallback to storing a string if JSON fails
          localStorage.setItem('area', usuario.area ?? '');
        }
        localStorage.setItem('estacion', usuario.estacion ?? '');
      } catch (e) {
        // ignore storage errors (quota, disabled, SSR)
      }
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const { setLogout, onLoading, onLoad, setMessage } = authSlice.actions;
export default authSlice.reducer;

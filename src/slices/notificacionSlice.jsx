import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  data: null,
};

export const notificacionSlice = createSlice({
  name: "notificacion",
  initialState: state,

  reducers: {
    onLoading: (state ) => {
      state.is_loading = true,
      state.is_load = false;
    },
    onLoad: (state, action ) => {
      const payload = action.payload;
      state.data = payload
      state.is_loading = false,
      state.is_load = true;
    },
    setMessage: (state, action ) => {
      state.message = action.payload;
    }
  },
});

export const { 
  onLoading, 
  onLoad,
  setMessage, 
  } = notificacionSlice.actions;
export default notificacionSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  message: null,
  data: null,
  pages: null
};

export const solicitudSlice = createSlice({
  name: "solicitud",
  initialState: state,

  reducers: {
    onLoading: (state ) => {
      state.is_loading = true,
      state.is_load = false;
    },
    onLoad: (state, action ) => {
      const payload = action.payload;
      state.data = payload.data
      state.pages = payload.pages
      state.message = payload.message;
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
  } = solicitudSlice.actions;
export default solicitudSlice.reducer;
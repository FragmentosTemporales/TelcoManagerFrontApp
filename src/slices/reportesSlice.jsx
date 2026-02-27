import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  data: null,
};

export const reportesSlice = createSlice({
  name: "reportes",
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
  },
});

export const { 
  onLoading, 
  onLoad
  } = reportesSlice.actions;
export default reportesSlice.reducer;
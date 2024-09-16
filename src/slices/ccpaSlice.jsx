import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  message: null,
  data: null,
};

export const ccpaSlice = createSlice({
  name: "ccpa",
  initialState: state,

  reducers: {
    onLoading: (state ) => {
      state.is_loading = true,
      state.is_load = false;
    },
    onLoad: (state, action ) => {
      const payload = action.payload;
      state.data = payload
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
  } = ccpaSlice.actions;
export default ccpaSlice.reducer;
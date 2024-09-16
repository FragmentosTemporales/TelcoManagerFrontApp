import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  user_id: null,
  message: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: state,

  reducers: {
    onLoading: (state ) => {
      state.is_loading = true,
      state.is_load = false;
    },
    onLoad: (state, action ) => {
      const payload = action.payload
      console.log('userSlice: ', payload)
      state.is_loading = false,
      state.is_load = true;
    },
    setMessage: (state, action ) => {
      state.message = action.payload;
    },
  },
});

export const { 
  setLogout, 
  onLoading, 
  onLoad, 
  setMessage, 
  onGetUserInfo } = userSlice.actions;
export default userSlice.reducer;
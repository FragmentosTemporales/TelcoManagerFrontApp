import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  domMessage: null,
  data: null,
  domToken: null,
  domTokenType: null,
};

export const dominionSlice = createSlice({
  name: "dominion",
  initialState: state,

  reducers: {
    domLoading: (state) => {
      (state.is_loading = true), (state.is_load = false);
    },
    domsetLogout: (state) => {
      state.domToken = null;
      state.domTokenType = null;
      localStorage.removeItem('domToken');
      localStorage.removeItem('domTokenType');
    },
    domLoadAuth: (state, action) => {
      const payload = action.payload;
      state.domMessage = payload.message;
      state.domToken = payload.token;
      state.domTokenType = payload.token_type;
    },
    domLoad: (state, action) => {
      const payload = action.payload;
      state.data = payload.data;
      state.is_loading = false;
      state.is_load = true;
    },
    setDomMessage: (state, action) => {
      state.domMessage = action.payload;
    },
  },
});

export const { domLoad, domLoading, domLoadAuth, setDomMessage, domsetLogout } =
  dominionSlice.actions;
export default dominionSlice.reducer;

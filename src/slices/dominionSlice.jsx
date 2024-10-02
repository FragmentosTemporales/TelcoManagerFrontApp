import { createSlice } from "@reduxjs/toolkit";

const state = {
  is_loading: false,
  is_load: false,
  domMessage: null,
  data: null,
  domToken: localStorage.getItem("domToken") || null,
  domTokenType: localStorage.getItem("domTokenType") || null,
};

export const dominionSlice = createSlice({
  name: "dominion",
  initialState: state,

  reducers: {
    domLoading: (state) => {
      (state.is_loading = true), (state.is_load = false);
    },
    domLoadAuth: (state, action) => {
      const payload = action.payload;
      state.domMessage = payload.message;
      state.domToken = payload.token;
      state.domTokenType = payload.token_type;

      localStorage.setItem("domToken", payload.token);
      localStorage.setItem("domTokenType", payload.token_type);
    },
    domLoad: (state, action) => {
      const payload = action.payload;
      state.data = payload.data;
      state.is_loading = false;
      state.is_load = true;
    },
    setDomMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { domLoad, domLoading, domLoadAuth, setDomMessage } =
  dominionSlice.actions;
export default dominionSlice.reducer;

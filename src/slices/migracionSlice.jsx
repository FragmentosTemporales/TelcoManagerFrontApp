import { createSlice } from "@reduxjs/toolkit";

const state = {
  id_selected: null,
};

export const migracionesSlice = createSlice({
  name: "migraciones",
  initialState: state,

  reducers: {
    onLoad: (state, action ) => {
      const payload = action.payload;
      state.id_selected = payload.id_selected;
    },
    onClear: (state ) => {
      state.id_selected = null;
    },
  },
});

export const {
  onLoad,
  onClear
} = migracionesSlice.actions;
export default migracionesSlice.reducer;
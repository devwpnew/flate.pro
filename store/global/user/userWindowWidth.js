import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 1231,
};

export const userWindowWidth = createSlice({
  name: "userWindowWidth",
  initialState,
  reducers: {
    setWindowWidth: (state, action) => {
      state.value = action.payload;
    },
    getWindowWidth: (state) => {
      return state.value;
    },
  },
});

export const { getWindowWidth, setWindowWidth } = userWindowWidth.actions;

export default userWindowWidth.reducer;

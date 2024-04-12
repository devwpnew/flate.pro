import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  value: [],
};

export const userFavorites = createSlice({
  name: "userFavorites",
  initialState,
  reducers: {
    getFavorites: (state) => {
      state.value;
    },
    setFavorites: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getFavorites, setFavorites } = userFavorites.actions;

export default userFavorites.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  value: {
    name: "Сочи",
    id: 5,
  },
};

export const userCity = createSlice({
  name: "userCity",
  initialState,
  reducers: {
    getCity: (state) => {
      state.value;
    },
    setCity: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getCity, setCity } = userCity.actions;

export default userCity.reducer;

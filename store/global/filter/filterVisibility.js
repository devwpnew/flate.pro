import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

export const filterVisibility = createSlice({
  name: "filterVisibility",
  initialState,
  reducers: {
    getFilterVisibility: (state) => {
      state.value;
    },
    setFilterVisibility: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getFilterVisibility, setFilterVisibility } =
  filterVisibility.actions;

export default filterVisibility.reducer;

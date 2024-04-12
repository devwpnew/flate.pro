import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const filterGlobalFields = createSlice({
  name: "filterGlobalFields",
  initialState,
  reducers: {
    getFilterGlobalFields: (state) => {
      state.value;
    },
    setFilterGlobalFields: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getFilterGlobalFields, setFilterGlobalFields } = filterGlobalFields.actions;

export default filterGlobalFields.reducer;

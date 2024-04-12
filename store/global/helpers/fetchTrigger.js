import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  value: false,
};

export const fetchTrigger = createSlice({
  name: "fetchTrigger",
  initialState,
  reducers: {
    getFetchState: (state) => {
      state.value;
    },
    setFetchState: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getFetchState, setFetchState } = fetchTrigger.actions;

export default fetchTrigger.reducer;

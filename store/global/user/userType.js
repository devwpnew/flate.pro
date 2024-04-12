import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 'GUEST',
}

export const userTypeSlice = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    setUserAdmin: (state) => {
      state.value = 'ADMIN'
    },
    setUser: (state) => {
      state.value = 'USER'
    },
    getUser: (state) => {
      state.value;
    },
  },
})

// Action creators are generated for each case reducer function
export const { getUser, setUser, setUserAdmin } = userTypeSlice.actions

export default userTypeSlice.reducer
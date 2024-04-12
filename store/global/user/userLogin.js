import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const initialState = {
  value: false,
}

export const userLogin = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    getLogin: (state) => {
      state.value ? state.value : false
    },
    setLogedIn: (state, action) => {
      state.value = action.payload.id ? action.payload : false
    },
    setLogedOut: (state) => {
      state.value = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { getLogin, setLogedIn, setLogedOut, setTest } = userLogin.actions

export default userLogin.reducer
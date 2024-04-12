import { configureStore } from '@reduxjs/toolkit'
import userCityReducer from './global/user/userCity'
import userTypeReducer from './global/user/userType'
import userLoginReducer from './global/user/userLogin'
import userFavoritesReducer from './global/user/userFavorites'
import userWindowWidth from './global/user/userWindowWidth'

import fetchTrigger from './global/helpers/fetchTrigger'

import filterGlobalFields from './global/filter/filterGlobalFields'
import filterVisibility from './global/filter/filterVisibility'


export const store = configureStore({
  reducer: {
    userType: userTypeReducer,
    userLogin: userLoginReducer,
    userFavorites: userFavoritesReducer,
    userWindowWidth: userWindowWidth,
    userCity: userCityReducer,
    fetchTrigger: fetchTrigger,
    filterGlobalFields: filterGlobalFields,
    filterVisibility: filterVisibility,
  },
})
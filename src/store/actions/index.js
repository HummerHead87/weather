import {
  LOAD_CITIES,
  CLEAR_CITIES,
  ADD_CITY,
  DELETE_CITY,
} from '../constants'

export const loadCities = () => ({ type: LOAD_CITIES })

export const clearCities = () => ({ type: CLEAR_CITIES })

export const addCity = (payload) => ({ type: ADD_CITY, payload })

export const deleteCity = (payload) => ({ type: DELETE_CITY, payload })


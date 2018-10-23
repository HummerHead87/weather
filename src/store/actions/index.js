import {
  LOAD_CITIES,
  CLEAR_CITIES,
  ADD_CITY,
  DELETE_CITY,
  LOAD_WEATHER,
  START,
  SUCCESS,
  FAIL,
} from '../constants'

export const loadCities = () => ({ type: LOAD_CITIES })

export const clearCities = () => ({ type: CLEAR_CITIES })

export const addCity = (payload) => ({ type: ADD_CITY, payload })

export const deleteCity = (payload) => ({ type: DELETE_CITY, payload })

export const loadWeather = (payload) => ({ type: LOAD_WEATHER + START, payload })

export const loadWeatherSuccess = (payload) => ({ type: LOAD_WEATHER + SUCCESS, payload })

export const loadWeatherError = (payload) => ({ type: LOAD_WEATHER + FAIL, payload })


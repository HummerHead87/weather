import {
  ADD_CITY,
  DELETE_CITY,
  LOAD_WEATHER,
  LOAD_WEATHER_CURRENT,
  LOAD_WEATHER_LIST,
  START,
  SUCCESS,
  FAIL,
} from '../constants'

export const addCity = (payload) => ({ type: ADD_CITY, payload })

export const deleteCity = (payload) => ({ type: DELETE_CITY, payload })

export const loadWeather = (payload) => ({ type: LOAD_WEATHER + START, payload })

export const loadWeatherSuccess = (payload) => ({ type: LOAD_WEATHER + SUCCESS, payload })

export const loadWeatherError = (payload) => ({ type: LOAD_WEATHER + FAIL, payload })

export const loadWeatherCurrent = (payload) => ({ type: LOAD_WEATHER_CURRENT + START, payload })

export const loadWeatherCurrentSuccess = (payload) => ({ type: LOAD_WEATHER_CURRENT + SUCCESS, payload })

export const loadWeatherCurrentError = (payload) => ({ type: LOAD_WEATHER_CURRENT + FAIL, payload })

export const loadWeatherListSuccess = (payload) => ({ type: LOAD_WEATHER_LIST + SUCCESS, payload })

export const loadWeatherListError = (payload) => ({ type: LOAD_WEATHER_LIST + FAIL, payload })

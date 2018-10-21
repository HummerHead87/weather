export const LOAD_CITIES = 'LOAD_CITIES'
export const CLEAR_CITIES = 'CLEAR_CITIES'
export const ADD_CITY = 'ADD_CITY'
export const DELETE_CITY = 'DELETE_CITY'

export const loadCities = () => ({ type: LOAD_CITIES })

export const clearCities = () => ({ type: CLEAR_CITIES })

export const addCity = (payload) => ({ type: ADD_CITY, payload })

export const deleteCity = (payload) => ({ type: DELETE_CITY, payload })


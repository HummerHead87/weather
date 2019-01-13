import { Record, List } from 'immutable'

import {
  ADD_CITY,
  DELETE_CITY,
  LOAD_WEATHER,
  LOAD_WEATHER_CURRENT,
  SUCCESS
} from '../constants'

export const CitiesState = Record({
  items: new List(),
  currentCityId: null, // id по данным openweather
}, 'CitiesState')

export const CityRecord = Record({
  name: '',
  countryCode: '',
  countryName: '',
  geonameId: '', // id города, по данным api.geonames.org
  weatherId: '',  // id города, по данным api.openweathermap.org
})

const defaultState = CitiesState()

export default (citiesState = defaultState, action) => {
  const { type, payload } = action
  
  switch (type) {
  case ADD_CITY:
    return citiesState
      .set('items', citiesState.items.push(new CityRecord({...payload})))
  
  case DELETE_CITY:
    return citiesState
      .set('items', citiesState.items.filterNot(({geonameId}) => geonameId === payload))

  case LOAD_WEATHER + SUCCESS:
    const cities = citiesState.items.update(
      citiesState.items.findIndex(({geonameId}) => geonameId === payload.geonameId),
      item => item.set('weatherId', payload.data.id)
    )

    return citiesState
      .set('items', cities)

  case LOAD_WEATHER_CURRENT + SUCCESS:
    return citiesState
      .set('currentCityId', payload.id)
      
  default: return citiesState
  }
}

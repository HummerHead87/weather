import { Record, List } from 'immutable'
import { REHYDRATE } from 'redux-persist'

import { LOAD_CITIES, CLEAR_CITIES, ADD_CITY, DELETE_CITY } from '../actions'

export const CitiesState = Record({
  items: new List(),
}, 'cities')

const defaultState = CitiesState()

export default (citiesState = defaultState, action) => {
  const {type, payload} = action
  
  switch (type) {
  case ADD_CITY:
    return citiesState
      .set('items', citiesState.items.push(payload))
  
  case DELETE_CITY:
    return citiesState
      .set('items', citiesState.items.filterNot(({geonameId}) => geonameId === payload))
      
  default: return citiesState
  }
}

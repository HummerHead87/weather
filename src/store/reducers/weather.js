import { Record, Map, List } from 'immutable'

import { LOAD_WEATHER, START, SUCCESS, FAIL } from '../constants'

export const WeatherState = Record({
  loading: new List(),
  items: new Map({}),
  errors: new Map({})
})

const defaultState = new WeatherState()

export default (weatherState = defaultState, action) => {
  const {type, payload} = action

  switch(type) {
  case LOAD_WEATHER + START:
    return weatherState
      .set('loading', weatherState.loading.push(payload.geonameId))

  case LOAD_WEATHER + SUCCESS:
    return weatherState
      .set('loading',
        weatherState.loading.filterNot(id => id === payload.geonameId))
      .set('items', weatherState.items.set(payload.geonameId, payload.data))
      .set('errors', weatherState.errors.delete(payload.geonameId))

  case LOAD_WEATHER + FAIL:
    return weatherState
      .set('loading',
        weatherState.loading.filterNot(id => id === payload.geonameId))
      .set('items', weatherState.items.delete(payload.geonameId))
      .set('errors', weatherState.errors.set(payload.geonameId, payload.data))

  default: return weatherState
  }
}

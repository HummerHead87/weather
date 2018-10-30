import keyBy from 'lodash/keyBy'
import { Record, Map, List } from 'immutable'

import { LOAD_WEATHER, START, SUCCESS, FAIL, LOAD_WEATHER_LIST } from '../constants'

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
      .set('items', weatherState.items.set(payload.data.id.toString(), payload.data))
      .set('errors', weatherState.errors.delete(payload.geonameId))

  case LOAD_WEATHER + FAIL:
    return weatherState
      .set('loading',
        weatherState.loading.filterNot(id => id === payload.geonameId))
      .set('errors', weatherState.errors.set(payload.geonameId.toString(), payload.data))

  case LOAD_WEATHER_LIST + SUCCESS:
    return weatherState
      .set('loading',
        weatherState.loading.filterNot(id => payload.geonameIds.includes(id)))
      .set('items', weatherState.items.concat(keyBy(payload.data.list, 'id')))
      .set('errors', weatherState.errors.filterNot((value, id) => {
        payload.geonameIds.includes(id)
      }))

  case LOAD_WEATHER_LIST + FAIL:
    return weatherState
      .set('loading',
        weatherState.loading.filterNot(id => payload.geonameIds.includes(id)))
      .set('errors', weatherState.errors.concat(
        payload.geonameIds.reduce((object, id) => {
          return { ...object, [id]: payload.data }
        }, {})
      ))

  default: return weatherState
  }
}

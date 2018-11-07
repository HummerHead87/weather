import { Observable } from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import partition from 'lodash/partition'

import { loadWeatherSuccess, loadWeatherError, loadWeatherListSuccess, loadWeatherListError } from '../actions'
import { LOAD_WEATHER, START } from '../constants'
import loadWeather from '../../observables/loadWeather'

const loadWeatherList = (dataArray) => {
  const weatherIds = dataArray.map(({ payload }) => payload.weatherId).join(',')

  return Observable
    .zip(
      Observable.of(dataArray.map(({ payload }) => payload.geonameId)),
      loadWeather({ type: 'group', data: { id: weatherIds } })
        .catch(err => Observable.of(err)),
      (geonameIds, data) => ({ geonameIds, data })
    )
    .map(payload => {
      if (payload.data instanceof Error) {
        return loadWeatherListError(payload)
      } else {
        return loadWeatherListSuccess(payload)
      }
    })
}

const loadWeatherItem = ({ payload: { geonameId, name, countryCode } }) => {
  return Observable
    .zip(
      Observable.of(geonameId),
      loadWeather({ type: 'weather', data: { q: `${name},${countryCode}` } })
        .catch(err => Observable.of(err)),
      (geonameId, data) => ({ geonameId, data })
    )
    .map(payload => {
      if (payload.data instanceof Error) {
        return loadWeatherError(payload)
      } else {
        return loadWeatherSuccess(payload)
      }
    })
}

const loadWeatherEpic = (action$) => {
  return action$.ofType(LOAD_WEATHER + START)
    .bufferTime(300)
    .filter(val => val.length > 0)
    .map(val => partition(val, ({ payload }) => payload.weatherId))
    .map(([withId = null, withoutId = null]) => {
      let observablesArray = []

      if (withId.length) {
        observablesArray.push(loadWeatherList(withId))
      }

      if (withoutId.length) {
        observablesArray = [...observablesArray, ...withoutId.map(data => loadWeatherItem(data))]
      }

      return observablesArray
    })
    .switchMap(obs => Observable.merge(...obs))
}

export const rootEpic = combineEpics(loadWeatherEpic)

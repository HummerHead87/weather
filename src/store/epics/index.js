import { Observable } from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import partition from 'lodash/partition'

import {
  loadWeatherSuccess,
  loadWeatherError,
  loadWeatherCurrentSuccess,
  loadWeatherCurrentError,
  loadWeatherListSuccess,
  loadWeatherListError,
} from '../actions'
import { LOAD_WEATHER, LOAD_WEATHER_CURRENT, START } from '../constants'
import loadWeather from '../../observables/loadWeather'

/** загрузка данных о погоде для списка городов */
const loadWeatherList = (dataArray) => {
  const weatherIds = dataArray.map(({ payload }) => payload.weatherId).join(',')

  return Observable
    .zip(
      Observable.of(dataArray.map(({ payload }) => payload.geonameId)), // список id городов
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

/** загрузка данных о погоде для 1 города */
const loadWeatherItem = ({ payload: { geonameId, name, countryCode } }) => {
  return Observable
    .zip(
      Observable.of(geonameId),
      loadWeather({ type: 'weather', data: { q: `${name},${countryCode}`} })
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
    .bufferTime(300) // объединяем экшны в заданном интервале в ms в группу, чтобы не спамить ajax'ами
    .filter(val => val.length > 0) // отбрасываем пустые observable
    .map(val => partition(val, ({ payload }) => payload.weatherId)) // делим пришедшие города
    // на те, у которых уже есть weatherId (id в сервисе api.openweathermap) и у которых его нет
    .map(([withId = null, withoutId = null]) => {
      let observablesArray = []

      // для объектов с weatherId загружаем данные сразу для всего массива городов
      if (withId.length) {
        observablesArray.push(loadWeatherList(withId))
      }

      // для остальных загружаем погоду для каждого города отдельным ajax
      if (withoutId.length) {
        observablesArray = [...observablesArray, ...withoutId.map(data => loadWeatherItem(data))]
      }

      return observablesArray
    })
    .switchMap(obs => Observable.merge(...obs))
}

/** загрузка данных о погоде для текущей локации */
const loadWeatherCurrentEpic = (action$) => {
  return action$.ofType(LOAD_WEATHER_CURRENT + START)
    .switchMap(({ payload }) => {
      const { city, countryCode, lat, lon } = payload
      let queryParams

      // данные о локации могут прилететь в виде объекта с названием города (name)
      // или географические координаты (lat, lon)
      if (city) {
        queryParams = { q: `${city},${countryCode}` }
      } else {
        queryParams = { lat, lon }
      }
      
      return loadWeather({ type: 'weather', data: queryParams })
        .catch(err => Observable.of(err))
    })
    .map(payload => {
      if (payload instanceof Error) {
        return loadWeatherCurrentError(payload)
      } else {
        return loadWeatherCurrentSuccess(payload)
      }
    })
}

export const rootEpic = combineEpics(loadWeatherEpic, loadWeatherCurrentEpic)

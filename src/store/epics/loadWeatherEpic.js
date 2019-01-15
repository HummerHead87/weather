import { of, zip, merge } from 'rxjs'
import { map, bufferTime, filter, switchMap, catchError } from 'rxjs/operators'

import partition from 'lodash/partition'

import {
  loadWeatherSuccess,
  loadWeatherError,
  loadWeatherListSuccess,
  loadWeatherListError,
} from '../actions'
import { LOAD_WEATHER, START } from '../constants'
import loadWeather from '../../observables/loadWeather'

/** загрузка данных о погоде для списка городов */
const loadWeatherList = (dataArray) => {
  const weatherIds = dataArray.map(({ payload }) => payload.weatherId).join(',')

  return zip(
    of(dataArray.map(({ payload }) => payload.geonameId)), // список id городов
    loadWeather({ type: 'group', data: { id: weatherIds } })
      .pipe(catchError(err => of(err))),
    (geonameIds, data) => ({ geonameIds, data })
  ).pipe(
    map(payload => {
      if (payload.data instanceof Error) {
        return loadWeatherListError(payload)
      } else {
        return loadWeatherListSuccess(payload)
      }
    })
  )
}

/** загрузка данных о погоде для 1 города */
const loadWeatherItem = ({ payload: { geonameId, name, countryCode } }) => {
  return zip(
    of(geonameId),
    loadWeather({ type: 'weather', data: { q: `${name},${countryCode}`} })
      .pipe(catchError(err => of(err))),
    (geonameId, data) => ({ geonameId, data })
  ).pipe(
    map(payload => {
      if (payload.data instanceof Error) {
        return loadWeatherError(payload)
      } else {
        return loadWeatherSuccess(payload)
      }
    })
  )
}

export default (action$) => {
  return action$.ofType(LOAD_WEATHER + START)
    .pipe(
      bufferTime(300), // объединяем экшны в заданном интервале в ms в группу, чтобы не спамить ajax'ами
      filter(val => val.length > 0), // отбрасываем пустые observable
      map(val => partition(val, ({ payload }) => payload.weatherId)), // делим пришедшие города
      // на те, у которых уже есть weatherId (id в сервисе api.openweathermap) и у которых его нет
      map(([withId = null, withoutId = null]) => {
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
      }),
      switchMap(obs => merge(...obs))
    )
}

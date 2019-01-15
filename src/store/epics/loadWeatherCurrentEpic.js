import { of } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'

import {
  loadWeatherCurrentSuccess,
  loadWeatherCurrentError,
} from '../actions'
import { LOAD_WEATHER_CURRENT, START } from '../constants'
import loadWeather from '../../observables/loadWeather'

/** загрузка данных о погоде для текущей локации */
export default (action$) => {
  return action$.ofType(LOAD_WEATHER_CURRENT + START)
    .pipe(
      switchMap(({ payload }) => {
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
          .pipe(catchError(err => of(err)))
      }),
      map(payload => {
        if (payload instanceof Error) {
          return loadWeatherCurrentError(payload)
        } else {
          return loadWeatherCurrentSuccess(payload)
        }
      })
    )
}

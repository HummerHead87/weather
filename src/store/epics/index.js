import { Observable } from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import { loadWeatherSuccess, loadWeatherError } from '../actions'
import { LOAD_WEATHER, START } from '../constants'
import loadWeather from '../../observables/loadWeather'

const loadWeatherEpic = (action$) => {
  return action$.ofType(LOAD_WEATHER + START)
    .switchMap(({ payload: { geonameId, name, countryCode } }) => {
      return Observable.combineLatest(
        Observable.of(geonameId),
        loadWeather({ q: `${name},${countryCode}` })
          .catch(err => Observable.of(err)),
        (geonameId, data) => ({ geonameId, data })
      )
    })
    .map(payload => {
      if (payload.data instanceof Error) {
        return loadWeatherError(payload)
      } else {
        return loadWeatherSuccess(payload)
      }
    })
}



export const rootEpic = combineEpics(loadWeatherEpic)

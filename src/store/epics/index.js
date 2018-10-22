import { Observable } from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import { clearCities } from '../actions'
import { LOAD_CITIES } from '../constants'

function loadCitiesEpic(action$) {
  return action$.ofType(LOAD_CITIES)
    .switchMap(() => {
      return Observable.of(clearCities()).delay(2000)
    })
    // .do(console.log)
    // .ignoreElements()
}

export const rootEpic = combineEpics(loadCitiesEpic)

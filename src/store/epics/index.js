import { Observable } from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import { clearCities, LOAD_CITIES } from '../actions'

function loadCitiesEpic(action$) {
  return action$.ofType(LOAD_CITIES)
    .switchMap(() => {
      return Observable.of(clearCities()).delay(2000)
    })
    // .do(console.log)
    // .ignoreElements()
}

export const rootEpic = combineEpics(loadCitiesEpic)

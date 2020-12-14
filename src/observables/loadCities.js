import deburr from 'lodash/deburr'
import { defer, of, merge } from 'rxjs'
import { pluck, map, switchMap, catchError, retry } from 'rxjs/operators'
import Axios from  'axios-observable'

const url = 'http://api.geonames.org/search'

const loadGeoData = name_startsWith => {
  const params = {
    type: 'json',
    isNameRequired: 'true',
    maxRows: 5,
    cities: 'cities5000',
    name_startsWith,
    username: process.env.GEONAMES_LOGIN
  }

  return defer(() => Axios.get(url, { params }))
    .pipe(
      retry(2),
      pluck('data', 'geonames'),
      map(result => ({ result }))
    )
}


const loadCities = (phrase) => {
  return of(phrase)
    .pipe(
      map(value => deburr(value)),
      switchMap(value => {
        return merge(
          of({ loading: true }),
          loadGeoData(value)
        )
      }),
      catchError(err => {
        console.log('loadCities error')
        console.error(err)
        return of({ loading: false, err })
      })
    )
}

export default loadCities

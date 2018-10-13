import deburr from 'lodash/deburr'
import { Observable } from 'rxjs/Rx';
import Axios from  'axios-observable';

const url = 'http://api.geonames.org/search';

const loadGeoData = name_startsWith => {
  const params = {
    type: 'json',
    isNameRequired: "true",
    maxRows: 5,
    cities: "cities5000",
    name_startsWith,
    username: process.env.GEONAMES_LOGIN
  };

  return Observable
    .from(Axios.get(url, { params }))
    .pluck('data', 'geonames')
    .map(result => { 
      return { result }
    })
}


const loadCities = (phrase) => {
  return Observable
    .of(phrase)
    .map(value => deburr(value))
    .switchMap(value => {
      return Observable.merge(
        Observable.of({ loading: true }),
        loadGeoData(value)
      )
    })
    .catch(err => {
      console.log('loadCities error')
      console.error(err)
      return Observable.of({ loading: false })
    })
}

export default loadCities;

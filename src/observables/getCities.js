import { Observable } from 'rxjs/Rx';
import Axios from  'axios-observable';

const url = 'http://api.geonames.org/search';

const getCities = (phrase) => {
  const params = {
    type: 'json',
    isNameRequired: "true",
    maxRows: 5,
    cities: "cities5000",
    name_startsWith: phrase,
    username: process.env.GEONAMES_LOGIN
  };

  return Observable
    .from(Axios.get(url, { params }))
    .pluck('data', 'geonames')
}

export default getCities;

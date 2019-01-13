import { from } from 'rxjs'
import { pluck } from 'rxjs/operators'

import Axios from  'axios-observable'

const getUrl = (type) => `http://api.openweathermap.org/data/2.5/${type}`

const loadWeather = ({ type, data }) => {
  const params = {
    units: 'metric',
    lang: 'en',
    APPID: process.env.OPENWEATHERMAP_APPID,
    ...data
  }

  return from(Axios.get(getUrl(type), { params }))
    .pipe(pluck('data'))
}

export default loadWeather

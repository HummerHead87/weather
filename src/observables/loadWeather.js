import { defer } from 'rxjs'
import { pluck, retryWhen } from 'rxjs/operators'

import Axios from  'axios-observable'

import genericRetryStrategy from './genericRetryStrategy'

const getUrl = (type) => `http://api.openweathermap.org/data/2.5/${type}`


const loadWeather = ({ type, data }) => {
  const params = {
    units: 'metric',
    lang: 'en',
    APPID: process.env.OPENWEATHERMAP_APPID,
    ...data
  }

  return defer(() => Axios.get(getUrl(type), { params }))
    .pipe(
      retryWhen(genericRetryStrategy()),
      pluck('data')
    )
}

export default loadWeather

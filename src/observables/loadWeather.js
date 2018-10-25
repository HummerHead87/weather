import { Observable } from 'rxjs/Rx'
import Axios from  'axios-observable'

const url = 'http://api.openweathermap.org/data/2.5/weather'

const loadWeather = data => {
  const params = {
    units: 'metric',
    lang: 'en',
    APPID: process.env.OPENWEATHERMAP_APPID,
    ...data
  }

  return Observable
    .from(Axios.get(url, { params }))
    .pluck('data')
}

export default loadWeather

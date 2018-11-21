import { Observable } from 'rxjs/Rx'
import Axios from  'axios-observable'

export default Observable
  .from(Axios.get('http://ipinfo.io/json'))
  .pluck('data')

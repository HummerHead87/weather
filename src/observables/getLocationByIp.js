import { from } from 'rxjs'
import { pluck } from 'rxjs/operators'
import Axios from  'axios-observable'

const observable = from(Axios.get('http://ipinfo.io/json'))
  .pipe(pluck('data'))
  
export default observable

import { defer } from 'rxjs'
import { pluck, retryWhen } from 'rxjs/operators'

import Axios from  'axios-observable'

import genericRetryStrategy from './genericRetryStrategy'

const observable = defer(() => Axios.get('http://ipinfo.io/json'))
  .pipe(
    retryWhen(genericRetryStrategy()),
    pluck('data')
  )

export default observable

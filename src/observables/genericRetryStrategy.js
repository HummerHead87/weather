
import { throwError, timer } from 'rxjs'
import { mergeMap, finalize } from 'rxjs/operators'

export default ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = []
} = {}) => (attempts) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find(e => e === error.status)
      ) {
        return throwError(error)
      }
      console.log(
        `Attempt ${retryAttempt}: retrying in ${Math.pow(retryAttempt, 2)
          * scalingDuration}ms`
      )
      // retry after 1s, 4s, etc...
      return timer(Math.pow(retryAttempt, 2) * scalingDuration)
    }),
    finalize(() => console.log('We are done!'))
  )
}

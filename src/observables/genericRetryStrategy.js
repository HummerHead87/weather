
import { throwError, timer } from 'rxjs'
import { mergeMap, finalize } from 'rxjs/operators'

/** пример из учебника по rxjs. Повторяет неудачный ajax запрос
 * @see https://www.learnrxjs.io/operators/error_handling/retrywhen.html Example 2
 */
export default ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = []
} = {}) => (attempts) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1
      // если превышено максимальное число повторов
      // или статус ответа при котором мы не хотим повторять запрос
      // выбрасываем ошибку
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
      // повтор после 1с, 4с, и тд.
      return timer(Math.pow(retryAttempt, 2) * scalingDuration)
    }),
    finalize(() => console.log('We are done!'))
  )
}

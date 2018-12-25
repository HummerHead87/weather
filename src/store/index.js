import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import { createEpicMiddleware } from 'redux-observable'

import rootReducer from './reducers'
import { rootEpic } from './epics'
import { CitiesState, CityRecord } from './reducers/cities'

const epicMiddleware = createEpicMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistConfig = {
  transforms: [immutableTransform({records: [CitiesState, CityRecord]})],
  key: 'root',
  storage: storage,
  whitelist: ['cities']
}

const pReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  pReducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
)

epicMiddleware.run(rootEpic)

const persistor = persistStore(store)
export { store, persistor }

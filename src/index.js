import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { persistor, store } from './store'
// import reducer from './reducers'
import * as serviceWorker from './serviceWorker'

// import { createEpicMiddleware } from 'redux-observable'
// import { rootEpic } from './epics'

// const epicMiddleware = createEpicMiddleware()

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// const store = createStore(
//   reducer,
//   composeEnhancers(
//     applyMiddleware(epicMiddleware)
//   )
// )

// epicMiddleware.run(rootEpic)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

import { combineEpics } from 'redux-observable'

import loadWeatherEpic from './loadWeatherEpic'
import loadWeatherCurrentEpic from './loadWeatherCurrentEpic'

export const rootEpic = combineEpics(loadWeatherEpic, loadWeatherCurrentEpic)

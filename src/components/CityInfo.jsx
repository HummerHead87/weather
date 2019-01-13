import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import WeatherInfo from './WeatherInfo'

const CityInfo = ({ weather, error }) => {
  if (error)  {
    return (
      <Typography color='error'>
        {`Error: ${error.message || 'Unknown error'}`}
      </Typography>
    )
  }

  if (weather) {
    return (
      <div>
        <WeatherInfo weather={weather} />
      </div>
    )
  }

  return null
}

CityInfo.propTypes = {
  weather: PropTypes.object,
  error: PropTypes.object,
}

export default CityInfo

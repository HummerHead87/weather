import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import WeatherInfo from './WeatherInfo'

const CityCardBody = ({ weather, error }) => {
  if (error)  {
    let text = 'Error while loading data'
    
    if (error.response.status === 404) text = 'No data for this location'

    return <Typography color='error'>{text}</Typography>
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

CityCardBody.propTypes = {
  weather: PropTypes.object,
  error: PropTypes.object,
}

export default CityCardBody

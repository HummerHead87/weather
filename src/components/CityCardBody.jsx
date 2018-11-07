import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


import WeatherInfo from './WeatherInfo'
import FromNow from './FromNow'

const styles = theme => ({
  caption: {
    marginTop: theme.spacing.unit,
    textAlign: 'right'
  }
})

const CityCardBody = ({ weather, error, classes }) => {
  if (error)  {
    let text = 'Error while loading data'
    
    if (error.response.status === 404) text = 'No data for this location'

    return <Typography color='error'>{text}</Typography>
  }

  if (weather) {
    return (
      <div>
        <WeatherInfo weather={weather} />
        <Typography variant="caption" className={classes.caption}>
          <FromNow date={weather.dt * 1000}></FromNow>
        </Typography>
      </div>
    )
  }

  return null
}

CityCardBody.propTypes = {
  weather: PropTypes.object,
  error: PropTypes.object,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CityCardBody)

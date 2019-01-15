import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import currentLocation from '../decorators/currentLocation'
import { loadWeatherCurrent } from '../store/actions'

import CityInfo from './CityInfo'

const styles = theme => ({
  label: {
    marginBottom: theme.spacing.unit * 2
  },
  rightButton: {
    marginLeft: 'auto'
  }
})

class CurrentCity extends Component {
  state = {
    loading: false
  }

  componentDidUpdate(prevProps) {
    const { currentLocation, loadWeatherCurrent } = this.props

    if (!prevProps.currentLocation && currentLocation
        && !(currentLocation instanceof Error)) {
      loadWeatherCurrent(currentLocation)
    }
  }

  render() {
    const {
      classes,
      detecting,
      currentLocation,
      weather,
      loading,
      error,
      loadWeatherCurrent,
    } = this.props

    const detectingError = currentLocation instanceof Error
    
    return (
      <Card>
        <CardContent>
          {weather && (
            <Typography variant="h5" component="h3">
              {weather.name}, {weather.sys.country}
            </Typography>
          )}
          {(loading || detecting) && <LinearProgress />}
          <Typography component="p" className={classes.label}>
            Your current location:
          </Typography>
          {detectingError && (
            <Typography color='error'>
              Your location could not be determined
            </Typography>
          )}
          {detecting && <Typography>Detecting your current location</Typography>}
          <CityInfo weather={weather} error={error}></CityInfo>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            className={classes.rightButton}
            onClick={() => loadWeatherCurrent(currentLocation)}
            disabled={loading || !currentLocation}
          >
            Reload
          </Button>
        </CardActions>
      </Card>
    )
  }
}

CurrentCity.propTypes = {
  classes: PropTypes.object.isRequired,
  // from currentLocation decorator
  detecting: PropTypes.bool,
  currentLocation: PropTypes.object,
  // from redux
  weather: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
  loadWeatherCurrent: PropTypes.func.isRequired,
}

export default connect(state => ({
  weather: state.weather.items.find(({ id }) => id === state.cities.currentCityId),
  loading: state.weather.loading.includes('current'),
  error: state.weather.errors.get('current')
}), { loadWeatherCurrent })(withStyles(styles)(currentLocation(CurrentCity)))

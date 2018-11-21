import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import currentLocation from '../decorators/currentLocation'
import { loadWeatherCurrent } from '../store/actions'

import CityCardBody from './CityCardBody'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

class CurrentCity extends Component {
  state = {
    loading: false
  }

  componentDidUpdate(prevProps) {
    const { currentLocation, loadWeatherCurrent } = this.props

    if (!prevProps.currentLocation && currentLocation) {
      loadWeatherCurrent(currentLocation)
    }
  }

  render() {
    const { classes, detecting, currentLocation, weather, loading, error } = this.props
    
    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          This is a sheet of paper.
        </Typography>
        <Typography component="p">
          Paper can be used to build surface or other elements for your application.
        </Typography>
        {!currentLocation && <Typography>Get your current location</Typography>}
        {loading && <LinearProgress />}
        <CityCardBody weather={weather} error={error}></CityCardBody>
      </Paper>
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
  weather: state.weather.items.find(({ current }) => current),
  loading: state.weather.loading.includes('current'),
  error: state.weather.errors.get('current')
}), { loadWeatherCurrent })(withStyles(styles)(currentLocation(CurrentCity)))

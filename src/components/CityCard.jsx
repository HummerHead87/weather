import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { deleteCity, loadWeather } from '../store/actions'

import CityCardBody from './CityCardBody'


const styles = () => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  rightButton: {
    marginLeft: 'auto'
  }
})

class CityCard extends Component {
  componentDidMount() {
    const {loading, weather, loadWeather} = this.props

    if (!loading || !weather) loadWeather()
  }

  render() {
    const {classes, city, deleteCity, loading, weather, error, loadWeather} = this.props

    return (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" component="h2">
            {city.name}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            {city.countryName}
          </Typography>
          {loading ? (
            <LinearProgress />
          ) : (
            <CityCardBody weather={weather} error={error}></CityCardBody>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={deleteCity}>
            Remove
          </Button>
          <Button
            size="small"
            color="primary"
            className={classes.rightButton}
            onClick={loadWeather}
            disabled={loading}
          >
            Reload
          </Button>
        </CardActions>
      </Card>
    )
  }
}

CityCard.propTypes = {
  classes: PropTypes.object.isRequired,
  city: PropTypes.object.isRequired,
  // from redux
  loading: PropTypes.bool,
  weather: PropTypes.object,
  error: PropTypes.object,
  deleteCity: PropTypes.func.isRequired,
  loadWeather: PropTypes.func.isRequired,
}

export default connect((state, ownProps) => ({
  loading: state.weather.loading.includes(ownProps.city.geonameId),
  weather: state.weather.items.get(ownProps.city.weatherId.toString()),
  error: state.weather.errors.get(ownProps.city.geonameId.toString())
}), (dispatch, ownProps) => ({
  deleteCity: () => dispatch(deleteCity(ownProps.city.geonameId)),
  loadWeather: () => dispatch(loadWeather(ownProps.city))
}))(withStyles(styles)(CityCard))

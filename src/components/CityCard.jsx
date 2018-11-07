import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { deleteCity, loadWeather } from '../store/actions'


const styles = theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  rightButton: {
    marginLeft: 'auto'
  }
})

const WeatherInfo = ({ weather, error }) => {
  if (error)  {
    let text = 'Error while loading data'
    
    if (error.response.status === 404) text = 'No data for this location'

    return <Typography color='error'>{text}</Typography>
  }

  if (weather) {
    return (
      <Typography>
        Temperature: {Math.round(weather.main.temp)} &deg;С
      </Typography>
    )
  }

  return null
}

WeatherInfo.propTypes = {
  weather: PropTypes.object,
  error: PropTypes.object
}

class CityCard extends Component {
  componentDidMount() {
    const {loading, weather, loadWeather} = this.props

    if (!loading || !weather) loadWeather()
  }

  render() {
    const {classes, city, deleteCity, loading, weather, error, loadWeather} = this.props

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
          title="Image title"
        />
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
            <WeatherInfo weather={weather} error={error}/>
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

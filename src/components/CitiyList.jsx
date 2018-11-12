import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'

import CityCard from './CityCard'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
})

const CityList = (props) => {
  const {classes, cities} = props

  if (!cities) return null
  
  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={40}>
        {cities.map(city => (
          <Grid item key={city.geonameId} xs={12} sm={6} md={4} lg={3}>
            <CityCard
              city={city}
            ></CityCard>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

CityList.propTypes = {
  classes: PropTypes.object.isRequired,
  // from redux
  cities: PropTypes.object.isRequired,
}

export default connect(state => ({
  cities: state.cities.items
}))(withStyles(styles)(CityList))

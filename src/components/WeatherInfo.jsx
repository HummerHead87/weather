import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import FromNow from './FromNow'

const styles = theme => ({
  row: {
    height: 'auto'
  },
  cell: {
    padding: theme.spacing.unit,
    '&:last-child': {
      textAlign: 'right',
      paddingRight: theme.spacing.unit,
    }
  },
  caption: {
    marginTop: theme.spacing.unit,
    textAlign: 'right'
  }
})


const WeatherInfo = (props) => {
  const { weather, classes } = props

  return (
    <div>
      <Table padding="dense">
        <TableBody>
          <TableRow className={classes.row}>
            <TableCell className={classes.cell}>Weather</TableCell>
            <TableCell className={classes.cell}>{weather.weather[0].main}</TableCell>
          </TableRow>
          <TableRow className={classes.row}>
            <TableCell className={classes.cell}>Temperature</TableCell>
            <TableCell className={classes.cell}>{Math.round(weather.main.temp)} &deg;С</TableCell>
          </TableRow>
          <TableRow className={classes.row}>
            <TableCell className={classes.cell}>Humidity</TableCell>
            <TableCell className={classes.cell}>{Math.round(weather.main.humidity)} %</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="caption" className={classes.caption}>
        <FromNow date={weather.dt * 1000}></FromNow>
      </Typography>
    </div>
  )
}

WeatherInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  weather: PropTypes.object.isRequired,
}

export default withStyles(styles)(WeatherInfo)

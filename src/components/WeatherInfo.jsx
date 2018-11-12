import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

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
  }
})


const WeatherInfo = (props) => {
  const { weather, classes } = props

  return (
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
  )
}

WeatherInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  weather: PropTypes.object.isRequired,
}

export default withStyles(styles)(WeatherInfo)

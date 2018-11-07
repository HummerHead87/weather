import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'


const WeatherInfo = (props) => {
  const { weather } = props

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Weather</TableCell>
          <TableCell>{weather.weather[0].main}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Temperature</TableCell>
          <TableCell>{Math.round(weather.main.temp)} &deg;С</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

WeatherInfo.propTypes = {
  weather: PropTypes.object.isRequired,
}

export default WeatherInfo

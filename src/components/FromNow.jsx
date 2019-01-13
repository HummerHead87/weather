import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { interval } from 'rxjs'
import { startWith, map } from 'rxjs/operators'

export default class FromNow extends Component {
  state = {
    fromNow: ''
  }

  componentDidMount() {
    // каждую минуту обновляем кол-во времени, прошедшего с заданного момента
    this.fromNow$ = interval(1000 * 6)
      .pipe(
        startWith(0),
        map(() => moment(this.props.date).fromNow())
      )
      .subscribe(fromNow => this.setState({ fromNow }))
  }

  componentWillUnmount() {
    this.fromNow$.complete()
  }
  
  render() {
    const { fromNow } = this.state

    return (
      <span>{fromNow}</span>
    )
  }
}

FromNow.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired
}

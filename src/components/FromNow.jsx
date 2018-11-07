import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Observable } from 'rxjs/Rx'

export default class FromNow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fromNow: ''
    }
  }

  componentDidMount() {
    const fromNow$ = Observable
      .interval(1000 * 60)
      .startWith(0)
      .map(() => moment(this.props.date).fromNow())
      .subscribe(fromNow => this.setState({ fromNow }))
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

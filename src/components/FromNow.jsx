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
    this.fromNow$ = Observable
      .interval(1000 * 6)
      .startWith(0)
      .map(() => moment(this.props.date).fromNow())
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

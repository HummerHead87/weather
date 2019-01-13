import React, {Component} from 'react'
import getLocationByIP from '../observables/getLocationByIp'

export default (OriginalComponent) => class CurrentLocation extends Component {
  state = {
    currentLocation: null,
    detecting: false
  }

  async componentDidMount() {
    let currentLocation

    this.setState({ detecting: true })

    if (navigator.geolocation) {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(pos => {
          currentLocation = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          }

          resolve()
        },
        failure => {
          reject(failure)
        })
      })
    }

    if (!currentLocation) {
      currentLocation = await this.getCityByIP()
    }

    this.setState({ detecting: false, currentLocation })
  }

  render () {
    return <OriginalComponent {...this.props} {...this.state} />
  }

  getCityByIP = () => {
    return new Promise(resolve => {
      getLocationByIP.subscribe(
        ({ city, country: countryCode }) => {
          resolve({ city, countryCode })
        }
      )
    })
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CloudIcon from '@material-ui/icons/Cloud'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { hot } from 'react-hot-loader'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import './App.less'

import CityDialog from './components/CityDialog'
import CityList from './components/CitiyList'
import CurrentCity from './components/CurrentCity'
import AboutDialog from './components/AboutDialog'

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit}px ${theme.spacing.unit * 6}px`,
  },
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
})

class Album extends Component {
  state = {
    cityDialog: false,
    aboutDialog: false,
  }

  handleCityDialog = (value) => {
    this.setState({ cityDialog: value})
  }

  handleAboutDialog = (value) => {
    this.setState({ aboutDialog: value})
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <CloudIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
              World weather
            </Typography>
            <Button color="inherit" onClick={() => this.handleAboutDialog(true)}>About</Button>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                World weather
              </Typography>
              <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                Watch weather in your current location or in any other city in the world
              </Typography>
              <CurrentCity></CurrentCity>
            </div>
          </div>
          {/* End hero unit */}

          <CityList></CityList>

          <Tooltip
            title="Add city"
            aria-label="Add city"
            placement="left"
          >
            <Fab
              className={classes.fab}
              color="primary"
              onClick={() => this.handleCityDialog(true)}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Valeyev Rustam 2018
          </Typography>
        </footer>
        {/* End footer */}
        <CityDialog
          open={this.state.cityDialog}
          key={this.state.cityDialog}
          onChangeOpen={this.handleCityDialog}
        ></CityDialog>
        <AboutDialog
          open={this.state.aboutDialog}
          onChangeOpen={this.handleAboutDialog}
        ></AboutDialog>
      </React.Fragment>
    )
  }
}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default hot(module)(withStyles(styles)(Album))

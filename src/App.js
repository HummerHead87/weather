import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CloudIcon from '@material-ui/icons/Cloud'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { hot } from 'react-hot-loader'
import AddIcon from '@material-ui/icons/Add'

import CityDialog from './components/CityDialog'
import CityList from './components/CitiyList'

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit}px ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  buttonIcon: {
    marginRight: theme.spacing.unit,
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
})

class Album extends Component {
  state = {
    cityDialog: false
  }

  handleCityDialog = (value) => {
    this.setState({ cityDialog: value})
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <CloudIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              World weather
            </Typography>
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
                Watch weather in your current location and in any city in the world
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container justify="center">
                  <Button variant="contained" color="primary" onClick={() => this.handleCityDialog(true)}>
                    <AddIcon className={classes.buttonIcon} />
                    Add city
                  </Button>
                </Grid>
              </div>
            </div>
          </div>
          {/* End hero unit */}

          <CityList></CityList>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
        <CityDialog
          open={this.state.cityDialog}
          key={this.state.cityDialog}
          onChangeOpen={this.handleCityDialog}
        ></CityDialog>
      </React.Fragment>
    )
  }
}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default hot(module)(withStyles(styles)(Album))

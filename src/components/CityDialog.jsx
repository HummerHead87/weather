import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CitySelect from './CitySelect'

const styles = theme => ({
  root: {
    overflow: 'visible'
  },
  textLabel: {
    marginBottom: theme.spacing.unit * 3
  }
})

class CityDialog extends Component {
  state = {
    city: null
  }

  handleCityChange = (city) => {
    this.setState({ city })
  }

  render() {
    const { open, onChangeOpen, classes } = this.props

    return (
      <Dialog
        classes={{ paperScrollPaper: classes.root}}
        open={open}
        onClose={() => onChangeOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Choose a city</DialogTitle>
        <DialogContent className={classes.root}>
          <DialogContentText className={classes.textLabel}>
            To find city start typing and pick a one from suggestions.
          </DialogContentText>
          <CitySelect autoFocus onChange={this.handleCityChange}></CitySelect>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onChangeOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onChangeOpen(false)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

CityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChangeOpen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CityDialog)

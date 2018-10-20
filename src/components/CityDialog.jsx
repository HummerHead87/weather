import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CitySelect from './CitySelect'
import { withFormik } from 'formik'

const styles = theme => ({
  root: {
    overflow: 'visible'
  },
  textLabel: {
    marginBottom: theme.spacing.unit * 3
  },
  clear: {
    marginRight: 'auto'
  }
})

class CityDialog extends Component {
  render() {
    const {
      open,
      onChangeOpen,
      classes,
      values,
      touched,
      errors,
      isSubmitting,
      handleSubmit,
      handleReset,
      setFieldValue,
      setFieldTouched,
      dirty,
    } = this.props

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
          <CitySelect
            autoFocus
            value={values.city}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            error={errors.city}
            touched={touched.city}
          ></CitySelect>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.clear}
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
            color="primary"
          >
            Clear
          </Button>
          <Button onClick={() => onChangeOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} color="primary">
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
  values: PropTypes.object.isRequired,
  touched: PropTypes.object,
  errors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
}

const FormCityDialog = withFormik({
  mapPropsToValues: () => ({ city: null }),

  validate: values => {
    const errors = {}
    if (!values.city) {
      errors.city = 'Choose a city'
    }

    return errors
  },

  handleSubmit: (values, context) => {
    // TODO: insert store action here
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      context.setSubmitting(false)
    }, 1000)
  },

  displayName: 'FormCityDialog'
})(withStyles(styles)(CityDialog))

export default FormCityDialog

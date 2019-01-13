import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const libs = [
  'React v16, Redux',
  'create-react-app',
  {
    label: 'Material-UI',
    href: 'https://material-ui.com/',
    annotation: 'material styled components for React',
  },
  'Axios',
  'RXJS',
  'Immutable.js',
  {
    label: 'redux-persist',
    href: 'https://github.com/rt2zz/redux-persist',
    annotation: 'persisted state for redux'
  },
  'Moment.js',
  {
    label: 'redux-observable',
    href: 'https://github.com/redux-observable/redux-observable',
  },
  'Lodash',
  {
    label: 'Formik',
    href: 'https://github.com/jaredpalmer/formik',
    annotation: 'form validation for React',
  }
]

class AboutDialog extends Component {
  render() {
    const { open, onChangeOpen } = this.props

    return (
      <Dialog
        open={open}
        onClose={() => onChangeOpen(false)}
        fullWidth
        aria-labelledby="about-dialog-title"
      >
        <DialogTitle id="about-dialog-title">About</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Stack & libs:</Typography>
          <List dense>
            {libs.map(item => {
              if (typeof item === 'string') {
                return (
                  <ListItem key={item}>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                )
              } else {
                const { label, href, annotation = null } = item

                return (
                  <ListItem key={label}>
                    <ListItemText>
                      <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>{annotation && ` - ${annotation}`}
                    </ListItemText>
                  </ListItem>
                )
              }
            })}
          </List>
          <Typography align="right" gutterBottom>World weather by Valeyev Rustam. 2018</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onChangeOpen(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

AboutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChangeOpen: PropTypes.func.isRequired,
}

export default AboutDialog

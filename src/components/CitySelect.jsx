import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import LinearProgress from '@material-ui/core/LinearProgress'
import pick from 'lodash/pick'
import { autobind } from 'core-decorators'

import { Subject} from 'rxjs'
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators'


import loadCities from '../observables/loadCities'

function renderInput(inputProps) {
  const { InputProps, classes, ref, error, touched, ...other  } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      error={touched && !!error}
      helperText={touched && error}
      {...other}
    />
  )
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index
  const isSelected = suggestion === selectedItem

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.geonameId}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.name} ({suggestion.countryName})
    </MenuItem>
  )
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ name: PropTypes.string }).isRequired,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  inputProgress: {
    height: '1px',
  },
  popper: {
    zIndex: 1
  }
})

let popperNode

@autobind
class CitySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      suggestions: [],
    }

    this.loadCities$ = new Subject()
    this.loadCities$
      .pipe(
        filter(value => value.length >= 1),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => loadCities(value)),
      )
      .subscribe(({ result: suggestions = [], loading = false}) => {
        this.setState({ suggestions, loading })
      })
  }

  handleChange({ target: { value }}) {
    this.props.onChange('city', value)
    this.loadCities$.next(value)
  }

  handleBlur() {
    this.props.onBlur('city', true)
  }

  handleKeyPress(e) {
    if(e.keyCode == 13){
      this.props.onSubmit()
    }
  }

  citySelect(city) {
    this.props.onChange('city',
      pick(city, ['name', 'countryCode', 'countryName', 'geonameId'])
    )
  }

  generateLabel(city) {
    if (typeof city === 'string') {
      return city
    } else {
      return city ? `${city.name} (${city.countryName})` : ''
    }
  }

  render() {
    const {
      classes,
      autoFocus,
      error,
      touched,
      value
    } = this.props
    const { suggestions, loading } = this.state

    return (
      <div className={classes.root}>
        <Downshift
          onSelect={this.citySelect}
          itemToString={item => this.generateLabel(item)}
          inputValue={this.generateLabel(value)}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            isOpen,
            selectedItem
          }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                autoFocus,
                error,
                touched,
                InputProps: getInputProps({
                  placeholder: 'Search a city',
                  onChange: this.handleChange,
                  onBlur: this.handleBlur,
                  onKeyDown: this.handleKeyPress
                }),
                ref: node => {
                  popperNode = node
                },
              })}
              <div {...getMenuProps()}>
                <Popper
                  disablePortal
                  open={isOpen}
                  anchorEl={popperNode}
                  className={classes.popper}
                >
                  <Paper
                    square
                    style={{
                      width: popperNode ? popperNode.clientWidth : null
                    }}
                  >
                    { loading ? (
                      <LinearProgress className={classes.inputProgress}></LinearProgress>
                    ) : (
                      suggestions.map((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({ item: suggestion }),
                          highlightedIndex,
                          selectedItem
                        })
                      )
                    ) }
                  </Paper>
                </Popper>
              </div>
            </div>
          )}
        </Downshift>
      </div>
    )
  }
}

CitySelect.propTypes = {
  classes: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
}

export default withStyles(styles)(CitySelect)

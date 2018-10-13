import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Subject } from 'rxjs/Rx';

import loadCities from '../observables/loadCities';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other  } = inputProps;

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
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
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
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
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
  }
});

let popperNode;

class IntegrationDownshift extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      city: '',
      suggestions: []
    };

    this.loadCities$ = new Subject();
    this.loadCities$
      .filter(value => value.length >= 1)
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(value => loadCities(value))
      .subscribe(({ result: suggestions = [], loading = false}) => {
        this.setState({ suggestions, loading })
      });
  }

  handleChange = ({ target: { value }}) => {
    this.loadCities$.next(value)
  };

  citySelect = ({ name, countryCode }) => {
    this.setState({
      city: { name, countryCode },
    })
  }

  render() {
    const { classes } = this.props;
    const { suggestions, loading } = this.state

    return (
      <div className={classes.root}>
        <Downshift
          onChange={this.citySelect}
          itemToString={item => item ? `${item.name} (${item.countryName})` : ''}
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
                InputProps: getInputProps({
                  placeholder: 'Search a city',
                  onChange: this.handleChange
                }),
                ref: node => {
                  popperNode = node;
                },
              })}
              <div {...getMenuProps()}>
                <Popper disablePortal open={isOpen} anchorEl={popperNode}>
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
    );
  }
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IntegrationDownshift);

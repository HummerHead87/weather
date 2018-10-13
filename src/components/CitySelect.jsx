import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
// import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Chip from '@material-ui/core/Chip';

import { Subject } from 'rxjs/Rx';

// import Suggestion from './Suggestion';
import getCities from '../observables/getCities';

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
    height: 250
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
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  divider: {
    height: theme.spacing.unit * 2
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

    this.getCities$ = new Subject();
    this.getCities$
      .debounceTime(400)
      .distinctUntilChanged()
      .filter(value => value.length >= 2)
      .map(value => deburr(value))
      .do(() => this.setState({ loading: true }))
      .switchMap(value => getCities(value))
      // .delay(1000)
      .catch((err, outputObs) => {
        this.setState({ loading: false });
        return outputObs;
      })
      .subscribe(suggestions => {
        this.setState({
          loading: false,
          suggestions
        });
      });
  }

  handleChange = ({ target: { value }}) => {
    this.getCities$.next(value)
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
          itemToString={({ name, countryName }) => `${name} (${countryName})`}
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

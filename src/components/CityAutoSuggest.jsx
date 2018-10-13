import React, { Component } from 'react'
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { Subject } from 'rxjs/Rx';

import getCities from '../observables/getCities'

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
        {' '}({suggestion.countryName})
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(data) {
  return `${data.name} (${data.countryName})`;
}

const styles = theme => ({
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  inputProgress: {
    height: '1px',
  }
});

class CityAutoSuggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      city: '',
      label: '',
      suggestions: [],
    };

    this.getCities$ = new Subject();
    this.getCities$
      .debounceTime(400)
      .distinctUntilChanged()
      .filter(value => value.length >= 3)
      .map(value => deburr(value))
      .do(() => this.setState({ loading: true }))
      .switchMap(value => getCities(value))
      // .delay(1000)
      .catch((err, outputObs) => {
        this.setState({loading: false})
        return outputObs
      })
      .subscribe(suggestions => {
        this.setState({
          loading: false,
          suggestions,
        })
      });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.getCities$.next(value)
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = () => (event, { newValue }) => {
    this.setState({
      city: newValue,
    });
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          placeholder: 'Search a city',
          value: this.state.city,
          onChange: this.handleChange(),
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          loading ? (
            <LinearProgress className={classes.inputProgress}></LinearProgress>
          ) : (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )
        )}
      />
    );
  }
}

CityAutoSuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CityAutoSuggest);

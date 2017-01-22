/*eslint-disable react/no-set-state */
import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';

// <input className='searchInput' placeholder='Search' type='search' />
class Layout extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  onSuggestionsFetchRequested(input) {
    let matches = TEMP_GENES.filter( d => {
      return d.name.toLowerCase().match(input.value.toLowerCase());
    });
    this.setState({
      suggestions: matches
    });
  }

  renderSuggestion(d) {
    return (
      <div>
        {d.name}
      </div>
    );
  }

  render() {
    const getSuggestionValue = d => d.name;
    const inputProps = {
      placeholder: 'Search for a gene',
      value: this.state.value,
      onChange: this.onChange.bind(this)
    };
    return (
      <div>
        <i className='fa fa-search searchIcon' />
        <ul className='menu'>
          <li>
            <Autosuggest
              getSuggestionValue={getSuggestionValue}
              inputProps={inputProps}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
              renderSuggestion={this.renderSuggestion}
              suggestions={this.state.suggestions}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default Layout;

const TEMP_GENES = [
  {
    name: 'ABC123',
  },
  {
    name: 'XYZ123'
  }
];

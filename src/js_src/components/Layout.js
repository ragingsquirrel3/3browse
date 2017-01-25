/*eslint-disable react/no-set-state */
import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import d3 from 'd3';

import style from './style.css';

const DATA_URL = '/public/geneData_2.0.json';
const GENE_NAME_INDEX = 4;
const MIN_SEARCH_CHAR = 2;

// <input className='searchInput' placeholder='Search' type='search' />
class Layout extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  parseData(raw) {
    let genes = [];
    let chroms = Object.keys(raw);
    chroms.forEach( (chrom) => {
      let chromData = raw[chrom];
      let chromGenes = Object.keys(chromData);
      chromGenes.forEach( (gene) => {
        genes.push(chromData[gene]);
      });
    });
    return genes;
  }

  fetchData() {
    d3.json(DATA_URL, (err, json) => {
      this.rawData = this.parseData(json);
    });
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
    if (input.value.length < MIN_SEARCH_CHAR) {
      return;
    }
    let matches = this.rawData.filter( d => {
      return d[GENE_NAME_INDEX].toLowerCase().match(input.value.toLowerCase());
    });
    this.setState({
      suggestions: matches
    });
  }

  onSuggestionSelected() {
  }

  renderSuggestion(d) {
    return (
      <div>
        {d[GENE_NAME_INDEX]}
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
    let _theme = {
      // container: style.autoContainer,
      // containerOpen: style.autoContainerOpen,
      input: style.autoInput,
      suggestionsContainer: style.suggestionsContainer,
      suggestionsList: style.suggestionsList,
      suggestion: style.suggestion,
      suggestionFocused: style.suggestionFocused
    };
    return (
      <div>
        <ul className='menu'>
          <li>
            <Autosuggest
              getSuggestionValue={getSuggestionValue}
              inputProps={inputProps}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
              onSuggestionSelected={this.onSuggestionSelected}
              renderSuggestion={this.renderSuggestion}
              suggestions={this.state.suggestions}
              theme={_theme}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default Layout;

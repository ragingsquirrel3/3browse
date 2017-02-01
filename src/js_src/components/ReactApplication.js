/*eslint-disable react/no-set-state */
import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import d3 from 'd3';

import style from './style.css';
import VizComp from './VizComp';

const DATA_URL = '/public/geneData_2.0.json';
const GENE_NAME_INDEX = 4;
const MIN_SEARCH_CHAR = 2;

// <input className='searchInput' placeholder='Search' type='search' />
class Layout extends Component {
  constructor() {
    super();
    this.state = {
      chrom: 1,
      position: '0 0 0',
      value: '',
      suggestions: []
    };
  }

  componentDidMount() {
    this.fetchData();
    setInterval( () => {
      this.setPositionFromCamera();
    }, 3000);
  }

  setPositionFromCamera() {
    let el = document.getElementById('vbrowse-camera');
    let obj = el.getAttribute('position');
    this.setState({ position: `${obj.x} ${obj.y} ${obj.z}` });
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

  onChange(event, obj) {
    if (obj.method !== 'type') return;
    this.setState({
      value: obj.newValue
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
      return d[GENE_NAME_INDEX].toLowerCase().startsWith(input.value.toLowerCase());
    });
    this.setState({
      suggestions: matches
    });
  }

  onSuggestionSelected(event, { suggestion }) {
    let d = suggestion;
    document.getElementById('eventProxy').click();
    this.setState({
      positon: `${d[1]} ${d[2]} ${d[3]}`,
      value: d[GENE_NAME_INDEX]
    });
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
      input: style.autoInput,
      suggestionsContainer: style.suggestionsContainer,
      suggestionsList: style.suggestionsList,
      suggestion: style.suggestion,
      suggestionFocused: style.suggestionFocused
    };
    return (
      <div>
        <ul className='menu'>
          <li className={style.searchUberContainer}>
            <i className={`fa fa-search ${style.searchIcon}`} />
            <Autosuggest
              getSuggestionValue={getSuggestionValue}
              inputProps={inputProps}
              onSuggestionSelected={this.onSuggestionSelected.bind(this)}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}  
              renderSuggestion={this.renderSuggestion}
              suggestions={this.state.suggestions}
              theme={_theme}
            />
          </li>
        </ul>
        <VizComp chrom={this.state.chrom} position={this.state.position} />
      </div>
    );
  }
}

export default Layout;

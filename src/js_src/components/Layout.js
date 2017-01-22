import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';

// <input className='searchInput' placeholder='Search' type='search' />
class Layout extends Component {
  render() {
    return (
      <div>
        <i className='fa fa-search searchIcon' />
        <ul className='menu'>
          <li>
            <Autosuggest />
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
    name: 'ABC123'
  }
];

import React, { Component } from 'react';
import d3 from 'd3';

import renderViz from '../lib/renderViz';

const INIT_DELAY = 500;
const DATA_URL = '/data';

class VizComp extends Component {
  componentDidMount() {
    this.drawBoilerplateData();
    document.getElementById('eventProxy').addEventListener('click', () => {
      this.fetchAndRenderData();
    });
  }

  load() {
    d3.select('#loadingTarget').attr('visible', true);
    d3.select('.target').html('');
  }

  fetchAndRenderData() {
    this.load();
    d3.json(DATA_URL, (err, json) => {
      renderViz(json, true);
    });
  }

  drawBoilerplateData() {
    setTimeout( () => {
      renderViz(window.BOOTSTRAP_DATA);
    }, INIT_DELAY);
  }

  render() {
    console.info(this.props);
    return <span />;
  }
}

VizComp.propTypes = {
  position: React.PropTypes.string
};

export default VizComp;

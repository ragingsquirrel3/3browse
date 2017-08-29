import React, { Component } from 'react';
import d3 from 'd3';

import renderViz from '../lib/renderViz';

const INIT_DELAY = 500;
const DATA_URL = '/public/data/example_data.json';

class VizComp extends Component {
  componentDidMount() {
    // this.drawBoilerplateData();
    this.fetchAndRenderData();
    document.getElementById('eventProxy').addEventListener('click', () => {
      this.fetchAndRenderData();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.position !== prevProps.position) {
      this.fetchAndRenderData();
    }
  }

  load() {
    d3.select('#loadingTarget').attr('visible', true);
    d3.select('.target').html('');
  }

  fetchAndRenderData() {
    this.load();
    // construct API URL from position
    // let p = this.props.position.split(' ');
    // let chrom = this.props.chrom;
    // to format more params
    // let url = `${DATA_URL}?chrom=${chrom}&x=${p[0]}&y=${p[1]}&z=${p[2]}`;
    // or
    // simple
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
    return <span />;
  }
}

VizComp.propTypes = {
  chrom: React.PropTypes.number,
  position: React.PropTypes.string
};

export default VizComp;

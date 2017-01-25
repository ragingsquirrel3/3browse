import React, { Component } from 'react';

import renderViz from '../lib/renderViz';

const INIT_DELAY = 500;

class VizComp extends Component {
  componentDidMount() {
    this.drawBoilerplateData();
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
  position: React.PropTypes.string
};

export default VizComp;

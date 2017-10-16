/*eslint-disable  no-unused-vars, quotes, mquote, no-unreachable */
import d3 from 'd3';
import _ from 'underscore';

var RADIUS = 0.125;
var SEGS = 16;
var DATA_PER_NODE = 25;
var LOW_FI_DATA_PER_NODE = 150;
var FI_THRESHOLD = 2;
var DEFAULT_COLOR = '#4390bc';

var X_OFFSET = 3;
var Y_OFFSET = 6;
var Z_OFFSET = 4;

export default function renderFromData (rawData, isClear) {
  var spaceRegulatedData = formatData(rawData);
  // remove loader
  var target = d3.select('.target');
  d3.select('#loadingTarget').attr('visible', false);
  if (isClear) {
    target.attr('position', '-9 -5 -8');
  }
  // clear
  target.html('');
  var userPosition = document.querySelector('#vbrowse-camera').getAttribute('position');
  // render chromosomes
  var chromData = formatChromData(spaceRegulatedData, userPosition);
  var colorScale = d3.scale.category20().domain(chromData.map( function(d) { return d.id; }));
  var chromNodes = target.selectAll('.chrom').data(chromData, function(d) { return d.id; });
  chromNodes.enter().append('a-entity')
    .attr({
      class: 'chrom'
    });
  chromNodes.exit().remove();
  // begin chrom node work
  chromNodes.each(function(d) {
    var sel = d3.select(this);
    var thisChromData = d.regions;
    var cylinderData = thisChromData;
    var cylinderNodes = sel.selectAll('.region').data(cylinderData);
    cylinderNodes.enter().append('a-entity')
      .attr({
        class: 'region'
      });
    cylinderNodes.exit().remove();
    cylinderNodes
      .attr({
        position: function(_d) { return _d.position; },
        "look-at": function(_d) { return _d.lookPos; }
      }).each(function(_d) {
        var _sel = d3.select(this);
        var cylinder = _sel.append('a-cylinder')
          .attr({
            color: function(__d) {
              return colorScale(_d.chrom);
            },
            rotation: '90 0 0',
            height: function(_d) { return _d.height; },
            radius: RADIUS,
            "segments-radial": SEGS
          });
      });
    // sphere "elbows"
    var elbows = sel.selectAll('.elbow').data(cylinderData);
    elbows.enter().append('a-sphere')
      .attr({
        class: 'elbow',
        color: function(_d) {
          return colorScale(_d.chrom);
        },
        radius: RADIUS,
        'segments-width': SEGS,
        'segments-height': SEGS,
        position: function(_d) { return _d.lookPos; }
      });
    elbows.exit().remove();

  // end chrom node work
  });
}

function formatCylinderData (raw) {
  var cylinderData = raw
    .reduce( (current, d, i) => {
      if (i !== 0) {
        var prevD = raw[i - 1];
        var distance = calcDistance(d, prevD);
        var mid = calcMid(d, prevD);
        var midPos = mid.x.toString() + " " + mid.y.toString() + " " + mid.z.toString();
        var lookPos = d.x.toString() + " " + d.y.toString() + " " + d.z.toString();
        var thisData = {
          height: distance,
          position: midPos,
          lookPos: lookPos,
          chrom: d.chrom
        };
        current.push(thisData);
      }
      return current;
    }, []);
  return cylinderData;
}

function formatChromData(_raw, userPosition) {
  var chroms = _.groupBy(_raw, 'chrom');
  var keys = Object.keys(chroms);
  return keys.map( function(d, i) {
    // limit regins to one every DATA_PER_NODE
    var theseRegions = chroms[d].filter( function(_d, _i) {
      var filterNumber = (calcDistance(_d, userPosition) < FI_THRESHOLD) ? DATA_PER_NODE : LOW_FI_DATA_PER_NODE;
      return _i % filterNumber === 0;
    });
    theseRegions = formatCylinderData(theseRegions);
    return {
      id: d,
      regions: theseRegions
    };
  });
}

function calcDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calcMid(a, b) {
  var mX = mean(a.x, b.x);
  var mY = mean(a.y, b.y);
  var mZ = mean(a.z, b.z);
  return {
    x: mX,
    y: mY,
    z: mZ
  };
}

function mean(a, b) {
  return (a + b) / 2;
}

function formatData(raw) {
  // calc scale and regulate to 3d scale in meters
  const DISTANCE = 5;
  // calc max spread of data
  let extentX = d3.extent(raw, d => d.x);
  let extentY = d3.extent(raw, d => d.y);
  let extentZ = d3.extent(raw, d => d.z);
  let deltaX = Math.abs(extentX[0] -  extentX[1]);
  let deltaY = Math.abs(extentY[0] -  extentY[1]);
  let deltaZ = Math.abs(extentZ[0] -  extentZ[1]);
  let maxDelta = Math.max(deltaX, deltaY, deltaZ);
  // calc medians to properly transform
  let mx = d3.median(raw, d => d.x);
  let my = d3.median(raw, d => d.y);
  let mz = d3.median(raw, d => d.z);
  let distanceScale = d3.scale.linear().domain([0, maxDelta]).range([-DISTANCE, DISTANCE]);
  let distanceTransform = d => {
    return _.extend(d, {
      x: distanceScale(d.x - mx) + X_OFFSET,
      y: distanceScale(d.y - my) + Y_OFFSET,
      z: distanceScale(d.z - mz) + Z_OFFSET,
    });
  };
  var formattedApiData = raw.map( function(d, i) {
    return distanceTransform(d);
  });
  return formattedApiData;
}

/*eslint-disable  no-unused-vars, quotes, mquote, no-unreachable */
import d3 from 'd3';
import _ from 'underscore';

var DATA_PER_NODE = 25;
var DEFAULT_COLOR = '#4390bc';

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

  // render chromosomes
  var chromData = formatChromData(spaceRegulatedData);
  var colorScale = d3.scale.category20().domain(chromData.map( function(d) { return d.id; }));
  var chromNodes = target.selectAll('.chrom').data(chromData, function(d) { return d.id; });
  chromNodes.enter().append('a-entity')
    .attr({
      class: 'chrom'
    });
  chromNodes.exit().remove();
  // begin chrom node work
  chromNodes.each(function(d, i) {
    var sel = d3.select(this);
    var thisChromData = d.regions;
    var cylinderData = thisChromData;

    var chromId =  'chrom' + i.toString();
    var color = colorScale(thisChromData[0].chrom);

    var curveTrack = sel.append('a-curve')
      .attr({
        id: chromId
      });

    var curvePoints = curveTrack.selectAll('.curvePoint').data(thisChromData);
    curvePoints.enter().append('a-curve-point')
      .attr({
        class: 'curvePoint',
        position: function(d) { return d.position; }
      });
    curvePoints.exit().remove();

    var curve = sel.append('a-draw-curve')
      .attr({
        curveref: '#' + chromId,
        material: 'shader: line; color: ' + color + ';'
      });
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

function formatChromData(_raw) {
  var chroms = _.groupBy(_raw, 'chrom');
  var keys = Object.keys(chroms);
  return keys.map( function(d, i) {
    // limit regins to one every DATA_PER_NODE
    var theseRegions = chroms[d].filter( function(_d, _i) {
      return _i % DATA_PER_NODE === 0;
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
      x: distanceScale(d.x - mx) + 5,
      y: distanceScale(d.y - my) + 5,
      z: distanceScale(d.z - mz) + 2,
    });
  };
  var formattedApiData = raw.map( function(d, i) {
    return distanceTransform(d);
  });
  return formattedApiData;
}

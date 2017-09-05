/*eslint-disable  no-unused-vars, quotes, mquote */
import d3 from 'd3';

var RADIUS = 0.1;
var SEGS = 16;

export default function renderFromData (rawData, isClear) {
  var data = formatData(rawData);
  // remove loader
  var target = d3.select('.target');
  d3.select('#loadingTarget').attr('visible', false);
  if (isClear) {
    target.attr('position', '-9 -5 -8');
  }
  var cylinderData = formatCylinderData(data);
  
  target.html("");
  var cylinders = target.selectAll('.region').data(cylinderData);
  cylinders.enter().append('a-entity')
    .attr({
      class: "region"
    });
  cylinders.exit().remove();
  cylinders
    .attr({
      position: function(d) { return d.position; },
      "look-at": function(d) { return d.lookPos; }
    }).each(function(d) {
      var sel = d3.select(this);
      var cylinder = sel.append("a-cylinder")
        .attr({
          color: "#4390bc",
          rotation: "90 0 0",
          height: function(d) { return d.height; },
          radius: RADIUS,
          "segments-radial": SEGS
        });
    });

  var elbows = target.selectAll('.elbows').data(cylinderData);
  elbows.enter().append("a-sphere")
    .attr({
      class: "elbows",
      color: "#4390bc",
      radius: RADIUS,
      "segments-width": SEGS,
      "segments-height": SEGS,
      position: function(d) { return d.lookPos; }
    });
  elbows.exit().remove();

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
            lookPos: lookPos
          };
          current.push(thisData);
        }
        return current;
      }, []);
    return cylinderData;
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
}

function formatData(_raw) {
  let raw = _raw.slice(0, 250);
  // calc scale and regulate to 3d scale in meters
  const DISTANCE = 15;
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
    return {
      x: Math.round(distanceScale(d.x - mx)) + 5,
      y: Math.round(distanceScale(d.y - my)) + 15,
      z: Math.round(distanceScale(d.z - mz)) + 5
    };
  };
  var formattedApiData = raw.map( function(d, i) {
    return distanceTransform(d);
  });
  return formattedApiData;
}

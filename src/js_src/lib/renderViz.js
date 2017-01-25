/*eslint-disable  no-unused-vars, quotes,  */
import d3 from 'd3';

var RADIUS = 0.02;
var SEGS = 16;

export default function renderFromData (rawData, isClear) {
  var data = formatData(rawData);
  // remove loader
  var target = d3.select(".target");
  d3.select("#loadingTarget").attr("visible", false);
  if (isClear) {
    target.attr("position", "-9 -5 -8");
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

function formatData(raw) {
  var formattedApiData = raw.map( function(d, i) {
    var endIndex = Math.min(raw.length - 1, i + 1);
    var _end = raw[endIndex][1];
    return { start: d[1], end: _end, x: d[2], y: d[3], z: d[4] };
  });
  return formattedApiData;
}

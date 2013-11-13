'use strict';

var epicenterMap;
var epicenterLatLng = new google.maps.LatLng(36.05, -118.25);
var epicenterMarkers = [];

function Epicenter () {

}

function initialize() {
  var mapOptions = {
    center: epicenterLatLng,
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    panControl: true,
    zoomControl: false,
    scaleControl: false,
    mapTypeControl: false,
    streetViewControl: false
  };
  epicenterMap = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
}

function resizeHeight () {
  var h = $(window).height();
  var w = $(window).width();
  // Resize the fluid-container. 
  $('.pool-view').height(650);
  // $('.pool-sidebar').height(h - 20);
  $('#map-canvas').height(620);
}

function generateMarker (name, address) {
  // First geocode the location to get the latitude and longitude.
  // (https://developers.google.com/maps/documentation/javascript/geocoding)
  // READ (http://docs.openlayers.org/library/spherical_mercator.html)
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address': address, latLng: epicenterLatLng }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // Using the latitude and longitude add a marker to the map.
      // (https://developers.google.com/maps/documentation/javascript/markers)
      if (1 == results.length) {
        epicenterMarkers.push(new google.maps.Marker({
          position: results[0].geometry.location,
          title: name,
          animation: google.maps.Animation.DROP,
          map: epicenterMap
        }));
      }
    }
  });
}

function removeMarkerByTitle (title) {
  for (var i = epicenterMarkers.length - 1; i >= 0; i--) {
    if (epicenterMarkers[i].title == title) {
      epicenterMarkers[i].setMap(null);
      break;
    }
  };
}

// Returns the number of actual addresses that match the address.
// Uses geocoding to see how many latlng match.
// function numberOfLocations(address) {
//   var geocoder = new google.maps.Geocoder();
//   var deferred = $q.defer();
//   geocoder.geocode( {'address': address, latLng: epicenterLatLng }, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       return deferred.resolve(results.length);
//     }
//     return deferred.reject();
//   });
//   return deferred.promise;
// }

/**
 * Seismometer Graph
 * Creates an animated seismometer graph.
 */
function Seismometer () {
  this.n = 60;
  this.dt = new Date();
  this.random = d3.random.normal(0, .01);
  this.data = d3.range(this.n).map(this.random); 
  this.margin = {top: 20, right: 20, bottom: 30, left: 50};
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.x = d3.scale.linear()
    .domain([0, this.n - 1])
    .range([0, this.width]);
  this.y = d3.scale.linear()
    .domain([-1, 1])
    .range([this.height, 0]);
  this.line = null;
  this.svg = null;
  this.path = null;
  this.nextQuakeTime = this.dt.getTime() + Math.floor((Math.random()*10)+1) * 1000;
  this.quakeEndTime = null;
  this.inQuake = false;
}

Seismometer.prototype.createSvg = function () {
  var self = this;
  this.line = d3.svg.line()
    .x(function(d, i) { return self.x(i); })
    .y(function(d, i) { return self.y(d); });
  this.svg = d3.select("#seismometer")
    .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  this.svg.append("defs")
    .append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);
  this.path = this.svg.append("g").attr("clip-path", "url(#clip)")
    .append("path")
    .datum(this.data)
    .attr("class", "line")
    .attr("d", this.line);
};

Seismometer.prototype.tick = function () {
  var d = new Date();
  // Determine if a quake is happening.
  if (!this.inQuake && d.getTime() > this.nextQuakeTime) {
    // Generate the duration of the quake.
    this.quakeEndTime = 2 + d.getTime() + Math.floor((Math.random()*10)+1) * 1000;
    // Modify the random function to have a larger amplitude for a few seconds.
    this.random = d3.random.normal(0, .5);
    // Now we are in a quake.
    this.inQuake = true;
  }

  if (this.inQuake && d.getTime() > this.quakeEndTime) {
    // Generate when the next 'random' quake will happen.
    this.nextQuakeTime = 5 + d.getTime() + Math.floor((Math.random()*15)+1) * 1000;
    // Modify the random function to return to the normal small graph.
    this.random = d3.random.normal(0, .01);
    // We are no longer in a quake.
    this.inQuake = false;
  }

  // Push a new data point onto the stack.
  this.data.push(this.random());
  // Redraw the line and slide it to the left.
  var self = this;
  this.path.attr("d", this.line)
    .attr("transform", null)
    .transition()
      .duration(750)
      .ease("linear")
      .attr("transform", "translate(" + this.x(-1) + ")")
      .each("end", function() {
        self.tick();
      });
  // Shift the data out.
  this.data.shift();
};

Seismometer.prototype.start = function() {
  this.createSvg();
  this.tick();
};

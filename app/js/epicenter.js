'use strict';

var epicenterMap;
var epicenterLatLng = new google.maps.LatLng(36.05, -118.25);

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
  $('.container').height(h - 60)
  // $('.pool-sidebar').height(h - 20);
  $('#map-canvas').height(h - 60);
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
        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          title: name,
          map: epicenterMap
        });
      }
    }

  });

}

// Returns the number of actual addresses that match the address.
// Uses geocoding to see how many latlng match.
function numberOfLocations(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address': address, latLng: epicenterLatLng }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      return results.length;
    }
    return 0;
  });
}

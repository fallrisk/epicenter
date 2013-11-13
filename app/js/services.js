'use strict';

/* Services */

angular.module('epicenterApp.services', ['ngResource'])
  .value('version', 'v0.0.1')
  .factory('Pool', [ '$http', '$resource', function($http, $resource) {
    return $resource('REST/pool/:poolId', {}, {
      query: {method: 'GET', params:{poolId: ''}, isArray: true},
      addBet: {method: 'POST', params:{poolId: '@poolId'}, url: 'REST/pool/addBet'}
    });
  }])
  .factory('GeoCode', function($q) {
    return { 
      numberOfLocations: function(address) {
        var geocoder = new google.maps.Geocoder();
        var deferred = $q.defer();
        geocoder.geocode( {'address': address, latLng: epicenterLatLng }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            return deferred.resolve(results.length);
          }
          return deferred.reject();
        });
        return deferred.promise;
      }
    };
  });

// TODO Function to add a bet.

// TODO Function to check if the bet already exists in the pool on client side.

// TODO Function to save the new bet. Update the pool with the new bet.

// TODO Function to convert name location to latitude and longitude coordinates
// if it can. It it cannot it needs to return an error.

// TODO Function to use Google Places Autocomplete for California. This needs
// to be toggleable in the view. Check out (http://jsfiddle.net/mwDQr/1/)

// TODO Have the background be a vibration instrument going off every few seconds.
// Try D3.js full screen background.
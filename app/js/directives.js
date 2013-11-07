'use strict';

/* Directives */


angular.module('epicenterApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('validLocation', ['GeoCode', function(geoCode) { 
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.push(function(viewValue) {
          if (viewValue.length < 5) {
            ctrl.$setValidity('validLocation', false);
            return undefined;
          }
          geoCode.numberOfLocations(viewValue)
          .then(function(results) {
            // console.log('numberOfLocations(viewValue): ' + numberOfLocations(viewValue));
            console.log('results', results);
            if (1 == results) {
              ctrl.$setValidity('validLocation', true);
              return viewValue;
            } else {
              ctrl.$setValidity('validLocation', false);
              return undefined;
            }
          });
        });
      }
    };
  }]);

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
          if (viewValue != undefined && viewValue.length < 5) {
            ctrl.$setValidity('validLocation', false);
            return undefined;
          }
          geoCode.numberOfLocations(viewValue)
          .then(function(results) {
            if (1 == results) {
              ctrl.$setValidity('validLocation', true);
            } else {
              ctrl.$setValidity('validLocation', false);
            }
          });
        return viewValue;
        });
      }
    };
  }]);

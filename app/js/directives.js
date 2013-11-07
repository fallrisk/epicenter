'use strict';

/* Directives */


angular.module('epicenterApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('validLocation', function() {
    console.log('here');  
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          console.log('here');
          if (1 == numberOfLocations(viewValue)) {
            ctrl.$setValidity('validLocation', true);
            return viewValue;
          } else {
            ctrl.$setValidity('validLocation', false);
            return undefined;            
          }
        });
      }
    };
  });

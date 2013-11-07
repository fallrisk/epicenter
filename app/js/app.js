'use strict';


// Declare app level module which depends on filters, and services
angular.module('epicenterApp', [
  'ngRoute',
  'ngAnimate',
  'epicenterApp.directives',
  'epicenterApp.controllers',
  'epicenterApp.services'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pool/:poolId', {templateUrl: 'partials/pool.html', controller: 'PoolCtrl'});
  $routeProvider.when('/start', {templateUrl: 'partials/start.html', controller: 'StartCtrl'})
  $routeProvider.otherwise({redirectTo: '/start'});
}]);

'use strict';

/* Controllers */

angular.module('epicenterApp.controllers', []).
  controller('PoolCtrl', ['$scope', '$http', '$routeParams', 'Pool', function ($scope, $http, $routeParams, Pool) {

    $scope.viewSlideAnimation = 'slide-left';

    $scope.pool = Pool.get({poolId: $routeParams.poolId}, function (pool) {
      // Create a marker on the map for each bet.
      for (var i = pool.bets.length - 1; i >= 0; i--) {
        generateMarker(pool.bets[i].name, pool.bets[i].location);
      }
    });

    $scope.addBet = function () {
      $scope.pool.bets.push({name: $scope.newBet.name, location: $scope.newBet.location});
      generateMarker($scope.newBet.name, $scope.newBet.location);
      $scope.pool.$save();
    };

    $scope.removeBet = function (bet) {
      var index = $scope.pool.bets.indexOf(bet);
      if (index > -1) {
        $scope.pool.bets.splice(index, 1);
        removeMarkerByTitle(bet.name);
        $scope.pool.$save();
      }
    };

    // Adjust the height of the view.
    initialize();

    resizeHeight();
    $(window).resize(function () {
      resizeHeight();
    });
  }])

  .controller('StartCtrl', ['$scope', function($scope) {
    $scope.newPoolId = token();
    var seismometer = new Seismometer();
    var h = $(window).height();
    var w = $(window).width();
    seismometer.width = $('.jumbotron').width();
    seismometer.height = $('.jumbotron').height() + 100;
    seismometer.start();
  }]);

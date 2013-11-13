'use strict';

/* Controllers */

angular.module('epicenterApp.controllers', []).
  controller('PoolCtrl', ['$scope', '$http', '$routeParams', 'Pool', function ($scope, $http, $routeParams, Pool) {

    $scope.pool = Pool.get({poolId: $routeParams.poolId}, function (pool) {
      // Create a marker on the map for each bet.
      for (var i = pool.bets.length - 1; i >= 0; i--) {
        generateMarker(pool.bets[i].name, pool.bets[i].location);
      }
    });

    $scope.addBet = function (newBet) {
      $scope.pool.bets.push({name: newBet.name, location: newBet.location});
      generateMarker(newBet.name, newBet.location);
      $scope.pool.$save();
      $scope.newBet = {};
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

    $(window).resize(function () {
      resizeHeight();
    });
    $(window).load( function() {
      resizeHeight();
    });
  }])

  .controller('StartCtrl', ['$scope', function($scope) {
    $scope.newPoolId = token();
    // var seismometer = new Seismometer();
    // var h = $(window).height();
    // var w = $(window).width();
    // seismometer.width = $('.jumbotron').width();
    // seismometer.height = $('.jumbotron').height() + 100;
    // seismometer.start();
  }])

  .controller('AdminCtrl', ['$scope', 'Pool', function($scope, Pool) {
    $scope.pools = Pool.query({}, function(pools) {
    });

  }]);

var fishbowl = angular.module('fishbowl', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {

  // all of these just append to <div ng-view> in index.html
  $routeProvider.when('/', {
    controller: 'SplashController',
    templateUrl: 'templates/splash.html'
  })
  .when('/lobby', {
    controller: 'LobbyController',
    templateUrl: 'templates/lobby.html'
  })
  .when('/game', {
    controller: 'GameController',
    templateUrl: 'templates/game.html'
  })
  .otherwise({redirectTo: '/404'});
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {

  // on page refresh, redirect to root url every time
  $location.path('/');

  $rootScope.username = '';
  $rootScope.room = null;
  $rootScope.socket = null;
  $rootScope.score = 0;
}]);

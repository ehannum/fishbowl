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
  // .when('/game/:id', {
  //   controller: 'GameController',
  //   templateUrl: 'templates/game.html'
  // })
  .otherwise({redirectTo: '/404'});
}])
.run(['$rootScope', function ($rootScope) {

}]);
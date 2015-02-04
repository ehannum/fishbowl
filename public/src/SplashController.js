fishbowl.controller('SplashController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
  $scope.play = function () {
    $rootScope.socket = io();
    $rootScope.username = prompt('Select a username:');
    $rootScope.room = 0;

    $rootScope.socket.emit('join', $rootScope.username);
    $location.path('/game');
  };
}]);

fishbowl.controller('SplashController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
  $scope.play = function () {
    $rootScope.socket = io();
    //var username = prompt('Select a username:');

    $rootScope.socket.emit('join', 'ERIC');
  };
}]);

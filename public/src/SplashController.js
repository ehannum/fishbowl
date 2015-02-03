fishbowl.controller('SplashController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
  $scope.play = function () {
    var username = prompt('Select a username:');
    $http.post('/join', {user: username, room: 0})
    .success(function () {
      console.log('joined a game.');
      // go to '/#/game'
    });
  };
}]);

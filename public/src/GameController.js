fishbowl.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
  $scope.players = [];
  $scope.answers = [];

  var unzipCards = function () {
    for (var i = 0; i < $scope.cards.length; i++) {
      $scope.players.push($scope.cards[i].player);
      $scope.answers.push($scope.cards[i].answer);
    }

    $scope.players = shuffle($scope.players);
    $scope.answers = shuffle($scope.answers);
  };

  var shuffle = function (arr) {
    var result = [];

    while (arr.length) {
      var randomIndex = Math.floor(Math.random()*arr.length);
      var randomElement = arr.splice(randomIndex, 1);
      result.push(randomElement[0]);
    }

    return result;
  };

  var socket = io();
  console.log(socket);

  $timeout(unzipCards, 2000);
}]);

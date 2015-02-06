fishbowl.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
  $scope.players = [];
  $scope.answers = [];
  $scope.prompt = '';

  // This logic needs to happen outside the ng-repeat scope
  // in order to $digest all it's child elements. Wow, gross.
  $scope.selectedAnswer = null;
  $scope.selectedPlayer = null;

  $scope.selectAnswer = function (index) {
    if ($scope.selectedAnswer === index) {
      $scope.selectedAnswer = null;
    } else {
      $scope.selectedAnswer = index;
    }
  };

  $scope.selectPlayer = function (index) {
    if ($scope.selectedPlayer === index) {
      $scope.selectedPlayer = null;
    } else {
      $scope.selectedPlayer = index;
    }
  };

  $scope.submit = function () {
    $rootScope.socket.emit('guess', {
      player: $scope.players[$scope.selectedPlayer],
      answer: $scope.answers[$scope.selectedAnswer]
    });
  };

  $scope.cancel = function () {
    $scope.selectedAnswer = null;
    $scope.selectedPlayer = null;
  };

  $rootScope.socket.on('join-leave', function (data) {
    unzipCards(data);
    $scope.$digest();
  });

  var unzipCards = function (stack) {
    var players = [];
    var answers = [];

    for (var card in stack) {
      players.push(stack[card].player);
      if (stack[card].answer) {
        answers.push(stack[card].answer);
      }
    }

    $scope.players = shuffle(players);
    $scope.answers = shuffle(answers);
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

  $http.get('/room?0').success(function (data) {
    $scope.prompt = data.prompt;
    unzipCards(data.players);
  });
}]);

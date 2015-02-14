fishbowl.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
  $scope.players = [];
  $scope.answers = [];
  $scope.prompt = '';

  $scope.phase = 1;
  $scope.currentPlayer = 0;
  $scope.you = null;

  $scope.results = {
    who: null,
    player: null,
    answer: null,
    result: null
  };

  // Selection logic needs to happen outside the ng-repeat scope
  // in order to $digest all it's child elements. Wow, gross.
  $scope.selectedAnswer = null;
  $scope.selectedPlayer = null;

  $scope.selectAnswer = function (index) {
    if ($scope.answers[index].out) {
      return;
    }
    if ($scope.selectedAnswer === index) {
      $scope.selectedAnswer = null;
    } else {
      $scope.selectedAnswer = index;
    }
  };

  $scope.selectPlayer = function (index) {
    if ($scope.players[index].out) {
      return;
    }
    if ($scope.selectedPlayer === index) {
      $scope.selectedPlayer = null;
    } else {
      $scope.selectedPlayer = index;
    }
  };

  $scope.submitGuess = function () {
    var activePlayers = 0;

    for (var i = 0; i < $scope.players.length; i++) {
      if (!$scope.players[i].out) {
        activePlayers++;
      }
    }

    if ($rootScope.username === $scope.players[$scope.selectedPlayer].name && activePlayers > 1) {
      alert('You can\'t guess yourself ya bing-bong!');
    } else {
      $rootScope.socket.emit('guess', {
        username: $rootScope.username,
        room: $rootScope.room,
        player: $scope.players[$scope.selectedPlayer].name,
        answer: $scope.answers[$scope.selectedAnswer].text
      });
    }
    $scope.cancelGuess();
  };

  $scope.cancelGuess = function () {
    $scope.selectedAnswer = null;
    $scope.selectedPlayer = null;
  };

  $scope.submission = '';

  $scope.submitPrompt = function () {
    $scope.phase = null; // while we wait, just do nothing
    $rootScope.socket.emit('prompt', {
      text: $scope.submission,
      username: $rootScope.username,
      room: $rootScope.room
    });
    $scope.submission = '';
  };

  $scope.submitAnswer = function () {
    $scope.phase = 3;
    $rootScope.socket.emit('answer', {
      text: $scope.submission,
      username: $rootScope.username,
      room: $rootScope.room
    });
    $scope.submission = '';
  };

  // socket.io stuff. Remember to $digest() manually...

  $rootScope.socket.on('player-join', function (data) {
    unzipCards(data);

    if ($scope.players.length <= 1) {
      $scope.currentPlayer = 0;
    }
    $scope.$digest();
  });

  $rootScope.socket.on('player-leave', function (data) {
    unzipCards(data);
    gameOver();

    if ($scope.players.length <= 1) {
      $scope.currentPlayer = 0;
    }
    $scope.$digest();
  });

  $rootScope.socket.on('prompt', function (data) {
    $scope.prompt = data.text;
    $scope.phase = 2;
    $scope.$digest();
  });

  $rootScope.socket.on('all-answered', function (data) {
    $scope.phase = 4;
    unzipCards(data);

    // start new round of play
    for (var i = 0; i < $scope.players.length; i++) {
      $scope.players[i].out = false;
    }
    $scope.$digest();
  });

  $rootScope.socket.on('guess', function (data) {
    // broadcast results, switch players if !data.result

    $timeout(function () {
      $scope.results.who = data.username;
    }, 1500);
    $timeout(function () {
      $scope.results.player = data.player;
    }, 3000);
    $timeout(function () {
      $scope.results.answer = data.answer;
    }, 4500);
    $timeout(function () {
      $scope.results.result = data.result ? 'CORRECT!' : 'WRONG!';

      if (data.result) {
        if (data.username === $rootScope.username) {
          $rootScope.score++;
        }

        for (var i = 0; i < $scope.players.length; i++) {
          if ($scope.players[i].name === data.player) {
            $scope.players[i].out = true;
          }
        }

        for (var j = 0; j < $scope.answers.length; j++) {
          if ($scope.answers[j].text === data.answer) {
            $scope.answers[j].out = true;
          }
        }
      } else {
        // ???
      }
      $rootScope.$digest();
    }, 7500);
    $timeout(function () {
      $scope.results = {
        who: null,
        player: null,
        answer: null,
        result: null
      };

      gameOver();
    }, 10000);
  });

  // game utils

  var gameOver = function () {
    var activePlayers = 0;

    for (var i = 0; i < $scope.players.length; i++) {
      if (!$scope.players[i].out) {
        activePlayers++;
      }
    }

    if (activePlayers === 0 || $scope.players.length === 1) {
      $scope.restart();
    }
  };

  $scope.restart = function () {
    $scope.prompt = '';
    $scope.answers = [];
    $scope.phase = 1;
    $scope.currentPlayer++;
    if ($scope.currentPlayer >= $scope.players.length) {
      $scope.currentPlayer = 0;
    }
  };

  var unzipCards = function (stack) {
    var players = [];
    var answers = [];

    for (var card in stack) {
      players.push({name: stack[card].player, out: stack[card].out});
      if (stack[card].answer) {
        answers.push({text: stack[card].answer, out: stack[card].out});
      }
    }

    $scope.players = players;

    for (var i = 0; i < $scope.players.length; i++) {
      if ($scope.players[i].name === $rootScope.username) {
        $scope.you = i;
        break;
      }
    }

    if ($scope.phase === 4) {
      $scope.answers = shuffle(answers);
    }
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

  // initial room construction

  $http.get('/room?0').success(function (data) {
    $scope.prompt = data.prompt;
    $scope.phase = data.phase;
    $scope.currentPlayer = data.currentPlayer;
    unzipCards(data.players);
  });
}]);

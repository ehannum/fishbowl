fishbowl.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
  $scope.players = [];
  $scope.answers = [];
  $scope.prompt = '';

  $scope.phase = null;
  $scope.currentAsker = 0;
  $scope.currentGuesser = 1;
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
    if ($scope.answers[index].out || $scope.you !== $scope.currentGuesser) {
      return;
    }
    if ($scope.selectedAnswer === index) {
      $scope.selectedAnswer = null;
    } else {
      $scope.selectedAnswer = index;
    }
  };

  $scope.selectPlayer = function (index) {
    if ($scope.players[index].out || $scope.you !== $scope.currentGuesser) {
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
    $scope.phase = 'post-ask';
    $rootScope.socket.emit('prompt', {
      text: $scope.submission,
      username: $rootScope.username,
      room: $rootScope.room
    });
    $scope.submission = '';
  };

  $scope.submitAnswer = function () {
    $scope.phase = 'post-answer';
    $rootScope.socket.emit('answer', {
      text: $scope.submission,
      username: $rootScope.username,
      room: $rootScope.room
    });
    $scope.submission = '';
  };

  // socket.io stuff. Remember to $digest() manually...

  $rootScope.socket.on('player-join', function (data) {
    setupCards(data);

    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].name === $rootScope.username) {
        $scope.you = i;
      }
    }

    $scope.$digest();
  });

  $rootScope.socket.on('player-leave', function (data) {
    setupCards(data);
    gameOver();
    $scope.$digest();
  });

  $rootScope.socket.on('prompt', function (data) {
    $scope.prompt = data.text;
    $scope.phase = 'answer';
    $scope.$digest();
  });

  $rootScope.socket.on('all-answered', function (data) {
    $scope.phase = 'guess';
    setupCards(data);

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
        (function nextActiveGuesser () {
          $scope.currentGuesser++;
          if ($scope.currentGuesser >= $scope.players.length) {
            $scope.currentGuesser = 0;
          }
          if ($scope.currentAsker === $scope.currentGuesser || $scope.players[$scope.currentGuesser].out) {
            nextActiveGuesser();
          }
        })();
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

    if (activePlayers === 0 || $scope.players.length === 1 || $scope.phase === 'post-answer') {
      $scope.restart();
    }
  };

  $scope.restart = function () {
    $scope.prompt = '';
    $scope.answers = [];
    $scope.phase = 'ask';
    $scope.currentAsker++;
    if ($scope.currentAsker >= $scope.players.length) {
      $scope.currentAsker = 0;
    }
  };

  var setupCards = function (cards) {
    $scope.players = cards.players;
    if ($scope.phase === 'guess') {
      $scope.answers = cards.answers;
    }
  };

  // initial room construction

  $http.get('/room?0').success(function (data) {
    $scope.prompt = data.prompt;
    $scope.phase = data.phase;
    $scope.currentAsker = data.currentAsker;
    $scope.currentGuesser = data.currentGuesser;
    setupCards({players: data.players, answers: data.answers});

    $rootScope.socket.emit('join', $rootScope.username);
  });
}]);

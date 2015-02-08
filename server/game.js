exports.rooms = [
  {

    prompt: 'Answer a question.',
    players: {
      B: {player:'Joe', answer:'Yerba', out: false},
      U: {player:'Lisa', answer:'Mostidas', out: false},
      H: {player:'Brian', answer:'Stretch Armstrong', out: false}
    }
  }
];

exports.joinRoom = function (user, room, id) {
  if (!exports.rooms[room]) {
    exports.rooms.push({prompt:'', players: []});
  }
  exports.rooms[room].players[id] = {player: user, answer: null, out: false};
};

exports.leaveRoom = function (id, room) {
  delete exports.rooms[room].players[id];
  if (exports.rooms[room].players.length === 0) {
    exports.rooms[room] = null;
  }
};

exports.guess = function (room, player, guess) {
  var players = exports.rooms[room].players;
  var correct = false;

  for (var answer in players) {
    if (players[answer].player === player && players[answer].answer !== guess) {
      break;
    }

    if (players[answer].player === player && players[answer].answer === guess) {
      players[answer].out = true;
      correct = true;
      break;
    }
  }

  return correct;
};

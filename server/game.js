exports.rooms = [
  {
    prompt: 'Answer a question.',
    players: {
      B: {player:'Joe', answer:'Yerba'},
      U: {player:'Lisa', answer:'Mostidas'},
      H: {player:'Brian', answer:'Stretch Armstrong'}
    }
  }
];

exports.joinRoom = function (user, room, id) {
  if (!exports.rooms[room]) {
    exports.rooms.push({prompt:'', players: []});
  }
  exports.rooms[room].players[id] = {player: user, answer: null};
};

exports.leaveRoom = function (id, room) {
  delete exports.rooms[room].players[id];
  if (exports.rooms[room].players.length === 0) {
    exports.rooms[room] = null;
  }
};

exports.guess = function (room, player, guess) {
  var answers = exports.rooms[room].players;
  var correct = false;

  for (var answer in answers) {
    if (answers[answer].player === player && answers[answer].answer !== guess) {
      break;
    }

    if (answers[answer].player === player && answers[answer].answer === guess) {
      correct = true;
      break;
    }
  }

  return correct;
};

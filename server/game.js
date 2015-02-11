exports.rooms = [
  {
    phase: 1,
    prompt: null,
    players: {
      // player: "string",
      // answer: "string",
      // out: boolean
    }
  }
];

exports.joinRoom = function (user, room, id) {
  if (!exports.rooms[room]) {
    exports.rooms.push({prompt:'', players: []});
  }
  exports.rooms[room].players[id] = {player: user, answer: null, out: true};
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


exports.answer = function (room, player, answer) {
  var players = exports.rooms[room].players;
  var complete = true;

  for (var user in players) {
    if (players[user].player === player) {
      players[user].player.answer = answer;
    }

    if ((players[user].answer && players[user].out) || (!players[user].answer && !players[user].out)) {
      complete = false;
    }
  }

  return complete;
};

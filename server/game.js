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

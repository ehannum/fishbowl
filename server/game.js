exports.rooms = [
  {
    prompt: 'Answer a question.',
    players: [
      {player:'Joe', answer:'Yerba'},
      {player:'Lisa', answer:'Mostidas'},
      {player:'Brian', answer:'Stretch Armstrong'}
    ]
  }
];

exports.joinRoom = function (user, room) {
  var exists = true;

  if (!exports.rooms[room]) {
    exists = false;
    exports.rooms.push({prompt:'', players: []});
  }
  exports.rooms[room].players.push({player: user, answer: null});

  return exists;
};

exports.leaveRoom = function (user, room) {

};

var Bowl = function () {

};

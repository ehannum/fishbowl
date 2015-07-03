exports.rooms = [
  {
    phase: 'ask',
    prompt: null,
    currentAsker: 0,
    currentGuesser: 1,
    players: [
      // { id: "string",
      // name: "string",
      // answer: "string",
      // out: boolean }
    ]
  }
];

exports.joinRoom = function (name, room, id) {
  if (!exports.rooms[room]) {
    exports.rooms.push({prompt:'', players: [], phase: 'ask', currentGuesser: 1, currentAsker: 0});
  }
  exports.rooms[room].players.push({id: id, name: name, answer: null, out: true});
};

exports.leaveRoom = function (id, room) {
  var players = exports.rooms[room].players;
  var name = '';
  if (exports.rooms[room].phase === 'post-answer') {
    restart(room);
  }

  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      name = players[i].name;
      players.splice(i, 1);
      break;
    }
  }
  if (exports.rooms[room].currentAsker >= players.length) {
    exports.rooms[room].currentAsker = 0;
  }
  if (players.length === 0 && exports.rooms.length > 1) {
    exports.rooms[room] = null;
  }

  return name;
};

exports.guess = function (room, player, guess) {
  var players = exports.rooms[room].players;
  var correct = false;
  var activePlayers = 0;

  for (var answer in players) {
    if (players[answer].name === player && players[answer].answer === guess) {
      players[answer].out = true;
      correct = true;
    }
    if (!players[answer].out) {
      activePlayers++;
    }
  }

  if (activePlayers === 0) {
    restart(room);
  }

  return correct;
};

exports.answer = function (room, player, answer) {
  var players = exports.rooms[room].players;
  var complete = true;

  for (var i = 0; i < players.length; i++) {
    if (players[i].name === player){
      players[i].answer = answer;
    }

    if (!players[i].answer && !players[i].out) {
      complete = false;
    }
  }

  return complete;
};

exports.newRound = function (room) {
  room = exports.rooms[room];
  room.phase = 'post-answer';

  for (var i = 0; i < room.players.length; i++) {
    room.players[i].out = false;
  }
};

var restart = function (room) {
  room = exports.rooms[room];
  room.phase = 'ask';
  room.prompt = null;
  room.currentAsker++;
  if (room.currentAsker >= room.players.length) {
    room.currentAsker = 0;
  }

  for (var i = 0; i < room.players.length; i++) {
    room.players[i].out = true;
    room.players[i].answer = null;
  }
};

exports.shuffle = function (arr) {
  var result = [];

  while (arr.length) {
    var randomIndex = Math.floor(Math.random()*arr.length);
    var randomElement = arr.splice(randomIndex, 1);
    result.push(randomElement[0]);
  }

  return result;
};

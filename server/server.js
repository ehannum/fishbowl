var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.get('/room', function (req, res) {
  var room = req.url.split('?')[1];

  res.send(getRoomData(room));
});

var getRoomData = function (room) {
  // don't send any of the information about submitted answers
  var roomData = {
    prompt: game.rooms[room].prompt,
    phase: game.rooms[room].phase,
    currentAsker: game.rooms[room].currentAsker,
    currentGuesser: game.rooms[room].currentGuesser,
    players: [],
    answers: []
  };

  for (var i = 0; i < game.rooms[room].players.length; i++) {
    roomData.players.push({name: game.rooms[room].players[i].name, out: game.rooms[room].players[i].out});
    roomData.answers.push({text: game.rooms[room].players[i].answer, out: game.rooms[room].players[i].out});
  }

  roomData.answers = game.shuffle(roomData.answers);

  return roomData;
};

// -- SOCKET.IO

// AT THE MOMENT there is ony one room just called "0".
// todo: add the ability to create and join specific rooms

io.on('connection', function (socket) {

  socket.on('join', function (name) {
    game.joinRoom(name, 0, socket.id);

    console.log('A user has connected:', name);
    io.emit('player-join', getRoomData(0));
  });

  socket.on('guess', function (data) {
    data.result = game.guess(data.room, data.player, data.answer);
    data.currentGuesser = game.rooms[0].currentGuesser;

    console.log(data.username, 'guessed that', data.player, 'said', data.answer, '...', data.result ? 'CORRECT!' : 'WRONG!');
    io.emit('guess', data);
  });

  socket.on('prompt', function (data) {
    game.newRound(data.room);

    console.log(data.username, 'asked "' + data.text + '"');
    io.emit('prompt', data);
  });

  socket.on('answer', function (data) {
    var complete = game.answer(data.room, data.username, data.text);

    console.log(data.username, 'said "' + data.text + '"');

    if (complete) {
      console.log('All active players have answered.');
      game.rooms[data.room].phase = 'guess';
      io.emit('all-answered', getRoomData(0));
    }
  });

  socket.on('disconnect', function () {
    if (!game.rooms[0]) return;

    var name = game.leaveRoom(socket.id, 0);
    console.log('A user has disconnected.', name);

    if (!game.rooms[0]) return;

    io.emit('player-leave', getRoomData(0));
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);

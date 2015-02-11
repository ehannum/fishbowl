var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');

// -- SERVE STARIC FILES

app.use(express.static('public'));

app.get('/room', function (req, res) {
  var room = req.url.split('?')[1];
  res.send(game.rooms[room]);
});

// -- SOCKET.IO

io.on('connection', function (socket) {

  socket.on('join', function (user) {
    game.joinRoom(user, 0, socket.id);

    console.log('A user has connected:', game.rooms[0].players[socket.id].player);
    io.emit('player-join', game.rooms[0].players[socket.id]);
  });

  socket.on('guess', function (data) {
    data.result = game.guess(data.room, data.player, data.answer);

    console.log(data.username, 'guessed that', data.player, 'said', data.answer, '...', data.result ? 'CORRECT!' : 'WRONG!');
    io.emit('guess', data);
  });

  socket.on('prompt', function (data) {
    game.rooms[data.room].phase = 2;

    console.log(data.username, 'asked, "' + data.text + '"');
    io.emit('prompt', data);
  });

  socket.on('answer', function (data) {
    var complete = game.answer(data.room, data.username, data.text);

    console.log(data.username, 'asked, "' + data.text + '"');

    if (complete) {
      game.rooms[data.room].phase = 3;
      io.emit('all-answered', game.rooms[data.room].players);
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', game.rooms[0].players[socket.id].player);
    game.leaveRoom(socket.id, 0);

    io.emit('player-leave', game.rooms[0].players);
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);

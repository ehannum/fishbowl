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

    console.log('A user has connected.', game.rooms[0].players);
    io.emit('join-leave', game.rooms[0].players);
  });

  socket.on('disconnect', function () {
    game.leaveRoom(socket.id, 0);

    console.log('A user has disconnected.', game.rooms[0].players);
    io.emit('join-leave', game.rooms[0].players);
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);

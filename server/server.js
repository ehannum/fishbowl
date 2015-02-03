var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');
var bodyParser = require('body-parser');

// -- SERVE STARIC FILES

app.use(express.static('public'));
app.use(bodyParser.json());

// -- GAME STUFF

app.post('/join', function (req, res) {
  console.log(req.body.user);
  res.send(game.joinRoom(req.body.user, req.body.room));
});

// -- SOCKET.IO

io.on('connection', function (socket) {
  console.log('A user has connected.', socket.id);
  socket.on('disconnect', function () {
    console.log('A user has disconnected.', socket.id);
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);

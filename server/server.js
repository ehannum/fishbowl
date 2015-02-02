var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// -- SERVE STARIC FILES

app.use(express.static('public'));

// -- SOCKET.IO

io.on('connection', function (socket) {
  console.log('A user has connected.');
  socket.on('disconnect', function () {
    console.log('A user has disconnected.');
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);
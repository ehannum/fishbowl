var express = require('express');
var app = express();

// -- SERVE STARIC FILES

app.use(express.static('public'));

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
app.listen(port);
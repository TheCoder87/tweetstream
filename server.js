var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var twit = require('twit');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function() {
  console.log('Listening on port 3000');
});

io.on('connect', function(client) {
  console.log('Client connected...');

  client.on('join', function(data) {
    console.log(data);
    client.emit('messages', 'Hello from the server.');
  });
});
require('dotenv').load();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var twit = require('twit');

var Twit = new twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var stream = Twit.stream('statuses/filter', { track: tcot });

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000');
});

io.on('connect', function(client) {
  console.log('Client connected...');

  client.on('join', function(data) {
    console.log(data);
    client.emit('messages', 'Hello from the server.');
  });
});

io.sockets.on("connection", function(socket) {
  console.log ("Client connected");
  
  stream.on



});
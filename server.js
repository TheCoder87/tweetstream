require("dotenv").load();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000');
});

io.on('connection', function(socket) {
  console.log('Client connected...');

  socket.on('join', function(data) {
    console.log("Join: " + data);
    socket.emit('messages', 'A client has joined.');
  });

  var stream = client.stream('statuses/filter', { track: 'tcot' }, function(stream) {
    console.log("Inside stream function");
    stream.on('data', function(tweet) {
      console.log("Tweet: " + tweet.text);
      socket.emit('tweet', tweet.text);
    });

    stream.on('error', function(error) {
      console.log("Error: " + error);
    });
  });
});
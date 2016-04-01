require("dotenv").config();

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');

var port = process.env.PORT || 3000;

var client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
console.log('process.env.API_KEY', process.env.API_KEY);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Make call to client to determine if Twitter auth was successful
 * @TODO: Check to see if there is a specific method to do this
 * @param  {Function} cb Callback function
 */
var checkIfConnected = function(cb) {
  client.get('favorites/list', function(error, tweets, response){
    cb (!error);
  });
};

server.listen(port, function() {
  console.log('Server running at http://localhost:%s', port);
});

io.on('connection', function(socket) {
  console.log('Client connected...');

  socket.on('join', function(data) {
    console.log("Join: " + data);
    socket.emit('messages', 'A client has joined.');

    // Send the status of the client
    checkIfConnected(function(isClientConnected) {
      socket.emit('status', isClientConnected);
    });
  });

  var stream = client.stream('statuses/filter', { track: 'tcot' }, function(stream) {
    console.log("Inside stream function");
    stream.on('data', function(tweet) {
      console.log("Tweet: " + tweet.text);
      socket.emit('tweet', tweet.text);
    });

    stream.on('error', function(error) {
      console.log("Error: " + error);
      socket.emit('error', error);
    });
  });
});

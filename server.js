require("dotenv").config();

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var TweetStream = require('./modules/tweetstream');
var config, stream, tweetstream;

// Get configuration (either from .env or the server's process.env)
config = {};
config.port = process.env.PORT || 3000;
config.API_KEY = process.env.API_KEY;
config.API_SECRET = process.env.API_SECRET;
config.ACCESS_TOKEN = process.env.ACCESS_TOKEN;
config.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
config.STREAM_PATH = process.env.STREAM_PATH;
config.STREAM_PARAMS_TRACK = process.env.STREAM_PARAMS_TRACK;
config.EXTERNAL_CONFIG_URL = process.env.EXTERNAL_CONFIG_URL;
config.LOCAL_CONFIG_REQUEST_PATH = process.env.LOCAL_CONFIG_REQUEST_PATH;

// Setup static hosting
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// Create TweetStream instance and set up listeners
tweetstream = TweetStream(config, server, function(err) {
  // tweetstream.events.on('tweet', function(tweet) {
  //   console.log('Tweet: [%s]: %s', tweet.id, tweet.user.screen_name);
  //   io.emit('tweet', tweet);
  // });
});

server.listen(config.port, function() {
  console.log('TweetStream server running at http://localhost:%s', config.port);
});





//
// // Returns active stream to callback
// // Initilizes a new stream if it doesn't exist
// var getTwitterStream = function(cb) {
//   if (stream) {
//     // Return active Twitter stream if it exists
//     cb(null, stream);
//   } else {
//     // Fetch config info from our JSON endpoint
//     loadStreamConfig(streamJSONUrl, function(err, configJSON) {
//       if (!err) {
//         var streamConfig = configJSON.stream;
//         if (streamConfig) {
//           streamPath = streamConfig.path;
//           streamParams = streamConfig.params;
//
//           // Create stream it and pass it to the callback function
//           tweeter.createStream(streamPath, streamParams, function(err, newStream) {
//             // Save a reference
//             stream = newStream;
//             cb(err, newStream);
//
//             // Globally emit new tweets
//             stream.on('tweet', function(tweet) {
//               console.log('Tweet: [%s]: %s', tweet.id, tweet.user.screen_name);
//               io.emit('tweet', tweet);
//             });
//           });
//         } else {
//           console.log('Error parsing: %s', streamJSONUrl);
//         }
//
//       } else {
//         console.log('Error with config file: %s', streamJSONUrl);
//       }
//     });
//   }
// };

// server.listen(port, function() {
//   console.log('Server running at http://localhost:%s', port);
// });

// io.on('connection', function(socket) {
//   console.log('%%%   Client connected...   %%%');
//   // Get a buffer of any tweets
//   var tweetBuffer = tweeter.getBuffer();
//
//   // Send some configuration information to client
//   socket.emit('config', {
//     'streamPath': streamPath,
//     'streamParams': streamParams,
//     'prime': tweetBuffer
//   });
//
//   // Get a reference to the twitter stream and start broadcasting to
//   // the connected user
//   getTwitterStream(function(err, twitterStream) {
//     // Let client know that connection to Twitter was successful
//     socket.emit('status', 'connected to twitter stream');
//
//     // @TODO: Handle error messages from Twitter connection
//     twitterStream.on('error', function(error) {
//       console.log("Error: ", error);
//     });
//   });
//
// });

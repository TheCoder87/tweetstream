var EventEmitter = require('events');
var util = require('util');
var _ = require('lodash');
var SocketIO = require('socket.io');
var express = require('express');
var io, twitterStream, expressServer, expressApp;


var TweeterLib = require('./tweeter');
var Refresh = require('./refresh');
var request = require('request');

var TweetStream = {};

// Define an EventEmitter
function TSEmitter() {
  EventEmitter.call(this);
}
util.inherits(TSEmitter, EventEmitter);

// Create a new EventEmitter for modules to listen to
TweetStream.events = new TSEmitter();

//
// myEmitter.on('event', () => {
//   console.log('an event occurred!');
// });
// myEmitter.emit('event');


/**
 * Attach an instance of socket.io to the server
 * If no server is defined, spin one up
 * @param  {object}   config Config object with ENV vars for Twitter, etc.
 * @param  {http}   server HTTP Server to attach to
 * @param  {Function} cb     Callback function
 * @return {server, io}          HTTP server and Socket.io instance
 */
var init_socketio = function(config, server, cb) {
  console.log('::: init_socketio');
  if (server) {
    console.log(' -> attach socket.io to existing server');
    // Attach Socket.io to existing
    expressServer = server;
    io = SocketIO(server);
    cb(null, server, io);
  } else {
    // Spin up our own server.
    console.log(' -> attach socket.io to NEW server');
    if (config.port) {
      expressApp = express();
      expressServer = require('http').createServer(expressApp);
      expressServer.listen(config.port, function() {
        console.log('TweetStream server running at http://localhost:%s', config.port);
        // re-run init_socketio but with the newly-spun up server
        init_socketio(config, expressServer, cb);
      });
    } else {
      cb('Need either a port or a server to attach to');
    }
  }
};

var init_defaultListeners = function(io, cb) {
  console.log('::: init_defaultListeners');
  twitterStream.on('tweet', function(tweet) {
    console.log('default: %s [%s]', tweet.user.screen_name, tweet.id_str);
    // broadcast tweet to all connected
    io.emit('tweet', tweet);
    TweetStream.events.emit('tweet', tweet);
  });

  io.on('connection', function() {
    console.log('CONNECTION');
  });

  TweetStream.events.emit('default-listeners');
  cb(null);
};

var init_twitterStream = function(config, cb) {
  console.log('::: init_twitterStream');
  // Check that we have all apiCredentials first
  var requiredKeys = ['API_KEY', 'API_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET'];
  var apiCredentials = _.pick(config, requiredKeys);
  var passedKeys = _.keys(apiCredentials);

  if ( passedKeys.length === requiredKeys.length ) {
    // Initialize the (abstracted) Twitter library
    console.log(' -> create twitter instance');
    TweetStream.tweeter = TweeterLib({
      consumer_key: apiCredentials.API_KEY,
      consumer_secret: apiCredentials.API_SECRET,
      access_token: apiCredentials.ACCESS_TOKEN,
      access_token_secret: apiCredentials.ACCESS_TOKEN_SECRET
    });

    cb(null, TweetStream.tweeter);

  } else {
    var errMsg = 'Twitter app credentials not supplied: ';
    var missingCount = requiredKeys.length - passedKeys.length;
    if (missingCount === 0) missingCount = requiredKeys.length
    errMsg += 'Missing ' + missingCount + ' keys';
    var passed = passedKeys.join(',');
    errMsg += ' [' + passed + ']';

    cb(errMsg);
  }
};


module.exports = function(config, server, cb) {
  console.log('::: init ts instance');
  // Attach Socket.io to server
  init_socketio(config, server, function(err, httpServer, io) {
    if (err) cb(err);
    // Initialize connection to Twitter streaming API
    init_twitterStream(config, function(err, tweeter) {
      // @TODO: Set up Refresh instance
      // TweetStream.refresh = Refresh(config);
      // // Set up route to handle requests to update
      // refresh = Refresh(app);

      if (!err) {
        twitterStream = tweeter.events;

        // Setup some default callbacks
        init_defaultListeners(io, function(err) {
          tweeter.start(config);
          // Finally, make callback
          cb(err, TweetStream.events);
        });
      } else {
        cb(err);
      }
    });
  });
  return TweetStream;
};

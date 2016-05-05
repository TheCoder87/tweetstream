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
  if (server) {
    // Attach Socket.io to existing
    expressServer = server;
    io = SocketIO(server);
    cb(null, server, io);
  } else {
    // Spin up our own server.
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

};

var init_twitterStream = function(config, cb) {
  if (_.has(config, ['API_KEY', 'API_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET']) ) {
    // Initialize the (abstracted) Twitter library
    TweetStream.twitter = TweeterLib({
      consumer_key: config.API_KEY,
      consumer_secret: config.API_SECRET,
      access_token: config.ACCESS_TOKEN,
      access_token_secret: config.ACCESS_TOKEN_SECRET
    });
    cb(null, TweetStream.twitter);

  } else {
    cb('Twitter app credentials not supplied');
  }
};


module.exports = function(config, server, cb) {
  // Attach Socket.io to server
  init_socketio(config, server, function(err, httpServer, io) {
    if (err) cb(err);
    // Initialize connection to Twitter streaming API
    init_twitterStream(config, function(err) {
      // @TODO: Set up Refresh instance
      // TweetStream.refresh = Refresh(config);
      // // Set up route to handle requests to update
      // refresh = Refresh(app);

      // Setup some default callbacks
      init_defaultListeners(io, function(err) {
        // Finally, make callback
        cb(err, TweetStream.events);
      });
    });
  });
  return TweetStream;
};

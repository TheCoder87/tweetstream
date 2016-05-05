/**
 * @file: Just an interface for our Twitter library
 */

var Twit = require('twit');
var _ = require('lodash');
var buffer = require('./tweetBuffer');

var Tweeter = {};
var client, stream, streamOptions;

/**
 * Take flat object and construct a more readable twitter config
 * @param  {object}   opts Flat object like env files
 * @param  {Function} cb   Callback function
 * @return {object}        More friendly object
 */
var createStreamConfigObject = function(opts) {
  var config = {};
  config.path = opts.STREAM_PATH;
  if (opts.STREAM_PARAMS_TRACK) {
    config.params = {};
    // @TODO: Loop through all opts that start with STREAM_PARAMS_ and auto-parse
    var track = opts.STREAM_PARAMS_TRACK.split(',').map(function(param, id) {
      return param.trim();
    });
    if (track.length) {
      config.params.track= track;
    }
  }
  return config;
};

Tweeter.start = function(opts, cb) {
  // Allow signature to pass no cb or cb as first param
  if (opts == null || _.isFunction(opts)) {
    // Assume we just want to resume current stream
    if (_.isFunction(opts)) {
      // Allow passing of callback as first param
      cb = opts;
    }
  }

  if (stream) {
    // @TODO: test if deep equals tests properly
    if (_.eq(opts, streamOptions)) {
      // Same options passed, just restart
      stream.start();
      cb(null);///
    } else {
      // Create a new stream
      streamOptions = createStreamConfigObject(opts);
      stream = client.stream(streamOptions.path, streamOptions.params);
      cb(null, stream);
    }
  } else {
    // Handel errors where no stream is initialized
    if (cb) {
      cb('stream no initialized');
    } else {
      throw 'No stream or callback handler';
    }
  }

};

Tweeter.stop = function(cb) {
  stream.stop();
  cb(null);
};

// Creates a Twitter stream
Tweeter.createStream = function(path, params, cb) {
  // Create stream and pass to callback
  // @TODO: handle cases where stream already exists
  stream = client.stream(path, params);
  // Automatically buffer
  stream.on('tweet', function(tweet) {
    buffer.add(tweet);
  });
  cb(null, stream);
};

// Return any tweets in the buffer
Tweeter.getBuffer = function() {
  var latestTweets = buffer.get();
  return latestTweets;
};

module.exports = function(credentials) {
  // These need to be passed when the module initializes
  // @TODO: Check that these have been passed on init
  var requiredCredentials = [
    'consumer_key',
    'consumer_secret',
    'access_token',
    'access_token_secret'
  ];
  Twitter.client = client = new Twit(credentials);
  return Tweeter;
};

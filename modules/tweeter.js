var Twit = require('twit');
var _ = require('lodash');

var Tweeter = {};
var client, stream;

// Creates a Twitter stream
Tweeter.createStream = function(path, params, cb) {
  // Create stream and pass to callback
  // @TODO: handle cases where stream already exists
  stream = client.stream(path, params);
  cb(null, stream);
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
  client = new Twit(credentials);
  return Tweeter;
};

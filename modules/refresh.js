var _ = require('lodash');

var Refresh = {};
var app;

// Path to listen for requests on
var refreshEndpoint = process.env.REFRESH_PATH || '/refresh-settings';

// REST URL to pull config data from
var refreshURL = process.env.REFRESH_URL || 'http://localhost:3000/api/tweetstream/refresh-config';

// Minimum wait taime
var refreshDelay = process.env.REFRESH_DELAY || 3000;

var fetchUpdatedConfig = function(cb) {
  console.log('fetching config from %s', refreshURL);
  var configObj = {
    fpo: 'need to fetch data'
  };
  cb(null, configObj);
};

// Expose fetchUpdatedConfig in a debounced format
Refresh.fetchUpdatedConfig = _.debounce(fetchUpdatedConfig, refreshDelay);

var setupRoutes = function() {
  // Makes call back to config server to
  app.post(refreshEndpoint, function (req, res) {
    Refresh.fetchUpdatedConfig(function(err, config) {
      // let the server know of success by echoing back config
      if (!err) {
        res.json(config);
      } else {
        res.status(500).json(err);
      }
    });
  });
};

module.exports = function(expressApp) {
  app = expressApp;
  setupRoutes();
  return Refresh;
};

// Include this libarary right after you include socket.io
(function($) {
  var TweetStream = {};
  TweetStream.socket;

  // Initialization function to run on ready
  TweetStream.connect = function(opts, cb) {
    var options = {};
    if (opts.server) {
      options.server = opts.server;
    }

    // Make connection to Socket.io server
    TweetStream.socket = io.connect(options.server);
    // Pass socket back to callback function
    cb(null, TweetStream.socket)
  };

  // Store TweetStream in global namespace
  window.TweetStream = TweetStream;
})(jQuery);

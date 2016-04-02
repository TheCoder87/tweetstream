// Include this libarary right after you include socket.io
window.TweetStream = (function($) {
  var TweetStream = {};
  TweetStream.socket;

  // Initialization function to run on ready
  TweetStream.connect = function(opts, cb) {
    var options = {};
    if (opts.server) {
      options.server = opts.server;
    }

    TweetStream.socket = io.connect(options.server);
    cb(null, TweetStream.socket)
  };
  return TweetStream;
})(jQuery);

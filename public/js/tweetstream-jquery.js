// Demo using TweetStream client and jQuery
(function(TweetStream, $) {
  var init = function() {
    TweetStream.connect({}, function(err, socket) {
      socket.on('connect', function(data) {
        TweetStream.socket.emit('join', 'Hello world from Tweetstream front page.')
      });

      socket.on('status', function(twitterConnectionStatus) {
        console.log('twitterConnectionStatus: ', twitterConnectionStatus);
        if (!twitterConnectionStatus) {
          $('div#tweets').append('<div class="connection-error" style="background: DarkRed; color: #fff; padding: 0.5em 1em;">There was an error with the Twitter credentials.</div>');
        } else {
          $('.connection-error').remove();
        }
      });

      socket.on('tweet', function(tweetObject) {
        console.log('Front end tweetObject: ', tweetObject);
        var text = tweetObject.text;
        $('div#tweets').prepend('<div class="tweet">' + text + '</div>');
      });

      socket.on('messages', function(message) {
        $('div#messages').append(message);
      });

      socket.on('error', function(err) {
        console.warn('Twitter error: ' + err);
      });
    });
  };

  $(function() {
    // Document is ready. Run TweetStream
    init();
  });

})(window.TweetStream, jQuery);

// Demo using TweetStream client and jQuery
(function(TweetStream, $) {
  var base, title, tweets, messages;

  var setupWidget = function(config) {
    console.log('setup with config', config);
    var hashTag = config.streamParams.track;
    $('.tracking', base).remove();
    var trackingDetails = '<small class="tracking"><br />tracking #' + hashTag + '</small>';
    $(trackingDetails).appendTo(title);
  };

  // Add any status messages to the .messages div
  var handleStatusMessage = function(statusMsg) {
    // console.log('status: ', statusMsg);
    if (messages.length) {
      console.log('prepend message:', statusMsg);
      var msg =  '<div class="alert alert-info" role="alert">';
          msg += '<span class="alert-link">';
          msg += '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;';
          msg += statusMsg;
          msg += '</span>';
          msg += '</div>';

      $(msg).prependTo(messages);
    }
  };

  // Template function for formatting tweet object
  var formatTweet = function(tweetObject) {
    console.log('formatting tweet');
    console.log(tweetObject);

    var html = '';
    var text = tweetObject.text;
    var username = tweetObject.user.screen_name;

    html += '<div class="tweet">';
    html += '<b>' + username + ':</b> &nbsp;';
    html += text;
    html += '</div>';

    return html;
  };

  // Append tweet to DOM
  var handleTweet = function(tweetObject) {
    if (tweets.length) {
      var tweet = formatTweet(tweetObject);
      $(tweet).prependTo(tweets);
    }
  };

  var init = function() {
    // Target DOM elements
    base = $('#jquery-demo');
    title = base.find('.title');
    messages = base.find('.messages');
    tweets = base.find('.tweets');

    TweetStream.connect({}, function(err, socket) {
      // Setup socket event listeners
      socket.on('connect', function(data) {});
      socket.on('config', setupWidget);
      socket.on('status', handleStatusMessage);
      socket.on('tweet', handleTweet);

      socket.on('error', function(err) {
        console.warn('Twitter error: ' + err);
      });
    });
  };

  $(function() {
    init();
  });

})(TweetStream, jQuery);

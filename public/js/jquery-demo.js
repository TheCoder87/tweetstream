// Demo using TweetStream client and jQuery
(function(TweetStream, $) {
  var base, title, tweets, messages;

  // Do setup based on configs passed back from Socket.io
  var setupWidget = function(config) {
    console.log('setup with config', config);
    var hashTag = config.streamParams.track;
    $('.tracking', base).remove();
    var trackingDetails = '<small class="tracking"><br />tracking <span class="label label-default">#' + hashTag + '</span></small>';
    $(trackingDetails).appendTo(title);
  };

  // Add any status messages to the .messages div
  var handleStatusMessage = function(statusMsg) {
    if (messages.length) {
      console.log('prepend message:', statusMsg);

      // Create a timeStamp
      var timeStamp = '';
      var date = new Date();
      timeStamp += date.getHours();
      var minutes = date.getMinutes();
      if (minutes < 10) minutes = '0' + minutes;
      var seconds = date.getSeconds();
      if (seconds < 10) seconds = '0' + seconds;
      timeStamp += ':' + minutes;
      timeStamp += ':' + seconds;

      // Craft the message
      var msg =  '<div class="alert alert-info" role="alert">';
          msg += '  <span class="alert-link">';
          msg += '    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;';
          msg += '    <em>' + timeStamp + '</em>&nbsp;';
          msg +=      statusMsg;
          msg += '  </span>';
          msg += '</div>';

      $(msg).prependTo(messages);
    }
  };

  // Template function for formatting tweet object
  var formatTweet = function(tweetObject) {
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
    console.log(tweetObject);
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

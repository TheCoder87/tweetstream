// Demo using TweetStream client and AngularJS
(function(TweetStream, $) {

  var init = function() {
    // Target DOM elements
    base = $('#angularjs-demo');
    title = base.find('.title');
    messages = base.find('.messages');
    tweets = base.find('.tweets');

    // Add FPO content
    $('<code>@TODO: Create AngularJS demo...</code>').prependTo(messages);
  };

  $(function() {
    init();
  });
})(TweetStream, jQuery);

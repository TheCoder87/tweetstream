(function(){
  angular.module('tweetStream', [])
  .controller('tweetStreamCtrl', tweetStreamCtrl)
  .service('tweetStreamSrvc', tweetStreamSrvc);

  tweetStreamCtrl.$inject = ['$scope', tweetStreamSrvc];
  function tweetStreamCtrl($scope, tweetStreamSrvc) {
    var tweets = [];

    $scope.tweets = tweetStreamSrvc.init;
    $scope.$apply();
  }

  function tweetStreamSrvc() {

    var init = function() {
      var tweets;
      var maxTweets = 8;
      var server = 'http://localhost:3000';
      var socket = io.connect(server);
      socket.on('config', function (config) {
        console.log('config', config);
        var trimmedPrime = config.prime.reverse().slice(0, maxTweets);
        tweets = trimmedPrime;
      });
      socket.on('tweet', function (tweet) {
        tweets.unshift(tweet);
        if (tweets.length > maxTweets) {
          tweets.pop();
        }
      });
      return tweets;
    };

    return {
      init: init
    };
  }
})();
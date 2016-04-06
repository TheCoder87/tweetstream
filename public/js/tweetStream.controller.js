(function(){
  angular.module('tweetStream', []);

  angular.module('tweetStream')
  .controller('tweetStreamCtrl', tweetStreamCtrl);

  tweetStreamCtrl.$inject = ['$scope', 'tweetStreamSrvc'];
  function tweetStreamCtrl($scope, tweetStreamSrvc) {
    var tweets = [];

    $scope.tweets = tweetStreamSrvc.init;
    $scope.$apply();
  }
})();
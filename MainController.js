// Code goes here

(function() {

  var app = angular.module("githubViewer");

  var MainController = function(
    $scope, github, $interval,
    $anchorScroll, $location) {

    var onUserComplete = function(data) {
      $scope.user = data;
      github.getRepos($scope.user).then(onRepos, onError);
    };

    var onRepos = function(data) {
      $scope.repos = data;
      $location.hash("userDetails");
      $anchorScroll();
    };

    var onError = function(reason) {
      $scope.error = "Could not fetch the data."
    };
    

    var decrementCountDown = function() {
      $scope.countdown -= 1;
      if ($scope.countdown < 1) {
        $scope.search($scope.username);
      }
    };

    var countdownInterval = null;
    var startCountDown = function() {
      countdownInterval = $interval(decrementCountDown, 1000, $scope.countdown);
    };

    $scope.search = function(username) {
      github.getUser(username).then(onUserComplete, onError);
      if (countdownInterval) {
        $interval.cancel(countdownInterval);
        $scope.countdown = null;
      }
    };

    $scope.message = "GitHub Viewer";
    $scope.username = "angular";
    $scope.repoSortOrder = "-stargazers_count";
    $scope.countdown = 5;
    startCountDown();

  };

  app.controller("MainController", MainController);


}());
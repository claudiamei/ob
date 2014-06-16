angular.module('amelia-ui.clock', [
  'amelia-ui.services'
])
  .controller('obClockController', function($scope, obTimeService) {

    var updateTime = function() {
      $scope.currentTime = obTimeService.currentTime();
    };
    obTimeService.registerObserverCallback(updateTime);

  })
  .directive('obClock', function() {
    return {
      restrict: 'AE',
      controller: 'obClockController',
      scope: {
        format: '='
      },
      template: '{{currentTime | date:format}}'
    };
  });

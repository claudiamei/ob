angular.module('amelia.docs.controllers').controller('obSparklineControllerDemo', function($scope, $interval) {

  $scope.data = [
    {
      value: 4,
      date: '4/5/2014',
    },
    {
      value: 5,
      date: '4/6/2014',
    },
    {
      value: 7,
      date: '4/7/2014',
    },
    {
      value: 7,
      date: '4/8/2014',
    },
    {
      value: 7,
      date: '4/9/2014',
    }
  ];
  $interval(function() {
    $scope.data = $scope.data;
  });

});

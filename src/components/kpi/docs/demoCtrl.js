angular.module('amelia.docs.controllers').controller('kpiEditorialContentController', function($scope) {
  $scope.data = {
    contentPerHour: {
      today: 651234,
      lastWeek: 34535,
      lastMonth: 45543,
    }
  };
});

angular.module('amelia.docs.controllers').controller('kpiEditorialContentDemoController', function($scope) {
  $scope.data = {
    contentPerHour: {
      today: 651234,
      lastWeek: 34535,
      lastMonth: 45543,
    }
  };
});

angular.module('amelia.docs.controllers').controller('kpiEditorialRecommendDemoController', function($scope, $interval) {

  $scope.data = {
    totalRecommendationsValue: {
      value: 600,
      label: 'Incremental Content Views /hr',
    },
    recommendationsCount: 33,
    executedRecommendationsCount: 23,
    currentValue: 2400,
    maxValue: 3200,
  };

  $interval(function() {
    $scope.data.totalRecommendationsValue.value += ~~(Math.random()*50) - 25;
    $scope.data.currentValue += ~~(Math.random()*50) - 25;

    var currentVal = $scope.data.currentValue + ~~(Math.random()*50) - 25;
    var recomVal = $scope.data.totalRecommendationsValue.value + ~~(Math.random()*50) - 25;

    $scope.data.currentValue = Math.abs(currentVal);
    $scope.data.totalRecommendationsValue.value = Math.abs(recomVal);

    $scope.data.maxValue = $scope.data.totalRecommendationsValue.value + $scope.data.currentValue;
  }, 10000);

});

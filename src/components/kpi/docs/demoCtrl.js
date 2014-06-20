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

  var recommendKpiData = {
    recommendationsValue: 3000,
    currentValue: 15000,
    expectedValue: 13000,
    topExpectedValueToday: 12000,
  };

  var recommendedTotal = recommendKpiData.recommendationsValue + recommendKpiData.currentValue,
    maxValue;

  if (recommendKpiData.topExpectedValueToday * 3 >= recommendedTotal) {
    maxValue = recommendKpiData.topExpectedValueToday * 3;
  } else {
    maxValue = recommendedTotal;
  }

  $scope.data = {
    recommendValue: {
      value: 12342,
      label: 'Incremental Content Views /hr',
      //prefix: '$',
    },
    recommendations: 2400,
    executedRecommendations: 23,
  };

  $interval(function() {
    $scope.data.recommendValue.value += 14467;
  }, 10000);

});

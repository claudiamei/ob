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
      value: 12342,
      label: 'Incremental Content Views /hr',
      //prefix: '$',
    },
    recommendationsCount: 33,
    executedRecommendationsCount: 23,
  };

  $interval(function() {
    $scope.data.totalRecommendationsValue.value += 14467;
    $scope.data.totalRecommendationsValue.value %= 1000000000;
  }, 10000);

});

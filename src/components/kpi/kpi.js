
angular.module('amelia-ui.kpi-boxes', ['amelia-ui.utils', 'ui.bootstrap.tooltip'])
.filter('obNumber', function($filter) {
    var numberFilter = $filter('number');
    return function(number, decimalPlaces) {
      var toRound = Math.round(number) !== Number(number);
      if (!decimalPlaces && decimalPlaces !== 0){
        decimalPlaces = 2;
      }
      return numberFilter(number, toRound ? decimalPlaces: 0);
    };
})
.filter('kpiNumberTooltip', function($filter) {
  return function(number, decimalPlaces, maxDigits) {
    maxDigits = maxDigits || 3;
    var digits = Math.abs(Math.round(number)).toString().length;
    if (digits > maxDigits) {
      return $filter('obNumber')(number, decimalPlaces);
    }
  };
})
.filter('kpiNumberRevenue', function($filter) {
    var numberFilter = $filter('kpiNumber');
    return function(number) {
      var digits = Math.abs(Math.round(number)).toString().length;
      var decimalPoints = 2;
      if (digits > 4){
        decimalPoints = 0;
      }
      return numberFilter(number, decimalPoints, 4);
    };
})
.filter('kpiNumber', function($filter) {
    // suffixes for thousand, million, billion, etc.
    var suffixes = ['', 'k', 'm', 'b', 't'];
    return function(number, decimalPlaces, maxDigits, skipRounding) {
      maxDigits = maxDigits || 3;
      var digits = Math.abs(Math.round(number)).toString().length;
      var multiple = 0;
      if (digits > maxDigits) {
        if (!decimalPlaces && decimalPlaces !== 0){
          decimalPlaces = 2;
        }
        multiple = Math.floor((digits-1)/3);
        number = number/Math.pow(1000, multiple);
      }
      else if(skipRounding) {
        decimalPlaces = 0;
      }

      return $filter('obNumber')(number, decimalPlaces) + suffixes[multiple];
    };
})
.directive( 'kpioverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: '../src/components/kpi/templates/popover.html'
  };
})
.directive( 'kpiover', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'kpiover', 'popover', 'click' );
}])
.directive('obKpiBoxEngageDashboard', function () {
	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/engage-dashboard.html',
		replace: true,
		transclude: true,
		scope: {
			boxes : '=',
			currency: '@'
		},
    controller: ['$scope', function($scope){
      if ($scope.boxes.ctr && $scope.boxes.ctr.value) {
        $scope.boxes.ctr.value = Math.round(Number($scope.boxes.ctr.value)*10000)/100;
      }
    }]
	};
})
.directive('obKpiBoxAmplifyDashboard', function () {

	var link = function ($scope) {
		var kpiBoxes = $scope.boxes;

		$scope.setKpiView = function (view) {
			view = view || 'mtd';
			$scope.view = view;
			$scope.boxView = kpiBoxes[view];
		};
		$scope.setKpiView();
	};

	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/amplify-dashboard.html',
		replace: true,
		transclude: true,
		link: link,
		scope: {
			boxes : '=',
			currency: '@'
		}
	};
})
.directive('obKpiBoxEditorialRecommend', function () {
	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/editorial-recommend.html',
		replace: true,
		transclude: true,
		scope: {
			boxes : '=',
			currency: '@'
		}
	};
})
.directive('obKpiBoxEditorialContent', function () {
	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/editorial-content.html',
		replace: true,
		transclude: true,
		scope: {
			boxes : '=',
			currency: '@'
		}
	};
})
.directive('obKpiBoxEditorialFrontpage', function () {
	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/editorial-frontpage.html',
		replace: true,
		transclude: true,
		scope: {
			boxes : '=',
			currency: '@'
		}
	};
})
.directive('obKpiBoxEditorialSocial', function () {
	return {
		restrict: 'AE',
		templateUrl: '../src/components/kpi/templates/editorial-social.html',
		replace: true,
		transclude: true,
		scope: {
			boxes : '=',
			currency: '@'
		}
	};
});
angular.module('amelia.docs.components', ['amelia-ui'])
.controller('ComponentController', function ($scope, $routeParams) {
	// var set_demo = function (component) {
	// 	if (component) {
	// 		$scope.component_demo_url = '../src/' + component + '/docs/demo.html';
	// 	}
	// }
	// set_demo($routeParams.component);
	if ($routeParams.component) {
		$scope.scrollTo($routeParams.component);
	}
})
.directive('obDemoList', function () {
	return {
		scope: {},
		link: function ($scope, element, attrs) {
			$scope.demoList = attrs.demoList.replace(/ /g, '').split(',');
		},
		templateUrl: 'pages/components/demo_list.html'
	};
})
.directive('demoDescription', ['$http', function ($http) {
	return {
		restrict: 'A',
		scope: {
			'demoDescription': '='
		},
		replace: true,
		link: function ($scope) {
			// $scope.demoList = attrs.demoList.replace(/ /g, '').split(',');
			$http.get($scope.demoDescription).success(function (response) {
				angular.extend($scope, response);
			});
		},
		template: '<p>{{description}}</p>',
	};
}]);
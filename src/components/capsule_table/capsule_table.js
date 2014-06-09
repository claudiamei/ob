angular.module('amelia-ui.charts.capsule-table', [])

.constant('obCapsuleTableConfig', {
	animate: true,
	max: 100
})

.controller('obCapsuleTableController', ['$scope', '$attrs', 'obCapsuleTableConfig', function($scope, $attrs, obCapsuleTableConfig) {
		var self = this,
			animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : obCapsuleTableConfig.animate;

		$scope.capsule = {};
		$scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : obCapsuleTableConfig.max;

		this.add = function(type, capsule, element) {
			if ( !animate ) {
				element.css({'transition': 'none'});
			}

			$scope[type][capsule.name] = capsule;

			capsule.$watch('barValue', function( value ) {
				capsule.percent = +(100 * value / $scope.max).toFixed(2);
			});

			capsule.$on('$destroy', function() {
				element = null;
				self.remove(type, capsule.name);
			});
		};

		this.remove = function(type, name) {
			delete $scope[type][name];
		};

		$scope.setProperty =  function (type, name, property, value) {
			$scope[type][name][property] = value;
			$scope.$digest();
		};
}])

.directive('obCapsuleTable', function() {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		controller: 'obCapsuleTableController',
		templateUrl: '../src/components/capsule_table/capsule_table.html'
	};
})

.directive('obCapsule', function() {
	return {
		restrict: 'EA',
		replace: true,
		require: '^obCapsuleTable',
		scope: {
			value: '@',
			barValue: '@',
			class: '@',
			name: '@',
		},
		templateUrl: '../src/components/capsule_table/capsule.html',
		link: function(scope, element, attrs, obCapsuleTableController) {
			obCapsuleTableController.add('capsule', scope, element);
		}
	};
})
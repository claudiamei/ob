angular.module('amelia-ui.charts.bullet-graph', [])

.constant('obBulletGraphConfig', {
  animate: true,
  max: 100
})

.controller('obBulletGraphController', ['$scope', '$attrs', 'obBulletGraphConfig',
  function($scope, $attrs, obBulletGraphConfig) {
    var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : obBulletGraphConfig.animate;

    $scope.bar = {};
    $scope.benchmark = {};
    $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : obBulletGraphConfig.max;
    
    this.add = function(type, bar, element) {
      if (!animate) {
        element.css({
          'transition': 'none'
        });
      }

      $scope[type][bar.name] = bar;

      bar.$watch('value', function(value) {
        bar.percent = +(100 * value / $scope.max).toFixed(2);
      });

      bar.$on('$destroy', function() {
        element = null;
        self.remove(type, bar.name);
      });
    };

    this.remove = function(type, name) {
      delete $scope[type][name];
    };

    $scope.setProperty = function(type, name, property, value) {
      $scope[type][name][property] = value;
      $scope.$digest();
    };
  }
])

.directive('obBulletGraph', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'obBulletGraphController',
    templateUrl: '../src/components/bullet_graph/bullet_graph.html',
    scope: {
      max: '='
    }
  };
})

.directive('obBulletBar', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^obBulletGraph',
    scope: {
      value: '=',
      class: '@',
      name: '@'
    },
    templateUrl: '../src/components/bullet_graph/bullet_graph_bar.html',
    link: function(scope, element, attrs, obBulletGraphController) {
      obBulletGraphController.add('bar', scope, element);
    }
  };
})

.directive('obBulletBenchmark', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^obBulletGraph',
    scope: {
      value: '@',
      name: '@'
    },
    templateUrl: '../src/components/bullet_graph/bullet_graph_benchmark.html',
    link: function(scope, element, attrs, obBulletGraphController) {

      obBulletGraphController.add('benchmark', scope, element);
    }
  };
});

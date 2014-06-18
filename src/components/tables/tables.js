angular.module('compile', [], function($compileProvider) {
  // configure new 'compile' directive by passing a directive
  // factory function. The factory function injects the '$compile'
  $compileProvider.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  })
});

angular.module('amelia-ui.table', ['amelia-ui.utils.debounce'])
  .controller('obTableController', ['$scope', '$element', '$attrs',
    function($scope, $element, $attrs) {

      $scope.updateHighlight = angular.noop;
      $scope.updateActiveSort = angular.noop;

      $scope.applySort = function(sortBy) {
        console.log(sortBy)
        $scope.updateActiveSort(sortBy);
        $scope.updateHighlight(sortBy);
      };

      $scope.sortBy = function(sortBy, defaultSort) {
        if (defaultSort === 'desc') {
          $scope.predicate = ($scope.predicate !== '-' + sortBy) ? '-' + sortBy : sortBy;
        } else {
          $scope.predicate = ($scope.predicate !== sortBy) ? sortBy : '-' + sortBy;
        }
        $scope.updateHighlight(sortBy);
      };

      // $scope.toggleExpandedRow = function (datum) {
      //   console.log(datum);
      //   datum.expanded = !!datum.expanded;
      // };
      // 

      $scope.updateHighlight = function(sortBy) {
        var active = $($element).find('[data-metric="' + sortBy + '"]');
        if (active.length > 0) {
          var highlight = $($element).find('.highlight');
          offset = active.position();
          highlight.css('margin-left', active.position().left + parseInt(active.parents('.thead').css('padding-left'), 10))
            .css('width', active.width());
        }
      };


    }
  ])
  .directive('obTable', ['$window', 'debounce', '$filter',
    function($window, debounce, $filter) {
      return {
        restrict: 'AE',
        replace: true,
        controller: 'obTableController',
        templateUrl: '../src/components/tables/tables.html',
        scope: {
          schema: '=',
          data: '=',
          predicate: '@',
          showTotals: '=',
          expandable: '@',
          expandedTemplate: '='
        },
        link: function(scope, element, attr) {

          scope.totals = {};

          angular.forEach(scope.schema, function(metric) {
            var min = Infinity,
              max = -Infinity,
              total = 0,
              value;

            angular.forEach(scope.data, function(datum) {
              value = (metric.accessor) ? metric.accessor(datum) : datum[metric.key];
              total += value;
              if (value < min) {
                min = value
              }
              if (value > max) {
                max = value
              }
            });

            if (metric.totalLogic === 'average') {
              scope.totals[metric.key] = 'AVG ' + metric.display(total / scope.data.length);
            } else if (metric.totalLogic === 'range') {
              if (min !== max) {
                scope.totals[metric.key] = metric.display(min) + ' - ' + metric.display(max);
              } else {
                scope.totals[metric.key] = metric.display(min);
              }
            } else if (metric.totalLogic === 'sum') {
              scope.totals[metric.key] = metric.display(total);
            } else {
              scope.totals[metric.key] = "&#8212";
            }

          });

          // scope.updateHighlight(scope.predicate);
          var timeout = setInterval(function() {
            if ($(element).find('.sorted').length > 0) {
              scope.updateHighlight(scope.predicate.replace('-', ''));
              clearTimeout(timeout);
            }
          }, 500);

          scope.$watch(function() {
            return element.width()
          }, function() {
            if (scope.predicate) scope.updateHighlight(scope.predicate.replace('-', ''));
          });
        }
      };
    }
  ])
  .directive('ob-table-tr', function() {

  })
  .directive('repeatDone', function() {
    return function(scope, element, attrs) {
      if (scope.$last) { // all are rendered
        scope.$eval(attrs.repeatDone);
      }
    }
  });

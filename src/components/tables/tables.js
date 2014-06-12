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
        $scope.updateHighlight(true);
      };

      $scope.sortBy = function (sortBy) {
        $scope.predicate = ($scope.predicate !== sortBy) ? sortBy : sortBy.replace('-', '');
      };

      // $scope.toggleExpandedRow = function (datum) {
      //   console.log(datum);
      //   datum.expanded = !!datum.expanded;
      // };
      // 
      $scope.hello = function (datum) {
        datum.expanded = !!datum.expanded;
    alert(datum)
  };

      // $scope.updateHighlight = function () {
      // 	var active = $($element).find('.active-sort');
      // 	var highlight = $($element).find('.highlight');
      // 	offset = active.position();
      // 	highlight.css('margin-left', active.position().left + parseInt(active.parents('.thead').css('padding-left'), 10))
      // 		.css('width', active.width() - 1);
      // };
    }
  ])
  .directive('obTable', ['$window', 'debounce', '$filter', function($window, debounce, $filter) {
    return {
      restrict: 'AE',
      replace: true,
      controller: 'obTableController',
      templateUrl: '../src/components/tables/tables.html',
      // scope: {
      //   schema: '=',
      //   data: '=',
      //   predicate: '='
      // },
      link: function(scope, element, attr) {

        scope.totals = {};

        angular.forEach(scope.schema, function (metric) {
          var min = Infinity,
              max = -Infinity,
              total = 0,
              value;

          angular.forEach(scope.data, function (datum) {
            value = (metric.accessor) ? metric.accessor(datum) : datum[metric.key];
            total += value;
            if (value < min) { min = value }
            if (value > max) { max = value }
          });

          if (metric.totalLogic === 'average') {
            scope.totals[metric.key] = 'AVG ' + metric.display(total / scope.data.length);
          } else if (metric.totalLogic === 'range') {
            if (min !== max) { 
              scope.totals[metric.key] = metric.display(min) + ' - ' + metric.display(max);
            } else {
              scope.totals[metric.key] = metric.display(min);
            }
          } else {
            scope.totals[metric.key] = metric.display(total);
          }
        });







        // scope.updateHighlight = function(anim) {
        //   var active = $(element).find('.active-sort');
        //   var highlight = $(element).find('.highlight');
        //   offset = active.position();
        //   if (anim) {
        //   	highlight.addClass('anim');
        //   }
        //   highlight.css('margin-left', active.position().left + parseInt(active.parents('.thead').css('padding-left'), 10))
        //     .css('width', active.width() - 1);
        //   setTimeout(function () {
        //   	highlight.removeClass('anim');
        //   }, 1000);
        // };

        // scope.updateActiveSort = function(sortBy) {
        //   $(element).find('.active-sort').removeClass('active-sort');
        //   $(element).find('[data-sortable="' + sortBy + '"]').addClass('active-sort');
        // };

        // scope.updateHighlight();

        // var lookupDebounced = debounce(scope.updateHighlight, 10, false);
        // var win = angular.element($window);
        // win.bind('resize', function() {
        //   // console.log('resize event')
        //   lookupDebounced();
        // });

      }
      // scope: {},
      // template: '{{currentTime | date:format}}'
    };
  }]);

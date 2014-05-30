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

      // $scope.updateHighlight = function () {
      // 	var active = $($element).find('.active-sort');
      // 	var highlight = $($element).find('.highlight');
      // 	offset = active.position();
      // 	highlight.css('margin-left', active.position().left + parseInt(active.parents('.thead').css('padding-left'), 10))
      // 		.css('width', active.width() - 1);
      // };
    }
  ])
  .directive('obTable', ['$window', 'debounce', function($window, debounce) {
    return {
      restrict: 'AE',
      controller: 'obTableController',
      link: function(scope, element, attr) {

        scope.updateHighlight = function(anim) {
          var active = $(element).find('.active-sort');
          var highlight = $(element).find('.highlight');
          offset = active.position();
          if (anim) {
          	highlight.addClass('anim');
          }
          highlight.css('margin-left', active.position().left + parseInt(active.parents('.thead').css('padding-left'), 10))
            .css('width', active.width() - 1);
          setTimeout(function () {
          	highlight.removeClass('anim');
          }, 1000);
        };

        scope.updateActiveSort = function(sortBy) {
          $(element).find('.active-sort').removeClass('active-sort');
          $(element).find('[data-sortable="' + sortBy + '"]').addClass('active-sort');
        };

        scope.updateHighlight();

        var lookupDebounced = debounce(scope.updateHighlight, 10, false);
        var win = angular.element($window);
        win.bind('resize', function() {
          // console.log('resize event')
          lookupDebounced();
        });

      }
      // scope: {},
      // template: '{{currentTime | date:format}}'
    };
  }]);

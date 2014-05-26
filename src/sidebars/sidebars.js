var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length - 1].src;

// console.log(currentScriptPath);

angular.module('amelia-ui.page', ['amelia-ui.clock', 'amelia-ui.utils.debounce'])
  .directive('obWrapper', ['$window', 'debounce',
    function($window, debounce) {

      return {
        restrict: 'AE',
        link: function($scope, element) {

          var manualOverride = false;
          var win = angular.element($window);

          var toggleSidebarOnScreenSize = function() {
            if (win.innerWidth() > 964) {
              element.addClass('expandLeft');
            } else {
              element.removeClass('expandLeft');
            }
          };

          $scope.toggleSidebar = function(sidebarName, isManual) {
            if (manualOverride && !isManual) {
              return;
            }
            if (isManual) {
              manualOverride = true;
            }
            if (!manualOverride && !isManual) {
              toggleSidebarOnScreenSize();
              return;
            }
            element.toggleClass('expand' + sidebarName);
          };

          var lookupDebounced = debounce($scope.toggleSidebar, 1000, false);
          win.bind('resize', function() {
            // console.log('resize event')
            lookupDebounced('Left', false);
          });

          $scope.toggleSidebar('Left', false);
        }
      };
    }
  ])
  .directive('obSidebarNavigation', function() {

    return {
      restrict: 'AE',
      templateUrl: currentScriptPath.replace('sidebars.js', 'navigation.html'),
      replace: true,
      transclude: true
    };
  });

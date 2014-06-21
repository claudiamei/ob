/*
  Based off of the bootstrap-ui dropdown, but with more functionality.
 */

angular.module('amelia-ui.dropdown', [])
  .constant('obDropdownConfig', {
    menuPosition: {
      horizontal: 'auto', // ['auto', 'left', 'right']
      vertical: 'auto' // ['auto', 'left', 'right']
    },
    toggleEvent: {
      open: 'mouseenter click',
      close: 'mouseleave click'
    }
  })
  .controller('obDropdownController', ['$scope', '$attrs', 'obDropdownConfig',
    function($scope, $attrs, obDropdownConfig) {
      $scope.hPos = angular.isDefined($attrs.hPos) ? $attrs.hPos : obDropdownConfig.menuPosition.horizontal;
      $scope.vPos = angular.isDefined($attrs.vPos) ? $attrs.vPos : obDropdownConfig.menuPosition.vertical;
      $scope.call = function(func) {
        if ($scope[func]) {
          $scope[func]();
        } else if ($scope.$parent.logout) {
          $scope.$parent[func]()
        }
      };
    }
  ])
  .directive('obDropdown', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        items: '=',
        title: '=',
        hover: '='
      },
      controller: 'obDropdownController',
      templateUrl: '../src/components/dropdown/dropdown.html',
    };
  })
  .directive('obDropdownToggle', ['$document',
    function($document) {
      var openElement = null,
        closeMenu = angular.noop;
      return {
        restrict: 'CA',
        scope: {
          hover: '='
        },
        link: function(scope, element, attrs) {

          scope.openEvent = (!!scope.hover) ? 'mouseenter click' : 'click';
          scope.closeEvent = (!!scope.hover) ? 'mouseleave click' : 'click';

          scope.$watch('$location.path', function() {
            closeMenu();
          });
          element.parent().bind(scope.closeEvent, function() {
            closeMenu();
          });
          element.bind(scope.openEvent, function(event) {

            var elementWasOpen = (element === openElement);

            event.preventDefault();
            event.stopPropagation();

            if (!!openElement) {
              closeMenu();
            }

            if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
              element.parent().addClass('open');
              openElement = element;
              closeMenu = function(event) {
                if (event) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                $document.unbind('click', closeMenu);
                element.parent().removeClass('open');
                closeMenu = angular.noop;
                openElement = null;
              };
              $document.bind('click', closeMenu);
            }
          });
        }
      };
    }
  ]);

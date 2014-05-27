/*
  Based off of the bootstrap-ui dropdown, but with more functionality.
 */

angular.module('amelia-ui.dropdown', [])
.constant('obDropdownConfig', {
  menuPosition: {
    horizontal: 'auto',   // ['auto', 'left', 'right']
    vertical: 'auto'      // ['auto', 'left', 'right']
  },
  toggleEvent: {
    open: 'mouseenter click',
    close: 'mouseleave click'
  }
})
.controller('obDropdownController', ['$scope', '$attrs', 'obDropdownConfig', function ($scope, $attrs, obDropdownConfig) {
  $scope.hPos = angular.isDefined($attrs.hPos) ? $attrs.hPos : obDropdownConfig.menuPosition.horizontal;
  $scope.vPos = angular.isDefined($attrs.vPos) ? $attrs.vPos : obDropdownConfig.menuPosition.vertical;
}])
.directive('obDropdown', function () {
  return {
    restrict: 'AE',
    replace: true,
    // scope: {
    //   items: '='
    // },
    //   hPos: '@?',  // for menu placement relative to toggle
    //   vPos: '@?',  // for menu placement relative to toggle
    // },
    controller: 'obDropdownController',
    templateUrl: '../src/components/dropdown/dropdown.html',

  };
})
// .controller('obDropdownToggleController', ['$scope', '$attrs', 'obDropdownConfig', function ($scope, $attrs, obDropdownConfig) {
//   $scope.openEvent = angular.isDefined($attrs.hover) ? $attrs.openEvent : obDropdownConfig.toggleEvent.open;
//   $scope.closeEvent = angular.isDefined($attrs.hover) ? $attrs.closeEvent : obDropdownConfig.toggleEvent.close;
// }])
.directive('obDropdownToggle', ['$document', function ($document) {
  var openElement = null,
      closeMenu   = angular.noop;
  return {
    restrict: 'CA',
    // scope: {
    //   'openEvent': '=?',
    //   'closeEvent': '=?'
    // },
    // controller: 'obDropdownToggleController',
    link: function(scope, element, attrs) {

      scope.openEvent = (attrs.hasOwnProperty('hover')) ? 'mouseenter click' : 'click';
      scope.closeEvent = (attrs.hasOwnProperty('hover')) ? 'mouseleave click' : 'click';

      scope.$watch('$location.path', function() { closeMenu(); });
      element.parent().bind(scope.closeEvent, function() { closeMenu(); });
      element.bind(scope.openEvent, function (event) {

        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          element.parent().addClass('open');
          openElement = element;
          closeMenu = function (event) {
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
}]);
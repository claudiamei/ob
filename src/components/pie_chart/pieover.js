angular.module( 'pieover', [ 'ui.bootstrap.tooltip' ] )

.directive( 'pieoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: '../src/components/pie_chart/pieover.html'
  };
})

.directive( 'pieover', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'pieover', 'popover', 'click' );
}]);
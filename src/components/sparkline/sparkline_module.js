angular.module('amelia-ui.charts.sparkline', ['d3'])

.service('OBSparklineConfig', function() {
  return function(options, Sparkline) {
    for (var attr in options) {
      if(options.hasOwnProperty(attr)){
        Sparkline[attr](options[attr]);
      }
    }
    return options;
  };
})

.directive('obSparkline', [
  '$parse', '$window', 'd3Service', 'OBSparklineConfig', 'debounce',
  function($parse, $window, $compile, OBSparklineConfig, debounce) {
    return {
      restrict: 'EA',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {

        console.log("Linked SPARKLINE")
        var data,
          create = true,
          sparkline = window.OBSparkline(element[0]);

        var config = new OBSparklineConfig($parse(attrs.obSparklineOptions)(scope), sparkline);

        function setWidth(){
          if(!config.width){
            sparkline.width(element.width());
          }
        }

        setWidth();

        scope.$watch('data', function(newData) {
          data = angular.copy(newData);
          if (create) {
            sparkline.render(data);
            create = false;
          } else {
            sparkline.update(data);
          }
        }, true);

        scope.$watch(function () {
          return {
            w: element.width(),
          };
        }, function (newValue, oldValue) {
          if (newValue.w !== oldValue.w) {
            setWidth();
            resizeDebounced();
          }
        }, true);

        var resizeDebounced = debounce(function() {
          sparkline.resize();
          sparkline.update(data, true);
        }, 1000, false);
      }
    };
  }
]);

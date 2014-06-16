angular.module('amelia-ui.charts.timeline-graph', ['d3'])

.service('OBTimelineGraphConfig', function() {
  return function(options, timelineGraph) {
    for (var attr in options) {
      if(options.hasOwnProperty(attr)){
        timelineGraph[attr](options[attr]);
      }
    }
    return options;
  };
})

.directive('obTimelineGraph', [
  '$parse', '$window', 'd3Service', 'OBTimelineGraphConfig', 'debounce',
  function($parse, $window, $compile, OBTimelineGraphConfig, debounce) {
    return {
      restrict: 'EA',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        var data,
          create = true,
          timelineGraph = window.OBTimelineGraph(element[0]);

        var config = new OBTimelineGraphConfig($parse(attrs.obTimelineGraphOptions)(scope), timelineGraph);

        function setWidth(){
          if(!config.width){
            timelineGraph.width(element.width());
          }
        }

        setWidth();

        scope.$watch('data', function(newData) {
          data = angular.copy(newData);
          if (create) {
            timelineGraph.render(data);
            create = false;
          } else {
            timelineGraph.update(data);
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
          }, true
        );

        var resizeDebounced = debounce(function() {
          timelineGraph.resize();
          timelineGraph.update(data, true);
        }, 1000, false);
      }
    };
  }
]);

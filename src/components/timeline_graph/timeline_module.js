angular.module('amelia-ui.charts.timeline-graph', ['d3'])
.service('OBTimelineGraphConfig', function(){
	return function(options, timelineGraph) {
		for(var attr in options){
			timelineGraph[attr](options[attr]);
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
			var data, timelineGraph, create = true;

			timelineGraph = ObTimeline(element[0])
				.width(500)
				.height(194);
			var config = new OBTimelineGraphConfig($parse(attrs.obTimelineGraphOptions)(scope), timelineGraph);

			scope.$watch('data', function(newData) {
				data = angular.copy(newData);
				if(create){
					timelineGraph.render(data);
					create = false;
				}else{
					timelineGraph.update(data);
				}
			}, true);
		}
	};
}]);

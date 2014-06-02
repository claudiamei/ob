angular.module('amelia-ui.charts.area-graph', ['d3'])

.service('OBAreaGraphConfig', function(){
	var extendDeep = function extendDeep(dst) {
		angular.forEach(arguments, function(obj) {
			if (obj !== dst) {
				angular.forEach(obj, function(value, key) {
					if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
						extendDeep(dst[key], value);
					} else {
						dst[key] = value;
					}
				});
			}
		});
		return dst;
	};

	return function(options) {
		var d3 = window.d3;
		var defaults = {
			margin: {
				top : 30,
				right : 20,
				bottom : 30,
				left : 50
			},
			width: function(element){return element.width();},
			height: 250,
			lineColors: ['#FF5F00', '#3DD3E1'],
			areaColors: ['#FCECE2', '#C8F0F4'],
			parseDate: function(d){return d3.time.format("%m/%d/%Y").parse(d.date);},
			hoverDateFormat: d3.time.format('%-m/%-d/%Y'),
			interpolation: 'monotone',
			//formatValue: d3.format('d'),
			yAxisLabel: '',
			yAxisFormat: d3.format('s'),
			xAxisFormat: d3.time.format.multi([
				[".%L", function(d) { return d.getMilliseconds(); }],
				[":%S", function(d) { return d.getSeconds(); }],
				["%I:%M", function(d) { return d.getMinutes(); }],
				["%I %p", function(d) { return d.getHours(); }],
				//["%a %d", function(d) { return d.getDay() && d.getDate() !== 1; }],
				["%-m/%-d", function(d) { return d.getDate() !== 1; }],
				["%B", function(d) { return d.getMonth(); }],
				["%Y", function() { return true; }]
			]),
		};
		extendDeep(this, defaults);
		extendDeep(this, options);
	};
})

.directive('obAreaGraph', ['$parse', '$window', 'd3Service', 'OBAreaGraphConfig', 'debounce', function($parse, $window, $compile, OBAreaGraphConfig, debounce) {
	return {
		restrict: 'EA',
		scope: {
			data: '='
		},
		templateUrl: '../src/components/area_graph/area-legend.html',
		link: function(scope, element, attrs) {
			var create = true;
			var data;
			scope.$watch('data', function(newData) {
				data = angular.copy(newData);
				if(create){
					scope.create(data || []);
					create = false;
				}else{
					scope.update(data || []);
				}
			}, true);
			
			var resizeDebounced = debounce(function() {
				scope.resize();
				scope.update(data, true);
			}, 1000, false);

			angular.element($window).on('resize', function () {
				resizeDebounced();
			});

			/* d3 Configuration*/
			var d3 = window.d3,
				config = new OBAreaGraphConfig($parse(attrs.obAreaGraphOptions)(scope)),
				margin = config.margin,
				width = (typeof(config.width) === "function") ?
					config.width(element) - margin.left - margin.right:
					width - margin.left - margin.right,
				height = config.height - margin.top - margin.bottom,
				lineColor = d3.scale.ordinal().range(config.lineColors),
				areaColor = d3.scale.ordinal().range(config.areaColors),
				parseDate = config.parseDate,
				//formatValue = config.formatValue,
				hoverDateFormat = config.hoverDateFormat,
				xAxisFormat = config.xAxisFormat,
				yAxisFormat = config.yAxisFormat,
				yAxisLabel = config.yAxisLabel,
				interpolation = config.interpolation,
				bisectDate = d3.bisector(function(d) { return d.date; }).right,
				legendMargin = {top: margin.top + 20, left: margin.left + 40};

			// Temporary scale until colors are final
			lineColor = d3.scale.category10();
			areaColor =  d3.scale.category10();

			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);

			d3.formatPrefix(1.21e9).symbol = "B"; //Overrides D3 SI prefix G to B

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickSize(0)
				.ticks(8)
				.tickFormat(xAxisFormat)
				.tickPadding(12);

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickSize(0)
				.ticks(4)
				.tickFormat(yAxisFormat)
				.tickPadding(12);

			var svg = d3.select(element[0]).append('svg')
				.attr('class', 'area-graph')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var area = d3.svg.area()
				.interpolate(interpolation)
				.x(function(d){return x(d.date);})
				.y0(height)
				.y1(function(d){return y(d.value);});

			var line = d3.svg.line()
				.interpolate(interpolation)
				.x(function(d){return x(d.date);})
				.y(function(d){return y(d.value);});

			var voronoi = d3.geom.voronoi()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.value); })
				.clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
			
			var hoverLegend = d3.select(element[0]).select('.popover')
				.style('top', legendMargin.top + 'px')
				.style('opacity', 0);
			
			var areaGroup, xAxisGroup, yAxisGroup, voronoiGroup, xExtents, nestVoronoi, 
				focus, legendTitle, legendContent;
			
			scope.create = function(data){
				// gets extent of x axis and formats data into date using accessor
				xExtents = data.map(function(d){
					return d3.extent(d.values, function(v){
						v.ref = d; //creates a reference to the parent object
						v.date = parseDate(v);
						return v.date;
					});
				});
				
				x.domain(d3.extent(d3.merge(xExtents)));
				y.domain([0, d3.max(data, function(d){
						return d3.max(d.values, function(d){
							return d.value;
						});
					})
				]);
				
				// Init hover legend - set all values to first point
				legendTitle = hoverLegend.select('.popover-title')
					.text(hoverDateFormat(data[0].values[0].date));
				
				legendContent = hoverLegend.select('.popover-content')
					.selectAll('.graph-key-row')
					.data(data)
					.enter()
					.append('div')
					.attr('class', 'graph-key-row');
				
				legendContent.append('div')
					.append('div')
					.attr('class', 'key-color')
					.style('background-color', function(d, i){return lineColor(i); });
					
				legendContent.append('div')
					.attr('class', 'key-label')
					.text(function(d){ return d.name; });
					
				legendContent.append('div')
					.attr('class', 'key-value')
					.text(function(d){ return yAxisFormat(d.values[0].value); });
				
				areaGroup = svg.selectAll('.area-group')
					.data(data)
					.enter()
					.append('g')
					.attr('class', 'area-group');

				areaGroup.append("path")
					.attr("class", "area")
					.style('fill', function(d, i){return areaColor(i);})
					.style('opacity', 0.05)
					.attr("d", function(d){return area(d.values);});

				areaGroup.append("path")
					.attr("class", "line")
					.style('stroke', function(d, i){return lineColor(i);})
					.attr("d", function(d){ d.line = this; return line(d.values);});

				xAxisGroup = svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				yAxisGroup = svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				yAxisGroup.append("text")
					.attr('class', 'y-label')
					.attr("y", -13)
					.attr("x", -37)
					.style("text-anchor", "begin")
					.text(yAxisLabel);

				focus = svg.append("g")
					.attr("class", "focus")
					.attr("transform", "translate(" + 0 + "," + 0 + ")")
					.style('opacity', 0);

				focus.append("rect")
					.attr("height", height)
					.attr("width", 5)
					.attr('x', -2);

				focus.append('rect')
					.attr("height", 4)
					.attr("width", 48)
					.attr('x', -24)
					.attr('y', height)
					.attr("rx", 1)
					.attr('ry', 1);
				/*
				focus.append('text')
					.attr('class', 'shadow')
					.attr('x', 0)
					.attr('y', height - 7)
					.attr('dy','.35em');

				focus.append('text')
					.attr('x', 0)
					.attr('y', height - 8)
					.attr('dy','.35em');
				*/

				voronoiGroup = svg.append("g")
					.attr("class", "voronoi");

				nestVoronoi = d3.nest()
					.key(function(d) { return x(d.date) + "," + y(d.value); })
					.rollup(function(v) { return v[0]; })
					.entries(d3.merge(data.map(function(d){return d.values;})))
					.map(function(d){ return d.values;});

				voronoiGroup.selectAll("path")
					.data(voronoi(nestVoronoi))
					.enter().append("path")
					.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
					.datum(function(d) {return d.point;})
					.on("mouseover", mouseOverVoronoi)
					.on("mouseout", mouseOutVoronoi);
				
				svg.on('mouseenter', function(){
						focus.transition().style('opacity', 1);
						hoverLegend.transition().style('opacity', 1);
					})
					.on('mouseleave', function(){
						focus.transition().style('opacity', 0);
						hoverLegend.transition().style('opacity', 0);
					})
					.on("mousemove", moveFocus);
			};

			scope.update = function(data, resize){
				
				xExtents = data.map(function(d){
					return d3.extent(d.values, function(v){
						v.ref = d; //creates a reference to the parent object
						v.date = resize ? v.date : parseDate(v);
						return v.date;
					});
				});
				x.domain(d3.extent(d3.merge(xExtents)));
				y.domain([0, d3.max(data, function(d){
						return d3.max(d.values, function(d){
							return d.value;
						});
					})
				]);
				
				yAxisGroup.transition()
					.call(yAxis);
				xAxisGroup.transition()
					.call(xAxis);

				areaGroup.data(data)
					.select('.line')
					.transition()
					.attr("d", function(d){ d.line = this; return line(d.values);});

				areaGroup.select('.area')
					.transition()
					.attr("d", function(d){return area(d.values);});

				nestVoronoi = d3.nest()
					.key(function(d) {return x(d.date) + "," + y(d.value); })
					.rollup(function(v) { return v[0]; })
					.entries(d3.merge(data.map(function(d) { return d.values; })))
					.map(function(d) { return d.values; });

				voronoiGroup.selectAll("path")
					.data(voronoi(nestVoronoi))
					.attr("d", function(d) {return "M" + d.join("L") + "Z"; })
					.datum(function(d) {return d.point;});
			};
			
			scope.resize = function(){
				
				width = (typeof(config.width) === "function") ?
					config.width(element) - margin.left - margin.right:
					width - margin.left - margin.right;
				
				d3.select(element[0]).select('svg')
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);
					
				x.range([0, width]);
				y.range([height, 0]);
				voronoi.clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
			};

			function moveFocus(){
				var x0 = d3.mouse(this)[0];
				x0 = Math.max(0, x0);
				x0 = Math.min(width, x0);
				moveTooltip(x0);
				focus.attr('transform', "translate(" + x0 + "," + 0 + ")");
				//focus.selectAll('text')
				//	.text(d3.time.format('%-m/%-d')(x.invert(x0)));
			}
			
			function moveTooltip(x0){
				var xDate = x.invert(x0),
					values = [],
					d0, d1, i, yValue, interpolate, range;
					
				angular.forEach(data, function(d){
					i = bisectDate(d.values, xDate);
					d0 = d.values[i - 1];
					d1 = d.values[i];
					interpolate = d3.interpolateNumber(d0.value, d1.value);
					range = d1.date - d0.date;
					yValue = interpolate((xDate - d0.date) / range);
					values.push(yValue);
				});
				
				hoverLegend.style('left', (x0 + legendMargin.left) + 'px');
				updateTooltip(xDate, values);
			}
			
			function updateTooltip(xDate, values){
				legendTitle.text(hoverDateFormat(xDate));
				
				legendContent.data(values)
					.select('.key-value')
					.text(function(d){
						return (d >= 100)? d3.format('.3s')(d): d.toFixed(0);
					});
			}
			
			function mouseOverVoronoi(d) {
				d3.select(d.ref.line.parentNode)
					.style('opacity', 1);
			}

			function mouseOutVoronoi(d) {
				d3.select(d.ref.line.parentNode)
					.style('opacity', 0.3);
			}
		}
	};
}]);

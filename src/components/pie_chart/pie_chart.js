angular.module('amelia-ui.charts.pie-chart', [])

.service('OBPieChartConfig', function(){
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
		options = options || {};
		var defaults = {
			margin: {
				top : 20,
				right : 20,
				bottom : 20,
				left : 20
			},
			outerRadius: 120,
			innerRadius: 80,
			collapseOuterRadius: 81,
			collapseInnerRadius: 60,
			sunburstOuterRadius: 120,
			sunburstInnerRadius: 80,
			width: 280,
			animDuration: 500,
			colors: ['#FFDFCC','#FFA066', '#FF6000' ,'#BF4800','#200C00'], //light to dark
			collapseColors: ['#D9D1CC', '#B2A399','#8C7466','#664633','#200C00'],
			outerColorRange: ['#CEE7ED', '#08C1EA', '#200C00'], //range for interpolation
		};

		extendDeep(this, defaults);
		this.height = (this.outerRadius * 2) + this.margin.top + this.margin.bottom;
		extendDeep(this, options);
		// Sets the key accessor for d3 to grab the unique key of the pie slice, to allow a proper update animation
		if(options && options.keyAccessor){
			if(typeof options.keyAccessor === "string"){
				this.keyAccessor = function(d){
					return d.data[options.keyAccessor];
				};
			}else{
				this.keyAccessor = function(d){
					return options.keyAccessor(d.data);
				};
			}
		}else{
			this.keyAccessor = function(d) {
				return d.data.label;
			};
		}
	};
})

.directive('obPieChart', ['$parse', '$compile', 'OBPieChartConfig', function($parse, $compile, OBPieChartConfig) {
	return {
		restrict: 'EA',
		scope: {
			data: '=obPieChartData'
		},
		link: function(scope, element, attrs) {

			// Read options from directive attribute.
			var d3 = window.d3,
				config = new OBPieChartConfig($parse(attrs.obPieChartOptions)(scope));
			// D3 Geometry objects
			var svg, innerPieGroup, outerPieGroup, outerArcs, outerPaths, arc, pie, arcs, paths, text, label;

			var color = d3.scale.ordinal().range(config.colors),
				collapseColor = d3.scale.ordinal().range(config.collapseColors),
				outerColor = d3.scale.linear()
					.range(config.outerColorRange)
					.interpolate(d3.interpolateRgb);
			// rendering controls
			var runUpdate = false,
				isSunburstActive = false,
				animatingSunburst = false;

			var render = function(data){
				if(!runUpdate){
					scope.create(data.primaryData);
					sunburstData = data.otherData;
					runUpdate = true;
				}else{
					if(!animatingSunburst){
						// don't allow update during sunburst animation
						//TODO set timeout for update ?
						scope.update(data.primaryData);
					}
					sunburstData = data.otherData;
				}
			};
			scope.$watch('data', function(newValue) {
				render(newValue);
			});

			var width = config.width,
				height = config.height,
				margin = config.margin,
				primaryInnerRadius = config.innerRadius,
				primaryOuterRadius = config.outerRadius,
				collapseOuterRadius = config.collapseOuterRadius,
				collapseInnerRadius = config.collapseInnerRadius,
				sunburstOuterRadius = config.sunburstOuterRadius,
				sunburstInnerRadius = config.sunburstInnerRadius,
				arcCenter = config.outerRadius,
				animDuration = config.animDuration,
				keyAccessor = config.keyAccessor,
				sunburstData,
				sliceTotal = 0,
				runSunburstOnHover = function(d){
					return d.data.key === "other";
				};

			scope.create = function(data) {

				angular.forEach(data, function(d){
					sliceTotal += d.value;
				});

				svg = d3.select(element[0]).append('svg')
					.attr("width", width)
					.attr("height", height)
					.on('mouseleave', function(){
						function findParentWithClass(ele, className){
							while(ele && ele.nodeType !== 9){
								if(angular.element(ele).hasClass(className)){
									return ele;
								}
								ele = ele.parentNode;
							}
							return false;
						}
						function isChildOf(ele, parent){
							while(ele && ele.nodeType !== 9){
								if(ele === parent){
									return true;
								}
								ele = ele.parentNode;
							}
						}
						var popoverElement = findParentWithClass(d3.event.toElement, 'popover');

						// Don't destroy the the sunburst if user hovers over a popover
						if(!popoverElement){
							scope.destroySunburst();
						}else{
							// Fix for issue of not destroying sunburst after entering popover (for browsers that dont support pointer events)
							d3.select(popoverElement).on('mouseleave', function(){
								if(!isChildOf(d3.event.toElement, svg[0][0])){
									scope.destroySunburst();
								}
							});
						}
					});

				innerPieGroup = svg.append("g")
					.attr('class', 'inner-pie')
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				outerPieGroup = svg.append("g")
					.attr('class', 'outer-pie')
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				label = d3.select(element[0])
					.append('div')
					.attr('class', 'pie-label')
					.style('top', (margin.top + arcCenter - 10) + 'px')
					.style('left', (margin.left + arcCenter - 70) + 'px')
					.style('opacity', 0);

				text = label.append('span')
					.attr('class', 'pie-text')
					.text('00.00')
					.each(function() {
						this._current = 0;
					});

				label.append('div')
					.attr('class', 'pie-desc')
					.text('*percentage of all traffic');

				arc = d3.svg.arc();

				pie = d3.layout.pie().sort(null)
					.value(function(d) {
						return d.value;
					});

				arcs = innerPieGroup.selectAll(".arc")
					.data(pie(data), keyAccessor)
					.enter()
					.append('g')
					.attr('class', 'arc')
					.attr("transform", "translate(" + arcCenter + "," + arcCenter + ")");

				paths = arcs.append('path')
					.attr('class', 'pie-path')
					.style("fill", function(d, i) { return color(i); })
					.attr({
						'pieover': function(d){return d.data.label;},
						'popover-placement': function(d){
							return isTop(d) ?'top': 'bottom';
						},
						'popover-append-to-body': true,
						'popover-trigger': 'mouseenter',
					})
					.each(function(d, i) {
						$compile(this)(scope); //register new <path> to angular
						this._current = {
							startAngle: d.startAngle,
							endAngle: d.endAngle,
						};
						setPrimaryRadii(this._current);
						setPrimaryRadii(d);
						this._color = color(i);
					})
					.on('mouseenter', mouseEnterSlice)
					.on('mouseleave', mouseLeaveSlice);

				paths.transition()
					.ease("exp-out")
					.duration(animDuration)
					.attrTween("d", tweenArcIntro);
			};

			scope.update = function(updateData){
				var data0 = arcs.data();
				var data1 = pie(updateData);

				sliceTotal = 0;
				angular.forEach(updateData, function(d){
					sliceTotal += d.value;
				});

				arcs = innerPieGroup.selectAll(".arc")
					.data(data1, keyAccessor);

				arcs.enter()
					.append('g')
					.attr('class', 'arc')
					.attr("transform", "translate(" + arcCenter + "," + arcCenter + ")")
					.append('path') // paths for new added slices
					.attr('class', 'pie-path')
					.style("fill", function(d, i) {
						return isSunburstActive ? collapseColor(i): color(i);
					})
					.attr({
						'pieover': function(d){return d.data.label;},
						'popover-placement': function(d){
							return isTop(d) ? 'top': 'bottom';
						},
						'popover-append-to-body': true,
						'popover-trigger': 'mouseenter',
					})
					.each(function(d, i) {
						$compile(this)(scope); //needed for angular to know the attrs exist
						this._current = findNeighborArc(i, data0, data1, keyAccessor) || d;
						setPrimaryRadii(this._current);
						setPrimaryRadii(d);
						this._color = color(i);
					})
					.on('mouseenter', mouseEnterSlice)
					.on('mouseleave', mouseLeaveSlice);

				arcs.exit().select('path')
					.datum(function(d, i) {
						return findNeighborArc(i, data1, data0, keyAccessor) || d;
					})
					.transition()
					.duration(animDuration)
					.attrTween("d", tweenArcUpdate)
					.each("end", function(){ //remove entire arc node
						d3.select(this.parentNode).remove();
					});

				// animates arcs that will remain
				// NOTE: excludes exiting nodes selection due to d3 rebind .data above
				arcs.select('path')
					.transition()
					.duration(animDuration)
					.attrTween("d", tweenArcUpdate);
			};

			scope.createSunburst = function(data){
				if(isSunburstActive || !sunburstData){
					return;
				}
				outerColor.domain([0, (sunburstData.length-1)/2, sunburstData.length-1]);
				isSunburstActive = true;
				animatingSunburst = true;

				arcs.select('path')
					.transition()
					.duration(animDuration)
					.style('fill', function(d, i){return collapseColor(i);})
					.attrTween("d", tweenArcCollapse)
					.each('end', function(d,i){
						if(i === 0){
							animatingSunburst = false;
						}
					});

				outerArcs = outerPieGroup.selectAll(".arc")
					.data(pie(data), keyAccessor)
					.enter()
					.append('g')
					.attr('class', 'arc')
					.attr("transform", "translate(" + arcCenter + "," + arcCenter + ")");

				/* Filled pie piece */
				outerPaths = outerArcs.append('path')
					.attr('class', 'pie-path')
					.style("fill", function(d, i){return outerColor(i);})
					.attr({
						'pieover': function(d){return d.data.label;},
						'popover-placement': function(d){
							return isTop(d) ? 'top': 'bottom';
						},
						'popover-append-to-body': true,
						'popover-trigger': 'mouseenter',
					})
					.each(function() {
						$compile(this)(scope);
					})
					.on('mouseenter', mouseEnterSlice)
					.on('mouseleave', mouseLeaveSlice);

				outerPaths.transition()
					.ease("exp-out")
					.delay(animDuration)
					.duration(animDuration)
					.attrTween("d", tweenArcSunburstIntro);
			};

			scope.destroySunburst = function(){
				if(!isSunburstActive){
					return;
				}

				isSunburstActive = false;
				animatingSunburst = true;

				arcs.select('path')
					.transition()
					.delay(animDuration)
					.duration(animDuration)
					.style('fill', function(){return this._color;})
					.attrTween("d", tweenArcExpand)
					.each('end', function(d,i){
						if(i === 0){
							animatingSunburst = false;
						}
					});

				outerPaths.transition()
					.ease("exp-out")
					.duration(animDuration)
					.attrTween("d", tweenSunburstOutro)
					.each("end", function(){
						d3.select(this.parentNode).remove();
					});
			};

			/* Determine best placement for popover */
			function isTop(d){
				var midAngle = (d.startAngle + d.endAngle)/2;
				return (midAngle < (Math.PI / 2)) || (midAngle > (3 * Math.PI / 2));
			}

			function mouseEnterSlice(d){
				// create sunburst on arc if it passes a evaluation func
				if(runSunburstOnHover(d)){
					scope.createSunburst(sunburstData);
				}
				label.transition()
					.duration(animDuration)
					.style('opacity', 1);

				text.datum(d)
					.transition()
					.ease("exp-out")
					.duration(animDuration)
					.tween("text", tweenText)
					.each("end", function(d){
						this._current = sliceTotal ? d.value / sliceTotal : 0;
					});
			}

			function mouseLeaveSlice(){
				label.transition().style('opacity', 0);
			}

			// Counting function for inner text
			function tweenText(d){
				var percentage = (d.endAngle - d.startAngle) / (Math.PI * 2);
				var i = d3.interpolate(this._current, percentage * 100);
				return function(t) {
					this.textContent = d3.format('.2f')(i(t));
				};
			}

			// Only run on initial load - NOTE - Sets radius for this._current (by reference)
			function tweenArcIntro(d) {
				var i = d3.interpolate({startAngle: 0, endAngle: 0, outerRadius: 0, innerRadius: 0}, d);
				return function(t) {
					return arc(i(t));
				};
			}

			function tweenArcSunburstIntro(d) {
				d.outerRadius = sunburstOuterRadius;
				d.innerRadius = sunburstInnerRadius;
				var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
				var _this = this;
				return function(t) {
					_this._current = interpolate(t);
					return arc(_this._current);
				};
			}

			function tweenSunburstOutro() {
				if(!this._current) {
					return;
				}
				var i = d3.interpolate(this._current, {startAngle: 0, endAngle: 0});
				return function(t) {
					return arc(i(t));
				};
			}

			function setPrimaryRadii(d){
				if(!isSunburstActive){
					d.outerRadius = primaryOuterRadius;
					d.innerRadius = primaryInnerRadius;
				}else{
					d.outerRadius = collapseOuterRadius;
					d.innerRadius = collapseInnerRadius;
				}
			}

			/* Assumes this._current has previous radii and angles for the arc */
			function tweenArcUpdate(d) {
				var i = d3.interpolate(this._current, d);
				this._current = i(1);
				return function(t) {
					return arc(i(t));
				};
			}

			function tweenArcCollapse(d) {
				d.outerRadius = collapseOuterRadius;
				d.innerRadius = collapseInnerRadius;
				var i = d3.interpolate(this._current, d);
				this._current = i(1);
				return function(t) {
					return arc(i(t));
				};
			}

			function tweenArcExpand(d) {
				d.outerRadius = primaryOuterRadius;
				d.innerRadius = primaryInnerRadius;
				var i = d3.interpolate(this._current, d);
				this._current = i(1);
				return function(t) {
					return arc(i(t));
				};
			}

			function findNeighborArc(i, data0, data1, key) {
				var d;
				return (d = findPreceding(i, data0, data1, key)) ? {
					startAngle : d.endAngle,
					endAngle : d.endAngle,
				} : (d = findFollowing(i, data0, data1, key)) ? {
					startAngle : d.startAngle,
					endAngle : d.startAngle,
				} : null;
			}

			// Find the element in data0 that joins the highest preceding element in data1.
			function findPreceding(i, data0, data1, key) {
				var m = data0.length;
				while (--i >= 0) {
					var k = key(data1[i]);
					for ( var j = 0; j < m; ++j) {
						if (key(data0[j]) === k){
							return data0[j];
						}
					}
				}
			}

			// Find the element in data0 that joins the lowest following element in data1.
			function findFollowing(i, data0, data1, key) {
				var n = data1.length, m = data0.length;
				while (++i < n) {
					var k = key(data1[i]);
					for ( var j = 0; j < m; ++j) {
						if (key(data0[j]) === k){
							return data0[j];
						}
					}
				}
			}
		} // end link
	};
}]);

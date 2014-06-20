angular.module('amelia-ui.charts.line-graph', ['d3'])

.service('OBChartConfig', function() {
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
    var defaults = {
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
      },
      outerRadius: 122,
      innerRadius: 79,
      width: 1024,
      color: ['#2ed0df', '#ff5f00', '#ff9f66', '#74b112', '#666666'],
    };

    extendDeep(this, defaults);
    this.height = (this.outerRadius * 2) + this.margin.top + this.margin.bottom;
    extendDeep(this, options);
  };
})

.controller('obLineGraphController', ['$scope',
  function($scope) {
    var data = [{
      name: 'TestPub1',
      values: [{
        value: 100,
        date: 1395936691321,
      }, {
        value: 150,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 3),
      }, {
        value: 125,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 6),
      }]
    }, {
      name: 'TestPub2',
      values: [{
        value: 130,
        date: 1395936691321,
      }, {
        value: 50,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 3),
      }, {
        value: 15,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 6),
      }]
    }, {
      name: 'TestPub3',
      values: [{
        value: 180,
        date: 1395936691321,
      }, {
        value: 10,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 3),
      }, {
        value: 115,
        date: 1395936691321 - (1000 * 60 * 60 * 24 * 6),
      }]
    }];

    $scope.data = data;
  }
])

.directive('obLineGraph', ['$parse', 'd3Service', 'OBChartConfig',
  function($parse, d3Service, OBChartConfig) {
    return {
      restrict: 'EA',
      controller: 'obLineGraphController',
      // directive code
      link: function(scope, element, attrs) {

        // Read options from directive attribute.
        var config = new OBChartConfig($parse(attrs.obLineGraphOptions)(scope));

        // Load D3 and initialize
        d3Service.d3().then(function(d3) {

          scope.$watch(function() {
            return scope.data;
          }, function() {
            scope.render(scope.data);
          });

          var runUpdate = false;
          scope.render = function(data) {
            if (!runUpdate) {
              scope.create(data);
              runUpdate = true;
            } else {
              scope.update(data);
            }
          };

          var margin = config.margin,
            width = config.width - margin.left - margin.right,
            height = config.height - margin.top - margin.bottom,
            color = d3.scale.category10(); //.domain(d3.keys(graph_data))

          var xAxisDate = d3.time.format("%-m/%-d"),
            yAxisFormat = d3.format('s.2d');

          var x = d3.time.scale().range([0, width]),
            y = d3.scale.linear().nice().range([height, 0]);

          var xAxis, yAxis, xAxisGrid, yAxisGrid, yAxisLabel,
            svg, line;

          scope.create = function(data) {

            var xExtents = data.map(function(d) {
              return d3.extent(d.values, function(c) {
                return c.date;
              });
            });

            x.domain(d3.extent(d3.merge(xExtents)));
            y.domain([
              d3.min(data, function(c) {
                return d3.min(c.values, function(v) {
                  return v.value;
                });
              }),
              d3.max(data, function(c) {
                return d3.max(c.values, function(v) {
                  return v.value;
                });
              })
            ]);

            xAxis = d3.svg.axis()
              .ticks(5)
              .tickFormat(xAxisDate)
              .scale(x)
              .orient("bottom");

            yAxis = d3.svg.axis()
              .scale(y)
              .tickFormat(yAxisFormat)
              .orient("left");

            xAxisGrid = d3.svg.axis()
              .ticks(20)
              .scale(x)
              .tickSize(-height, 0, 0)
              .tickFormat("")
              .orient("bottom");

            yAxisGrid = d3.svg.axis()
              .ticks(20)
              .scale(y)
              .tickSize(-width, 0, 0)
              .tickFormat("")
              .orient("left");

            line = d3.svg.line()
              .interpolate("monotone")
              .x(function(d) {
                return x(d.date);
              })
              .y(function(d) {
                return y(d.value);
              });

            svg = d3.select(element[0])
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
              .attr("class", "grid")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxisGrid);

            svg.append("g")
              .attr("class", "grid")
              .call(yAxisGrid);

            svg.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y-axis")
              .call(yAxis)
              .append("text")
            //.attr("transform", "rotate(-90)")
            .attr("x", 104)
              .attr("y", -21)
              .attr("dy", ".71em")
              .style("font-size", "16px")
              .style("font-weight", "bold")
              .style("text-anchor", "end")
              .text(yAxisLabel);

            var lineGroup = svg.selectAll(".line-group")
              .data(data)
              .enter()
              .append("g")
              .attr("class", "line-group");

            lineGroup.append("path")
              .attr("class", "line")
              .attr("d", function(d) {
                return line(d.values);
              })
              .style("stroke", function(d) {
                return color(d.name);
              });

            var pointWidth = 5,
              pointPos = -pointWidth / 2,
              pointBounceWidth = pointWidth * 2.5,
              pointBouncePos = -pointWidth * 2.5 / 2;

            var hoverGroup = lineGroup.append('g')
              .attr('class', 'line-point')
              .style("stroke", function(d) {
                return color(d.name);
              })
              .style("fill", function(d) {
                return color(d.name);
              })
              .selectAll("rect")
              .data(function(d) {
                return d.values;
              })
              .enter()
              .append('g')
              .attr("transform", function(d) {
                return "translate(" + x(d.date) + ',' + y(d.value) + ")";
              });

            hoverGroup
              .append("rect")
              .attr('width', pointWidth)
              .attr('height', pointWidth)
              .attr('x', pointPos)
              .attr('y', pointPos);

            hoverGroup.append('circle')
              .style("opacity", 0)
              .attr('r', 20)
              .on('mouseenter', function() {
                d3.select(this.parentNode).select('rect')
                  .transition()
                  .ease('bounce')
                  .duration(250)
                  .attr('width', pointBounceWidth)
                  .attr('height', pointBounceWidth)
                  .attr('x', pointBouncePos)
                  .attr('y', pointBouncePos);
              })
              .on('mouseleave', function() {
                d3.select(this.parentNode).select('rect')
                  .transition()
                  .ease('bounce')
                  .duration(250)
                  .attr('width', pointWidth)
                  .attr('height', pointWidth)
                  .attr('x', pointPos)
                  .attr('y', pointPos);

              });

          };

        });
      }
    };
  }
]);

window.OBTimelineGraph = function OBTimelineGraph(selector) {

  var d3 = window.d3,
    selection = d3.select(selector),
    margin = {
      top: 35,
      right: 20,
      bottom: 25,
      left: 15,
    },
    width = 400,
    height = 300,
    timelineHeight = 25,
    parseDate = function(d) {
      return d3.time.format("%m/%d/%Y").parse(d);
    },
    color = d3.scale.category10(),
    x = d3.time.scale(),
    y = d3.scale.linear(),
    //xAxisFormat = d3.time.format('%m/%d'),
    xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxisLabel,
    xAxisGroup,
    svg,
    xExtent,
    yExtent,
    timelineGroup,
    circles,
    graphGroup,
    title,
    line = d3.svg.line(),
    valuesFilter = function(d) { //
      return valuesAccessor(d).filter(function(d) {
        return yAccessor(d) !== 0 && yAccessor(d) !== null;
      });
    },
    valuesAccessor = function(d) {
      return d.values;
    },
    xAccessor = function(d, value) {
      if (value) {
        d.date = value;
      }
      return d.date;
    },
    yAccessor = function(d) {
      return d.value;
    };

  /*function setAxis() {
    if ((xExtent[1] - xExtent[0]) / (1000 * 60) <= 61) {
      xAxis.ticks(d3.time.minutes, 10)
        .tickFormat(d3.time.format('%-I:%M'));
    } else {
      xAxis.ticks(d3.time.hours, 2)
        .tickFormat(xAxisFormat);
    }
  }*/

  function setScale(data) {
    var xExtents = data.map(function(d) {
      return d3.extent(valuesAccessor(d), function(d) {
        if (typeof(xAccessor(d)) !== 'string') {
          return xAccessor(d);
        }
        var date = parseDate(xAccessor(d));
        return xAccessor(d, date);
      });
    });
    xExtent = d3.extent(d3.merge(xExtents));
    yExtent = [0, d3.max(data, function(d) {
      return d3.max(valuesAccessor(d), function(d) {
        return yAccessor(d);
      });
    })];
    x.domain(xExtent);
    y.domain(yExtent);
  }

  function chart(data) {

    setScale(data);
    //setAxis();

    timelineHeight = ~~ ((height - margin.top - margin.bottom) / data.length);
    x.range([0, width - margin.left - margin.right]);
    y.range([height - margin.top - margin.bottom, 0]);

    svg = selection.append('svg')
      .attr('class', 'timeline-graph')
      .attr("width", width)
      .attr("height", height);

    graphGroup = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    line.defined(function(d) {
      return yAccessor(d) !== null;
    })
      .x(function(d) {
        return x(xAccessor(d));
      })
      .y(0);

    timelineGroup = graphGroup.selectAll('.timeline-group')
      .data(data)
      .enter()
      .append('g')
      .attr("transform", function(d, i) {
        return "translate(0," + (i * timelineHeight) + ")";
      })
      .attr('class', 'timeline-group').style('fill', function(d, i) {
        return color(i);
      });

    timelineGroup.append("path")
      .attr("class", "timeline-line")
      .attr("d", function(d) {
        return line(valuesAccessor(d));
      });

    circles = timelineGroup.selectAll('.circ')
      .data(valuesFilter)
      .enter()
      .append('circle')
      .attr('class', 'circ')
      .attr('r', 0)
      .style('opacity', 0.7)
      .attr("transform", function(d) {
        return "translate(" + x(xAccessor(d)) + ",0)";
      });

    circles.transition()
      .delay(function(d, i) {
        return i * 10;
      })
      .attr('r', function(d) {
        return yAccessor(d) + 4;
      });

    xAxisGroup = graphGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
      .call(xAxis);
  }

  function update(data) {
    setScale(data);
    //setAxis();
    xAxisGroup.transition()
      .duration(1000)
      .call(xAxis);

    timelineGroup.data(data);

    timelineGroup.selectAll('.timeline-line')
      .data(function(d) {
        return [d];
      })
      .transition()
      .attr("d", function(d) {
        return line(valuesAccessor(d));
      });

    circles = timelineGroup.selectAll('.circ')
      .data(valuesFilter);

    circles.enter()
      .append('circle')
      .attr('class', 'circ')
      .attr('r', 0)
      .style('opacity', 0.7)
      .attr("transform", function(d) {
        return "translate(" + x(xAccessor(d)) + ",0)";
      })
      .transition()
      .delay(function(d, i) {
        return i * 10;
      })
      .attr('r', function(d) {
        return yAccessor(d) + 4;
      });

    circles.exit()
      .transition()
      .delay(0)
      .attr('r', 0)
      .remove();

    circles.transition()
      .attr('r', function(d) {
        return yAccessor(d) + 4;
      })
      .attr("transform", function(d) {
        return "translate(" + x(xAccessor(d)) + ",0)";
      });
  }

  function resize() {
    x.range([0, width - margin.left - margin.right]);
    svg.attr("width", width);
  }

  chart.render = function(data) {
    chart(data);
    return chart;
  };

  chart.update = function(data) {
    update(data);
    return chart;
  };

  chart.resize = function() {
    resize();
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) {
      return margin;
    }
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return chart;
  };

  chart.title = function(_) {
    if (!arguments.length) {
      return title;
    }
    title = _;
    return chart;
  };

  chart.xAxisLabel = function(_) {
    if (!arguments.length) {
      return xAxisLabel;
    }
    xAxisLabel = _;
    return chart;
  };

  return chart;
};

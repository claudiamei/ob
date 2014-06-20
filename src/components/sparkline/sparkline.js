function OBSparkline(selector) {
  var d3 = window.d3,
    selection = d3.select(selector),
    margin = {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    },
    width = 400,
    height = 50,
    circleRadius = 3,
    x = d3.scale.linear(),
    y = d3.scale.linear(),
    svg,
    xExtent,
    yExtent,
    line,
    area,
    data,
    graphLine,
    graphArea,
    sparkCircle,
    sparklineGroup;

  function setScale(data) {
    xExtent = [0, data.length - 1];
    yExtent = d3.extent(data);
    x.domain(xExtent);
    y.domain(yExtent);
  }

  function chart(initialData) {
    data = initialData;
    setScale(data, true);

    x.range([0, width - margin.left - margin.right]);
    y.range([height - margin.top - margin.bottom, 0]);

    line = d3.svg.line()
      .interpolate('monotone')
      .defined(function(d) {
        return d !== null;
      })
      .x(function(d, i) {
        return x(i);
      })
      .y(function(d) {
        return y(d);
      });

    area = d3.svg.area()
      .interpolate('monotone')
      .defined(function(d) {
        return d !== null;
      })
      .x(function(d, i) {
        return x(i);
      })
      .y0(height)
      .y1(function(d) {
        return y(d);
      });

    svg = selection.append('svg')
      .attr('class', 'sparkline-graph')
      .attr("width", width)
      .attr("height", height)
      .on('mousemove', hoverSpark)
      .on('mouseleave', leaveSpark);

    sparklineGroup = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    graphLine = sparklineGroup.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    graphArea = sparklineGroup.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    sparkCircle = sparklineGroup.append("circle")
      .attr('class', 'circle')
      .attr('r', circleRadius)
      .attr('cx', x(data.length - 1))
      .attr('cy', y(data[data.length - 1]));

  }

  function update(updateData) {
    data = updateData;
    setScale(data, false);

    graphLine.datum(data)
      .transition()
      .attr("d", line);

    graphArea.datum(data)
      .transition()
      .attr("d", area);

    sparkCircle.transition()
      .attr('cx', x(data.length - 1))
      .attr('cy', y(data[data.length - 1]));
  }

  function leaveSpark() {
    sparkCircle.transition()
      .attr('cx', x(data.length - 1))
      .attr('cy', y(data[data.length - 1]));
  }

  function hoverSpark() {
    var leftIndex,
      rightIndex,
      xIndex,
      yVal,
      interpolate,
      xMouse = d3.mouse(this)[0] - margin.left;

    xMouse = Math.max(xMouse, x.range()[0]);
    xMouse = Math.min(xMouse, x.range()[1]);

    xIndex = x.invert(xMouse);
    leftIndex = ~~xIndex;
    rightIndex = (leftIndex >= data.length - 1) ? leftIndex : leftIndex + 1;
    interpolate = d3.interpolateNumber(data[leftIndex], data[rightIndex]);
    yVal = interpolate(xIndex - leftIndex);

    sparkCircle
      .attr('cx', x(xIndex))
      .attr('cy', y(yVal));
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

  return chart;
}

window.OBSparkline = OBSparkline;

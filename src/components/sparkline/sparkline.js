
function OBSparkline(selector) {
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
    parseDate = function(d) {
      d.date = d3.time.format("%m/%d/%Y").parse(d.date);
      return d.date;
    },
    x = d3.time.scale(),
    y = d3.scale.linear(),
    svg,
    xExtent,
    yExtent,
    line,
    area,
    sparklineGroup;

  function setScale(data, parseDates) {
    xExtent = d3.extent(data, function(d){
       if(parseDates){
         return parseDate(d);
       }
       return d.date;
    });
    yExtent = d3.extent(data, function(d){
      return d.value;
    });
    x.domain(xExtent);
    y.domain(yExtent);
  }

  function chart(data) {

    setScale(data, true);

    x.range([0, width - margin.left - margin.right]);
    y.range([height - margin.top - margin.bottom, 0]);

    line = d3.svg.line()
      .defined(function(d) {
        return d.value !== null;
      })
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.value);
      });

    area = d3.svg.area()
      .defined(function(d) {
        return d.value !== null;
      })
      .interpolate('monotone')
      .x(function(d) {
        return x(d.date);
      })
      .y0(height)
      .y1(function(d) {
        return y(d.value);
      });

    svg = selection.append('svg')
      .attr('class', 'sparkline-graph')
      .attr("width", width)
      .attr("height", height);

    sparklineGroup = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    sparklineGroup.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    sparklineGroup.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);
  }

  function update(data) {
    setScale(data, false);

  }

  function resize(){
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
    if (!arguments.length){return margin;}
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) {return width;}
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) {return height;}
    height = _;
    return chart;
  };

  return chart;
}

window.OBSparkline = OBSparkline;
// Margin, width and height of SVG
var margin = {top: 20, right: 50, bottom: 30, left: 60};
var width = ($(window).width() * 70/100) - margin.left - margin.right,
height = ($(window).height() * 40/100) - margin.top - margin.bottom;

// Create a bar chart
// obj == data passed from 'energy_types_chart_data' or 'regions_chart_data'
// type == 'energy_types' or 'regions'
// y_axis == 'accidents' or 'fatalities' or 'injuries' or 'evacuees' or 'economic damage'
function barChart(obj, type, y_axis){
  // Set SVG
  var svg = d3.select("#chart").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      // Padding between bars of different year
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      // Padding between bars of same year
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  // Set the keys, either regions or energy type
  if(type == 'regions'){
    var keys = region_active;
  }else{
    var keys = energy_type_active;
  }

  // Set the scale, either log scale or linear scale
  if($('#scale').val() == 'log'){
    var y_label = 'lg(Number of ' + y_axis + ') ';
  }else{
    var y_label = 'Number of ' + y_axis + ' ';
  }

  x0.domain(obj.map(function(d) { return d.year; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(obj, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  // Draw the bar
  g.append("g")
    .selectAll("g")
    .data(obj)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return x1(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x1.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d) {
      if(type == 'regions'){
        return region_color[d.key];
      }
      return energy_color[d.key];
    })
    .on('mouseover', function(d){
        // Tooltip
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "node-information")
            .style('background-color', 'black')
            .style('z-index', 10000)
            .style('position', 'absolute');

        // If it is log, set the value to 2 decimal places
        if($('#scale').val() == 'log'){
          y_val = d.value.toFixed(2);
        }else{
          y_val = d.value;
        }

        if(type == 'regions'){
          var contentString = '<div style="font:bold 11px lato; color : white;"> Region : '+ region_filter[d.key] +'</div><div style="font:bold 11px lato; color : white;"> ' + y_label + ' : '+ y_val + '</div>';
        }else{
          var contentString = '<div style="font:bold 11px lato; color : white;"> Energy type : '+ d.key +'</div><div style="font:bold 11px lato; color : white;">' + y_label + ' : '+ y_val + '</div>';
        }

        tooltip.html(contentString)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
      })
      .on('mouseout', function(d){
        $('.node-information').remove();
      });

  // Create x axis
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  // Create y axis with text == 'Number of ...' or 'lg(Number of ...)'
  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(10, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(y_label);

  // Create legend
  if(type == 'regions'){
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 7)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(30," + i * 15 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) {return region_color[d]});

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 5)
        .attr("dy", "0.32em")
        .text(function(d){ return region_filter[d]});
  }
}

// Create energy type line chart
// obj == data passed from 'energy_types_chart_data' or 'regions_chart_data'
// type == 'energy_types' or 'regions'
// y_axis == 'accidents' or 'fatalities' or 'injuries' or 'evacuees' or 'economic damage'
function createEnergyLine(obj, y_axis){
  // This is because economics have a very huge number
  if(y_axis == 'economics'){
    margin.left = 100;
  }else{
    margin.left = 60;
  }
  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // Create number of lines according to number of energy type active
  // each line contains x(year) and y axis(number according to energy type)
  for(var i = 0; i < energy_type_active.length; i++){
    this['valueline' + i] = d3.line()
        .x(function(d) {
          return x(d.year);
        })
        .y(function(d) { return y(d[energy_type_active[i]]);
      });
  }

  // Create SVG
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    obj.forEach(function(d) {
        d.year = (+d.year);
        for(var i = 0; i < energy_type_active.length; i++){
          d[energy_type_active[i]] = +d[energy_type_active[i]];
        }
    });

    // Scale the range of the data
    x.domain(d3.extent(obj, function(d) { return d.year; }));
    y.domain([0, d3.max(obj, function(d) {
      return window['energy_max_' + y_axis];
      })]
    );

    // Change the y label accordingly to either 'Number of ...' or 'lg(Number of ...)'
    if($('#scale').val() == 'log'){
      var y_label = 'lg(Number of ' + y_axis + ') ';
    }else{
      var y_label = 'Number of ' + y_axis + ' ';
    }

    // For each energy type
    for(var i = 0; i < energy_type_active.length;i++){
      // Draw a line
      svg.append("path")
          .data([obj])
          .attr('id', 'line' + i)
          .style("stroke", energy_color[energy_type_active[i]])
          .style('stroke-width', '2px')
          .style('fill','none')
          .attr("d", this['valueline' + i]);

      // Draw a circle, set is as transparent and at mouseover, set a tooltip
      svg.append("g").selectAll("circle")
          .data(obj)
          .enter()
          .append("circle")
          .attr("r", 5)
          .attr("cx", function(dd){return x(dd.year)})
          .attr("cy", function(dd){return y(dd[energy_type_active[i]])})
          .attr('class', 'line' + i)
          .style("fill", "transparent")
          .style('stroke', 'transparent')
          .on('mouseover', function(d){
              // Tooltip
              var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "node-information")
                  .style('background-color', 'black')
                  .style('z-index', 10000)
                  .style('position', 'absolute');

              var line_num = $(this).attr('class').substring(4, ($(this).attr('class')).length);

              if($('#scale').val() == 'log')
              {
                var contentString = '<div style="font:bold 11px lato; color : white;"> Energy type : '+ energy_type_active[line_num] +'</div><div style="font:bold 11px lato; color : white;">' + y_label + ': '+ d[energy_type_active[line_num]].toFixed(2) + '</div>';
              }else{
                var contentString = '<div style="font:bold 11px lato; color : white;"> Energy type : '+ energy_type_active[line_num] +'</div><div style="font:bold 11px lato; color : white;">' + y_label + ': '+ d[energy_type_active[line_num]] + '</div>';
              }

              tooltip.html(contentString)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px");
            })
          .on('mouseout', function(d){
            $('.node-information').remove();
          })
          .attr("stroke", "black")
    }

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(duration.length).tickFormat(d3.format("d")));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) - 10)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(y_label);

}

// Create energy type line chart
// obj == data passed from 'energy_types_chart_data' or 'regions_chart_data'
// type == 'energy_types' or 'regions'
// y_axis == 'accidents' or 'fatalities' or 'injuries' or 'evacuees' or 'economic damage'
function createRegionLine(obj, y_axis){
  // Because economics have a huge number
  if(y_axis == 'economics'){
    margin.left = 100;
  }else{
    margin.left = 60;
  }

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // Create number of lines according to regions active
  // each line contains x(year) and y axis(number according to the region)
  for(var i = 0; i < region_active.length; i++){
    this['valueline' + i] = d3.line()
        .x(function(d) {
          return x(d.year);
        })
        .y(function(d) { return y(d[region_active[i]]);
      });
  }

  // Create SVG
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    obj.forEach(function(d) {
        d.year = (+d.year);
        for(var i = 0; i < region_active.length; i++){
          d[region_active[i]] = +d[region_active[i]];
        }
    });

    // Scale the range of the data
    x.domain(d3.extent(obj, function(d) { return d.year; }));
    y.domain([0, d3.max(obj, function(d) {
      return window['region_max_' + y_axis];
      })]
    );

    // Set y label according to scale and y axis type
    if($('#scale').val() == 'log'){
      var y_label = 'lg(Number of ' + y_axis + ') ';
    }else{
      var y_label = 'Number of ' + y_axis + ' ';
    }

    // For each region
    for(var i = 0; i < region_active.length;i++){
      // Draw a line
      svg.append("path")
          .data([obj])
          .attr('id', 'line' + i)
          .style("stroke", region_color[region_active[i]])
          .style('stroke-width', '2px')
          .style('fill','none')
          .attr("d", this['valueline' + i]);

      // Draw a circle, set it transparent and in mouseover set the tooltip
      svg.append("g").selectAll("circle")
          .data(obj)
          .enter()
          .append("circle")
          .attr("r", 5)
          .attr("cx", function(dd){return x(dd.year)})
          .attr("cy", function(dd){return y(dd[region_active[i]])})
          .attr('class', 'line' + i)
          .style("fill", "transparent")
          .style('stroke', 'transparent')
          .on('mouseover', function(d){
              // Tooltip
              var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "node-information")
                  .style('background-color', 'black')
                  .style('z-index', 10000)
                  .style('position', 'absolute');

              var line_num = $(this).attr('class').substring(4, ($(this).attr('class')).length);

              if($('#scale').val() == 'log'){
                var contentString = '<div style="font:bold 11px lato; color : white;"> Region : '+ region_filter[region_active[line_num]] +'</div><div style="font:bold 11px lato; color : white;">'+ y_label + ': '+ d[region_active[line_num]].toFixed(2) + '</div>';
              }else{
                var contentString = '<div style="font:bold 11px lato; color : white;"> Region : '+ region_filter[region_active[line_num]] +'</div><div style="font:bold 11px lato; color : white;">'+ y_label + ': '+ d[region_active[line_num]] + '</div>';
              }

              tooltip.html(contentString)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px");
            })
          .on('mouseout', function(d){
            $('.node-information').remove();
          })
          .attr("stroke", "black")
    }

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(duration.length).tickFormat(d3.format("d")));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) - 10)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Number of " + y_axis);

    // Add legend
    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 7)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(region_active.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) {return "translate(30," + i * 15 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) {return region_color[d]});

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 5)
        .attr("dy", "0.32em")
        .text(function(d){ return region_filter[d]});

}

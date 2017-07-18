// Chart energy type and number of accidents

// var duration = [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970,1980, 1990, 2000, 2010, 2020];
var year_steps = 5;
// Store array of years
var duration = [];
for(var i = minYear; i <= maxYear; i += year_steps){
  duration.push(i);
}

var energy_type_all = ['Battery', 'Biomass', 'Electricity', 'Fuel cell', 'Geothermal', 'Hydrogen', 'Hydropower', 'LPG', 'Marine', 'Natural gas', 'Non-hydro dam', 'Nuclear', 'Oil', 'Solarthermal', 'Solar photovolatic', 'Wind', 'Not applicable'];
var max_num = 0;

function createEnergyTypeData(){
  accidents_no = [];
  // accidents_no_filter_out = years;
  // if(accidents_no_filter_out != null){
  //   early_year = parseInt(accidents_no_filter_out[0]);
  //   latest_year = parseInt(accidents_no_filter_out[1]);
  //   accidents_no_filter_out = $.map(duration, function(d,i){
  //     if(d < early_year){
  //       return;
  //     }
  //     if(d > latest_year){
  //       return;
  //     }
  //     return d;
  //   })
  // }
  // for(i = 0; i < accidents_no_filter_out.length; i++){
  //   var myObj = new Object();
  //   myObj.year = accidents_no_filter_out[i];
  //   for(j = 0; j < energy_type_active.length; j++){
  //     myObj[energy_type_active[j]] = 0;
  //   }
  //   accidents_no.push(myObj);
  // }
  for(i = 0; i < duration.length; i++){
    var myObj = new Object();
    myObj.year = duration[i];
    for(j = 0; j < energy_type_all.length; j++){
      myObj[energy_type_all[j]] = 0;
    }
    accidents_no.push(myObj);
  }
  var size = Object.keys(data.features).length;
  for(i = 0; i < size; i++){
    var energy_type = data.features[i].properties.energy_chain;
    var filter = energy_type_filter[energy_type];
    if(filter != null) energy_type = filter;
    var incident_date = data.features[i].properties.incident_date;
    var year = incident_date.substring(0,4);
    var index = yearCategory(duration,year);
    if(index == null) continue;
    accidents_no[index][energy_type]++;
    if(accidents_no[index][energy_type] > max_num) max_num = accidents_no[index][energy_type];
  }
}

function createEnergyTypeChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50};
  var width = ($(window).width() * 70/100) - margin.left - margin.right,
  height = ($(window).height() * 40/100) - margin.top - margin.bottom;

  var svg = d3.select("#chart").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var keys = energy_type_active;

  x0.domain(accidents_no.map(function(d) { return d.year; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(accidents_no, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(accidents_no)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return energy_color[d.key]; });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Number of accidents");
}

function createLineChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50};
  var width = ($(window).width() * 70/100) - margin.left - margin.right,
  height = ($(window).height() * 40/100) - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  for(var i = 0; i < energy_type_all.length; i++){
    this['valueline' + i] = d3.line()
        .x(function(d) {
          return x(d.year);
        })
        .y(function(d) { return y(d[energy_type_all[i]]);
      });
  }

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    accidents_no.forEach(function(d) {
        d.year = (+d.year);
        for(var i = 0; i < energy_type_all.length; i++){
          d[energy_type_all[i]] = +d[energy_type_all[i]];
        }
    });

    // Scale the range of the data
    x.domain(d3.extent(accidents_no, function(d) { return d.year; }));
    y.domain([0, d3.max(accidents_no, function(d) {
      return max_num;
      })]
    );

    for(var i = 0; i < energy_type_all.length;i++){
      svg.append("path")
          .data([accidents_no])
          .attr("class", "line" + i)
          .style("stroke", energy_color[energy_type_all[i]])
          .style('fill','none')
          .on('mouseover', function(d){
            console.log(this);
          })
          .attr("d", this['valueline' + i]);
    }

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20).tickFormat(d3.format("d")));
        // .call(d3.axisBottom(x).tickValues([1865,1875,1885,1895,1905,1915,1925,1935,1945,1955,1965,1975,1985,1995,2005,2015]).tickFormat(d3.format("d")));

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
        .text("Number of accidents");

  // Tooltip

  // var mouseG = svg.append("g")
  //     .attr("class", "mouse-over-effects");
  //
  //   mouseG.append("path") // this is the black vertical line to follow mouse
  //     .attr("class", "mouse-line")
  //     .style("stroke", "black")
  //     .style("stroke-width", "1px")
  //     .style("opacity", "0");
  //
  //   var lines = document.getElementsByClassName('line');
  //
  //   var mousePerLine = mouseG.selectAll('.mouse-per-line')
  //     .data(cities)
  //     .enter()
  //     .append("g")
  //     .attr("class", "mouse-per-line");
  //
  //   mousePerLine.append("circle")
  //     .attr("r", 7)
  //     .style("stroke", function(d) {
  //       return color(d.name);
  //     })
  //     .style("fill", "none")
  //     .style("stroke-width", "1px")
  //     .style("opacity", "0");
  //
  //   mousePerLine.append("text")
  //     .attr("transform", "translate(10,3)");
  //
  //   mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
  //     .attr('width', width) // can't catch mouse events on a g element
  //     .attr('height', height)
  //     .attr('fill', 'none')
  //     .attr('pointer-events', 'all')
  //     .on('mouseout', function() { // on mouse out hide line, circles and text
  //       d3.select(".mouse-line")
  //         .style("opacity", "0");
  //       d3.selectAll(".mouse-per-line circle")
  //         .style("opacity", "0");
  //       d3.selectAll(".mouse-per-line text")
  //         .style("opacity", "0");
  //     })
  //     .on('mouseover', function() { // on mouse in show line, circles and text
  //       d3.select(".mouse-line")
  //         .style("opacity", "1");
  //       d3.selectAll(".mouse-per-line circle")
  //         .style("opacity", "1");
  //       d3.selectAll(".mouse-per-line text")
  //         .style("opacity", "1");
  //     })
  //     .on('mousemove', function() { // mouse moving over canvas
  //       var mouse = d3.mouse(this);
  //       d3.select(".mouse-line")
  //         .attr("d", function() {
  //           var d = "M" + mouse[0] + "," + height;
  //           d += " " + mouse[0] + "," + 0;
  //           return d;
  //         });
  //
  //       d3.selectAll(".mouse-per-line")
  //         .attr("transform", function(d, i) {
  //           console.log(width/mouse[0])
  //           var xDate = x.invert(mouse[0]),
  //               bisect = d3.bisector(function(d) { return d.date; }).right;
  //               idx = bisect(d.values, xDate);
  //
  //           var beginning = 0,
  //               end = lines[i].getTotalLength(),
  //               target = null;
  //
  //           while (true){
  //             target = Math.floor((beginning + end) / 2);
  //             pos = lines[i].getPointAtLength(target);
  //             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
  //                 break;
  //             }
  //             if (pos.x > mouse[0])      end = target;
  //             else if (pos.x < mouse[0]) beginning = target;
  //             else break; //position found
  //           }
  //
  //           d3.select(this).select('text')
  //             .text(y.invert(pos.y).toFixed(2));
  //
  //           return "translate(" + mouse[0] + "," + pos.y +")";
  //         });
  //     });

}

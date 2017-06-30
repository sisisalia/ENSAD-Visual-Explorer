function createLineData(){
  accidents_no = [];
  var size = Object.keys(data.features).length;
  for(i = 0; i < size; i++){
    var incident_date = data.features[i].properties.incident_date;
    var year = incident_date.substring(0,incident_date.length - 1);
    if(parseInt(year) < 1860) continue;
    var myObj = new Object();
    myObj.date = year;
    for(j = 0; j < energy_type_active.length; j++){
      myObj[energy_type_active[j]] = 0;
    }
    accidents_no.push(myObj);
  }
  for(i = 0; i < size; i++){
    var energy_type = data.features[i].properties.energy_chain;
    var filter = energy_type_filter[energy_type];
    if(filter != null) energy_type = filter;
    var incident_date = data.features[i].properties.incident_date;
    var year = incident_date.substring(0,incident_date.length - 1);
    for(j = 0; j < accidents_no.length; j++){
      if( accidents_no[j].date == year){
        accidents_no[j][energy_type]++;
        break;
      }
    }
  }
  accidents_no.sort(function(a, b) {
		if (a.date < b.date) {
			return -1;
		}
		else {
			return 1;
		}
	});
}

function createLineChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 150 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x((d.date)); })
      .y(function(d) { return y(d.Hydropower); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d['Non-hydro']); });

  var valueline3 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d['LPG']); });

  var valueline4 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d['Natural gas']); });

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
        d.date = parseTime(d.date);
        d.Hydropower = +d.Hydropower;
        d['Non-hydro'] = +d['Non-hydro'];
        d['LPG'] = +d['LPG'];
        d['Natural gas'] = +d['Natural gas'];
    });

    // Scale the range of the data
    x.domain(d3.extent(accidents_no, function(d) { return d.date; }));
    y.domain([0, d3.max(accidents_no, function(d) {
  	  return Math.max(d.Hydropower, d['Non-hydro']); })]);

    // Add the valueline path.
    svg.append("path")
        .data([accidents_no])
        .attr("class", "line")
        .style("stroke", "blue")
        .style('fill','none')
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([accidents_no])
        .attr("class", "line")
        .style("stroke", "black")
        .style('fill','none')
        .attr("d", valueline2);

    svg.append("path")
        .data([accidents_no])
        .attr("class", "line")
        .style("stroke", "green")
        .style('fill','none')
        .attr("d", valueline3);

    svg.append("path")
        .data([accidents_no])
        .attr("class", "line")
        .style("stroke", "red")
        .style('fill','none')
        .attr("d", valueline4);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}

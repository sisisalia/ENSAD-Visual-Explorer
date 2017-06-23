// Chart energy type and number of accidents

var duration = [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970,1980, 1990, 2000, 2010];

function createEnergyTypeData(){
  accidents_no = [];
  accidents_no_filter_out = years;
  if(accidents_no_filter_out != null){
    early_year = parseInt(accidents_no_filter_out[0]);
    latest_year = parseInt(accidents_no_filter_out[1]);
    accidents_no_filter_out = $.map(duration, function(d,i){
      if(d < early_year){
        return;
      }
      if(d > latest_year){
        return;
      }
      return d;
    })
  }
  for(i = 0; i < accidents_no_filter_out.length; i++){
    var myObj = new Object();
    myObj.year = accidents_no_filter_out[i];
    for(j = 0; j < energy_type_active.length; j++){
      myObj[energy_type_active[j]] = 0;
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
    var index = yearCategory(accidents_no_filter_out,year);
    if(index == null) continue;
    accidents_no[index][energy_type]++;
  }
}

function createEnergyTypeChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 150 - margin.top - margin.bottom;

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

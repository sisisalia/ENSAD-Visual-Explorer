// Chart regions versus year
var regionsColor = {
  'oecd' : '#8CC841',
  'g20' : 'purple',
  'non_oecd' : 'lightblue',
  'eu28' : 'yellow',
}

var regions = ['oecd', 'g20', 'eu28', 'non_oecd'];

function createRegionsData(){
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
    for(j = 0; j < regions.length; j++){
      myObj[regions[j]] = 0;
    }
    accidents_no.push(myObj);
  }
  var size = Object.keys(data.features).length;
  for(i = 0; i < size; i++){
    var incident_date = data.features[i].properties.incident_date;
    var year = incident_date.substring(0,4);
    var index = yearCategory(accidents_no_filter_out,year);
    if(index == null) continue;
    for(j = 0; j < regions.length; j++){
      if(data.features[i].properties[regions[j]] == 1){
        accidents_no[index][regions[j]]++;
      }
    }
  }
}

function createRegionsChart(){
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

  var keys = regions;

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
      .attr("fill", function(d) { return regionsColor[d.key]; });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

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
      .text("Number of accidents");

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
      .attr("fill", function(d) {return regionsColor[d]});

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(function(d) {
        if(d == 'non_oecd'){
          return 'Non-OECD';
        }
        if(d == 'g20'){
          return 'G20';
        }
        if(d == 'eu28'){
          return 'EU';
        }
        if(d == 'oecd'){
          return 'OECD';
        }
       });
}

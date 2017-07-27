// Purpose : Creating data for regions chart according to number of accidents/fatalities/injuries/evacuees/economics

// Store data for the region chart
var regions_chart_data;
// To store the maximum number to limit the y axis
var region_max_accidents = 0;
var region_max_fatalities = 0;
var region_max_injuries = 0;
var region_max_evacuees = 0;
var region_max_economics = 0;

// log == either null or 1
// If log == 1, hence the scaling is log scale
function createRegionsChartData(log){
  // Initialize the variables
  regions_chart_data = {
    'accidents' : [],
    'fatalities' : [],
    'injuries' : [],
    'evacuees' : [],
    'economics' : [],
  };
   region_max_accidents = 0;
   region_max_fatalities = 0;
   region_max_injuries = 0;
   region_max_evacuees = 0;
   region_max_economics = 0;

  var regions_chart_data_size = Object.keys(regions_chart_data).length;
  // Initialize data
  var temp = [];
  // Get the range of year active currently
  for(var i = 0; i < duration.length; i++){
    var myObj = new Object();
    // For each year create an object fills with regions active currently
    for(var j = 0; j < region_active.length; j++){
      myObj[region_active[j]] = 0;
    }
    myObj.year = duration[i];
    temp.push(myObj);
  }
  // Copy the skeleton of the data(myObj)
  for(var i = 0; i < regions_chart_data_size; i++){
    regions_chart_data[Object.keys(regions_chart_data)[i]] = JSON.parse(JSON.stringify(temp));
  }
  var size = Object.keys(data.features).length;
  for(i = 0; i < size; i++){
    // Exclude data accordingly according to the filter, except for severity range filter
    var exclude = excludeData(i, 1);
    if(exclude == -1) continue;
    var selected = data.features[i].properties;
    var incident_date = selected.incident_date;
    var year = parseInt(incident_date.substring(0,4));
    var index = yearCategory(year);
    if(index == null) continue;
    // Increment the number accordingly and set the maximum
    for(var j = 0 ; j < region_active.length; j++){
      if(selected[region_active[j]]){
        regions_chart_data.accidents[index][region_active[j]]++;
        if(regions_chart_data.accidents[index][region_active[j]] > region_max_accidents) region_max_accidents = regions_chart_data.accidents[index][region_active[j]];
        var fatalities = selected.fatalities;
        if(fatalities != null){
          regions_chart_data.fatalities[index][region_active[j]] += parseInt(fatalities);
          if(regions_chart_data.fatalities[index][region_active[j]] > region_max_fatalities) region_max_fatalities = regions_chart_data.fatalities[index][region_active[j]];
        }
        var injuries = selected.injuries;
        if(injuries != null){
          regions_chart_data.injuries[index][region_active[j]] += parseInt(injuries);
          if(regions_chart_data.injuries[index][region_active[j]] > region_max_injuries) region_max_injuries = regions_chart_data.injuries[index][region_active[j]];
        }
        var evacuees = selected.evacuees;
        if(evacuees != null){
          regions_chart_data.evacuees[index][region_active[j]] += parseInt(evacuees);
          if(regions_chart_data.evacuees[index][region_active[j]] > region_max_evacuees) region_max_evacuees = regions_chart_data.evacuees[index][region_active[j]];
        }
        var economics = selected.economic_damage;
        if(economics != null){
          regions_chart_data.economics[index][region_active[j]] += parseInt(economics);
          if(regions_chart_data.economics[index][region_active[j]] > region_max_economics) region_max_economics = regions_chart_data.economics[index][region_active[j]];
        }
      }
    }
  }

  // if it is a log scale, log the value obtains from above
  if(log){
    // Re-initialized the maximum
    region_max_accidents = 0;
    region_max_fatalities = 0;
    region_max_injuries = 0;
    region_max_evacuees = 0;
    region_max_economics = 0;
    for(var i = 0; i < regions_chart_data_size; i++){
      var key = Object.keys(regions_chart_data)[i];
      for(var j = 0; j < regions_chart_data[key].length; j++){
        var select = regions_chart_data[key][j];
        $.map(select, function(d,i){
          if(d == 0) return;
          if(i == 'year') return;
          select[i] = Math.log10(d);
          if(select[i] > window['region_max_'+ key]){
            window['region_max_' + key] = select[i];
          };
        })
      }
    }
  }
}

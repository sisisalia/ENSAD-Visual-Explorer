// Purpose : Creating data for energy type chart according to number of accidents/fatalities/injuries/evacuees/economics

// Store data for the energy type chart
var energy_types_chart_data;
// To store the maximum number to limit the y axis
var energy_max_accidents;
var energy_max_fatalities;
var energy_max_injuries;
var energy_max_evacuees;
var energy_max_economics;

// log == either null or 1
// If log == 1, hence the scaling is log scale
function createEnergyTypeChartData(log){
  // Initialize the variables
  energy_types_chart_data = {
    'accidents' : [],
    'fatalities' : [],
    'injuries' : [],
    'evacuees' : [],
    'economics' : [],
  };
   energy_max_accidents = 0;
   energy_max_fatalities = 0;
   energy_max_injuries = 0;
   energy_max_evacuees = 0;
   energy_max_economics = 0;
   energy_types_chart_data_size = Object.keys(energy_types_chart_data).length;
  // Initialize data
  var temp = [];
  // Get the range of year active currently
  for(var i = 0; i < duration.length; i++){
    var myObj = new Object();
    // For each year create an object fills with energy type active currently
    for(j = 0; j < energy_type_active.length; j++){
      myObj[energy_type_active[j]] = 0;
    }
    myObj.year = duration[i];
    temp.push(myObj);
  }
  // Copy the skeleton of the data(temp)
  for(var i = 0; i < energy_types_chart_data_size; i++){
    energy_types_chart_data[Object.keys(energy_types_chart_data)[i]] = JSON.parse(JSON.stringify(temp));
  }
  var size = Object.keys(data.features).length;
  for(i = 0; i < size; i++){
    // Exclude data accordingly according to the filter, except for severity range filter
    var exclude = excludeData(i, 1);
    if(exclude == -1) continue;
    var selected = data.features[i].properties;
    var energy_type = selected.energy_chain;
    var filter = energy_type_filter[energy_type];
    if(filter != null) energy_type = filter;
    var incident_date = selected.incident_date;
    var year = parseInt(incident_date.substring(0,4));
    var index = yearCategory(year);
    if(index == null) continue;
    // Increment the number accordingly and set the maximum
    energy_types_chart_data.accidents[index][energy_type]++;
    if(energy_types_chart_data.accidents[index][energy_type] > energy_max_accidents) energy_max_accidents = energy_types_chart_data.accidents[index][energy_type];
    var fatalities = selected.fatalities;
    if(fatalities != null){
      energy_types_chart_data.fatalities[index][energy_type] += parseInt(fatalities);
      if(energy_types_chart_data.fatalities[index][energy_type] > energy_max_fatalities) energy_max_fatalities = energy_types_chart_data.fatalities[index][energy_type];
    }
    var injuries = selected.injuries;
    if(injuries != null){
      energy_types_chart_data.injuries[index][energy_type] += parseInt(injuries);
      if(energy_types_chart_data.injuries[index][energy_type] > energy_max_injuries) energy_max_injuries = energy_types_chart_data.injuries[index][energy_type];
    }
    var evacuees = selected.evacuees;
    if(evacuees != null){
      energy_types_chart_data.evacuees[index][energy_type] += parseInt(evacuees);
      if(energy_types_chart_data.evacuees[index][energy_type] > energy_max_evacuees) energy_max_evacuees = energy_types_chart_data.evacuees[index][energy_type];
    }
    var economics = selected.economic_damage;
    if(economics != null){
      energy_types_chart_data.economics[index][energy_type] += parseInt(economics);
      if(energy_types_chart_data.economics[index][energy_type] > energy_max_economics) energy_max_economics = energy_types_chart_data.economics[index][energy_type];
    }
  }

  // if it is a log scale, log the value obtains from above
  if(log){
    // Re-initialized the maximum
    energy_max_accidents = 0;
    energy_max_fatalities = 0;
    energy_max_injuries = 0;
    energy_max_evacuees = 0;
    energy_max_economics = 0;
    for(var i = 0; i < energy_types_chart_data_size; i++){
      var key = Object.keys(energy_types_chart_data)[i];
      for(var j = 0; j < energy_types_chart_data[key].length; j++){
        var select = energy_types_chart_data[key][j];
        $.map(select, function(d,i){
          if(d == 0) return;
          if(i == 'year') return;
          select[i] = Math.log10(d);
          if(select[i] > window['energy_max_'+ key]){
            window['energy_max_' + key] = select[i];
          };
        })
      }
    }
  }
}

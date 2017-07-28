/*
Purpose:
1. Overlay circles with its tooltip on the map
2. Call for 'overlay-piechart.js' and 'overlay-overlapping-markers.js'
3. Filtering data
*/
function overlayMarkers() {
    var overlay = new google.maps.OverlayView();
    zoom_level = map.getZoom();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");
        // Get the projection of the map
        projection = this.getProjection();
        // Set radius of the circle
        var radius = circle_size['Level 0'];

        var filtered_data = filterData();
        // If there is no need for cluster, set the distance to 0
        var minDistance = zoom[zoom_level];
        if(minDistance == null) minDistance = 0;
        // Dbscan
        var clustered = dbscanCenterDistance(filtered_data, minDistance);
        // Array of objects which does not need to cluster
        var single_icon = [];
        // Separate the data for pie chart or circle
        for(var i = 0; i < clustered.length; i++){
          // Data for circle
          if(clustered[i].length == 1){
            var obj = setIndividualPoint(clustered[i][0]);
            single_icon.push(obj);
          }else{
          // Data for cluster
            // Data to be passed to create a pie chart
            var array = [];
            var length;
            // an array of average position where the pie chart will be put on the map
            var average_position = getAveragePosition(clustered[i]);
            // For each object in a cluster, set the object information needed
            for (var j = 0; j < clustered[i].length; j++) {
                var obj = new Object();
                obj.average_position = average_position;
                // Indicate number of objects in a cluster
                if (j == clustered[i].length - 1) {
                    length = clustered[i].length;
                }
                obj.coordinates = clustered[i][j].geometry.coordinates;
                obj = setIndividualPoint(clustered[i][j], obj);
                array.push(obj);
            }
            // To make sure that the text will render last so it will be on top of the pie chart
            array[array.length-1].length = length;
            // 'piechartrad' == Average damage level
            var accumulated = 0;
            var final;
            $.map(array, function(d,i){
              if(i == array.length - 1){
                accumulated += parseInt(d[damage_filter[damage_selected]].substring(6, d[damage_filter[damage_selected]].length));
                final = Math.round(accumulated/array.length);
              }else{
                accumulated += parseInt(d[damage_filter[damage_selected]].substring(6, d[damage_filter[damage_selected]].length));
              }
            })
            array[array.length-1].piechartrad = circle_size['Level ' + final];
            if(isNaN(array[array.length-1].piechartrad)){
              array[array.length-1].piechartrad = circle_size['NA'];
            }
            // If zoom level is more than half of the maximum zoom level, split up the clustered nodes accordingly
            if (zoom_level < opt.maxZoom) {
                overlayPieChart(array);
            } else {
                overlayOverlappingMarkers(array);
            }
          }
        }

        // Draw each marker as a separate SVG element
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
                // Set up individual markers
                var marker = layer.selectAll("svg")
                    .data(single_icon)
                    .enter().append("svg")
                    .attr('width', function(d){
                      if(damage_active == 1){
                        return d.radbydamage * 2;
                      }else{
                        return radius * 2;
                      }
                    })
                    .attr('height', function(d){
                      if(damage_active == 1){
                        return d.radbydamage * 2;
                      }else{
                        return radius * 2;
                      }
                    })
                    .style("left", function(d) {
                      if(damage_active == 1){
                        return ((d.geodata.x - d.radbydamage) + "px");
                      }else{
                        return ((d.geodata.x - radius) + "px");
                      }
                    })
                    .style("top", function(d) {
                      if(damage_active == 1){
                        return ((d.geodata.y - d.radbydamage) + "px");
                      }else{
                        return ((d.geodata.y - radius) + "px");
                      }
                    })
                    .attr('class', function(d) {
                        return 'marker';
                    })
                    .on("mouseover", function(d) {
                        // Tooltip
                        var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "node-information")
                            .style('position', 'absolute');

                        var contentString = '<div style="font:bold 11px lato"> Accident id: ' + d.id + '</div>';

                        energy_chain_src = energy_chain_image_color[d.stage];

                        if (energy_chain_src != null) {
                            contentString += '<div style="padding:3px;"><img src="' + energy_type_image_color[d.type] + '" width="15" height="15"> <img src="' + energy_chain_src + '" width="15" height="15"></div>';
                        } else {
                            contentString += '<div style="padding:3px;"><img src="' + energy_type_image_color[d.type] + '" width="15" height="15"></div>';
                        }

                        // Bar tooltip
                        // var damage = ['fatalities', 'injuries', 'evacuees','economic_damage'];
                        //
                        // for(var i = 0; i < damage.length; i++){
                        //   if(d[damage[i]] == 'NA') {
                        //     window['bar' + i] = 'NA';
                        //   }else{
                        //     var level = d[damage[i]];
                        //     var num = parseInt(level[level.length - 1]);
                        //     var color = [];
                        //     for(var j = 0; j < 6; j++){
                        //       if(j <= num){
                        //         color.push('#87A1B1');
                        //       }else{
                        //         color.push('white');
                        //       }
                        //     }
                        //     window['bar' + i]= '<table class="bar'+ i +'"><tr><td class="text-center" style="font-style:italic; padding-top:2px;">Low</td><td><svg width="60" height="10" style="margin-top:5px; padding-left:5px;">' +
                        //       '<rect x="0" y="0" width="10" height="10" style="fill:'+ color[1] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
                        //       '<rect x="10" y="0" width="10" height="10" style="fill:' + color[2] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
                        //       '<rect x="20" y="0" width="10" height="10" style="fill:'+ color[3] + ';stroke-width:1;stroke:rgb(0,0,0)" />' +
                        //       '<rect x="30" y="0" width="10" height="10" style="fill:'+ color[4] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
                        //       '<rect x="40" y="0" width="10" height="10" style="fill:'+ color[5] + ';stroke-width:1;stroke:rgb(0,0,0)" />' +
                        //     '</svg></td><td  class="text-center" style="font-style:italic; padding-top:2px;">High</td></tr></table>';
                        //   }
                        // }
                        //
                        // contentString += '<table>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Location</td><td style="font:10px lato">' + d.location + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Fatalities</td><td style="font:10px lato">' + bar0 + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Injuries</td><td style="font:10px lato">' + bar1 + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Evacuees</td><td style="font:10px lato">' + bar2 + '</td></tr>' +
                        // '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Economic damage</td><td style="font:10px lato">' + bar3 + '</td></tr>' +
                        // '</table>';

                        // Text tooltip
                        contentString += '<table>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Location</td><td style="font:10px lato">' + d.location + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Fatalities</td><td style="font:10px lato">' + d.fatalities + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Injuries</td><td style="font:10px lato">' + d.injuries + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Evacuees</td><td style="font:10px lato">' + d.evacuees + '</td></tr>' +
                        '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Economic damage</td><td style="font:10px lato">' + d.economic_damage + '</td></tr>' +
                        '</table>';

                        tooltip.html(contentString)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px");
                    })
                    .on("mouseout", function(d) {
                        $('.node-information').remove();
                    });

                // Add a circle.
                var circle = marker.append("circle")
                    .attr("r", function(d){
                      if(damage_active == 1){
                        return d.radbydamage;
                      }else{
                        return radius;
                      }
                    })
                    .attr('fill', function(d) {
                        return energy_color[d.type];
                    })
                    .attr('stroke', 'transparent')
                    .attr("cx", function(d){
                      if(damage_active == 1){
                        return d.radbydamage;
                      }else{
                        return radius;
                      }
                    })
                    .attr("cy", function(d){
                      if(damage_active == 1){
                        return d.radbydamage;
                      }else{
                        return radius;
                      }
                    })
                    .attr('class', function(d) {
                        return 'node';
                    });

                // Overlay images on top of the circle
                var image = marker.append("svg:image")
                    .attr("xlink:href", function(d) {
                      // Image changes depending if the user clicked 'More' or others menu tab
                        if (energy_chain_active == 1) {
                            result = energy_chain_image_white[d.stage];
                            if(result == undefined){
                              return energy_type_image_white[d.type];
                            }else{
                              return result;
                            }
                        }
                        else {
                            return energy_type_image_white[d.type];
                        }
                    })
                    .attr("height", function(d){
                      if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable') || (d.type == 'Solar photovolatic') || (energy_chain_active == 1 && d.stage == 'Domestic and commercial end use')){
                        return radius * 2 - 6;
                      }
                      return radius * 2
                    })
                    .attr("width", function(d){
                      if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable') || (d.type == 'Solar photovolatic') || (energy_chain_active == 1 && d.stage == 'Domestic and commercial end use')){
                        return radius * 2 - 6;
                      }
                      return radius * 2
                    })
                    .attr("x", function(d){
                      if(damage_active == 1){
                        // Due to different size of images, adjustment need to be make
                        if((d.type == 'Non-hydro dam') || (d.type == 'Solar photovolatic') || (d.type == 'Not applicable')){
                        return d.radbydamage - radius + 3;
                      }else{
                        return d.radbydamage - radius;
                      }
                      }else{
                        if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable') || (d.type == 'Solar photovolatic') || (energy_chain_active == 1 && d.stage == 'Domestic and commercial end use')){
                        return 3;
                        }else{
                        return 0;
                        }
                      }
                    })
                    .attr("y", function(d){
                      if(damage_active == 1){
                        if((d.type == 'Non-hydro dam') || (d.type == 'Solar photovolatic') || (d.type == 'Not applicable')){
                        return d.radbydamage - radius + 3;
                      }else{
                        return d.radbydamage - radius;
                      }
                      }else{
                        if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable') || (d.type == 'Solar photovolatic') || (energy_chain_active == 1 && d.stage == 'Domestic and commercial end use')){
                        return 3;
                        }else{
                        return 0;
                        }
                      }
                    })
                    .attr('class', 'node');
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

// Filter data according to user's choice
// Return an array of objects where each object has keys : x,y,lon,lat,index
function filterData() {
    var result = [];
    for (var i = 0; i < data_size; i++) {
        var exclude = excludeData(i);
        if(exclude == -1) continue;
        // Create an object
        var obj = new Object();
        d = new google.maps.LatLng(data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]);
        // Translate geographic coordinates to coordinates of the map
        d = projection.fromLatLngToDivPixel(d);
        // x y, coordinates of the object on the map
        obj.x = d.x;
        obj.y = d.y;
        // latitude and longitude of the object
        obj.lat = data.features[i].geometry.coordinates[1];
        obj.lon = data.features[i].geometry.coordinates[0];
        // index of the object in 'data' variable
        obj.index = i;
        result.push(obj);
    }
    return result;
}

// 'node' == contains original data and its geodata information
// 'existing_object' == if there is already existing object submitted, add the information to existing object
// Return an object contains information needed for visualization
function setIndividualPoint(node, existing_object){
  if(!existing_object){
    obj = new Object();
  }else{
    obj = existing_object;
  }
  obj.geodata = node.geodata;
  obj.type = node.properties.energy_chain;
  if (obj.type == null) obj.type = 'NA';
  var filter = energy_type_filter[obj.type];
  if (filter != null) obj.type = filter;
  var selected = node.properties;
  obj.year = selected.incident_date.substring(0, 4);
  if(parseInt(obj.year) == 1000){
    obj.year = 'NA';
  }
  // If location is not available in the data, use country instead
  obj.location = selected.location;
  if (obj.location == null) obj.location = selected.country;
  obj.stage = selected.energy_chain_stage;
  if (obj.stage == null) obj.stage = 'NA';
  filter = energy_chain_filter[obj.stage];
  if(filter != null) obj.stage = filter;
  obj.infrastructure = selected.infra_type;
  if (obj.infrastructure == null) obj.infrastructure = 'NA';
  var fatalities = selected.fatalities;
  obj.fatalities = severityLevel(parseInt(fatalities), severity_level_fatalities);
  var injuries = selected.injuries;
  obj.injuries = severityLevel(parseInt(injuries), severity_level_injuries);
  var evacuees = selected.evacuees;
  obj.evacuees = severityLevel(parseInt(evacuees), severity_level_evacuees);
  var economic_damage = selected.economic_damage;
  obj.economic_damage = severityLevel(parseInt(economic_damage), severity_level_economic_damage);
  obj.id = selected.accident_id;
  // if there is an existing object, use piechartrad instead
  if(!existing_object){
    if(damage_active == 1){
      // Since spill size attribute is not available in 'data'
      if(damage_selected == 'Spill size') obj.radbydamage = null;
      // radius to be used if 'Damage' menu is clicked
      obj.radbydamage = circle_size[obj[damage_filter[damage_selected]]];
    }
  }else{
    obj.radbydamage = null;
  }
  return obj;
}

// 'num' == number of damages from 'data' variable
// 'severity_type' == JSON object passed according to severity type from 'init.js' (eg. severity_level_fatalities, severity_level_evacuees)
// Return severity level accordingly
function severityLevel(num, severity_type) {
    if (isNaN(num)) return 'NA';
    if (num == 0) return 'Level 0';
    if (num <= severity_type[1]) return 'Level 1';
    if (num <= severity_type[2]) return 'Level 2';
    if (num <= severity_type[3]) return 'Level 3';
    if (num <= severity_type[4]) return 'Level 4';
    return 'Level 5';
}

// 'cluster' == contains an array of objects which are in one cluster
// return an array of average position found
function getAveragePosition(cluster) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < cluster.length; i++) {
        x += cluster[i].geodata.x;
        y += cluster[i].geodata.y;
    }
    x = x / cluster.length;
    y = y / cluster.length;
    var array = [x, y];
    return array;
}

function resetMarkers() {
    $('.markers').remove();
    zoom_level = map.getZoom();
    overlayMarkers();
}

// Exclude out the data according to the filter
// i == the index in variable 'data'
// without_severity == whether to filter severity level or not
// If set as 1, do not filter severity level
// If set as null, filter severity level
function excludeData(i, without_severity){
  var result = 0;
  var selected = data.features[i].properties;
  // Year filter
  var incident_year = parseInt(selected.incident_date.substring(0,4));
  // If incident year == 1000 in the data, changed it to 'NA'
  if(incident_year == 1000){
    selected.incident_date = 'NA';
    incident_year = 'NA';
  }
  // Always include 'NA' despite the filtering
  if(years && incident_year != 'NA'){
    if(incident_year < years[0]) result = -1;
    if(incident_year > years[1]) result = -1;
  }
  // Energy type filter
  var energy_type = selected.energy_chain;
  if (energy_type == null) energy_type = 'NA';
  var filter = energy_type_filter[energy_type];
  if (filter != null) energy_type = filter;
  var index = energy_type_active.indexOf(energy_type);
  if (index == -1) result = -1;
  // Energy stage filter
  var stage = selected.energy_chain_stage;
  if(stage == null) stage = 'NA';
  filter = energy_chain_filter[stage];
  if(filter != null) stage = filter;
  index = energy_chain_filter_out.indexOf(stage);
  if(index != -1) result = -1;
  // Region filter
  var region_filter_out = ['oecd', 'non_oecd', 'eu28', 'g20'];
  region_filter_out = region_filter_out.filter(function(x) { return region_active.indexOf(x) < 0 })
  for(var j = 0; j < region_filter_out.length; j++){
    var check = selected[region_filter_out[j]];
    if(check == true) break;
  }
  if(check == true) result = -1;
  if(without_severity) return result;
  // Severity level check
  if(damage_active == 1){
    // Get severity number
    var severity = selected[damage_filter[damage_selected]];
    // Changed to severity level
    var severity_lvl = severityLevel(parseInt(severity), window['severity_level_' + damage_filter[damage_selected]]);
    // Always include NA
    if(severity_level_included.indexOf(severity_lvl) == -1 && severity_lvl != 'NA') result = -1;
  }
  return result;
}

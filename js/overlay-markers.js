overlayMarkers();

function overlayMarkers() {
    var overlay = new google.maps.OverlayView();
    // Add the container when the overlay is added to the map

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");
        // Draw each marker as a separate SVG element
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
            // Array of (x,y) point of every nodes
            clustered_points_location = [];
            // Array of information of every nodes. Indexes are matched with clustered_points_location
            clustered_points_information = [];

            var projection = this.getProjection(),
                radius = 10;

            // If-condition to prevent clustering algorithm to work during translation
            if (new_map == 1) {
                // Prepare data of clustered_points_location and clustered_points_information for dbscan clustering
                setClusterPoint(projection);

                // DBSCAN
                var dbscan = new DBSCAN();
                // Get the indexes of the clustered group
                var clusters = dbscan.run(clustered_points_location, zoom[zoom_level], 2);

                var single_icon = [];
                for (var i = 0; i < dbscan.noise.length; i++) {
                    // Set individual point such that it contains the data needed
                    var obj = setIndividualPoint(clustered_points_location, clustered_points_information, dbscan.noise[i]);
                    single_icon.push(obj);
                }
                for (var i = 0; i < clusters.length; i++) {
                    var array = [];
                    var added = 0;
                    var average_position = getAveragePosition(clusters[i], clustered_points_location);
                    for (var j = 0; j < clusters[i].length; j++) {
                        var obj = new Object();
                        obj.average_position = average_position;
                        obj.exact_position = clustered_points_location[clusters[i][j]];
                        if (added == 0) {
                            obj.length = clusters[i].length;
                            added = 1;
                        }
                        obj.coordinates = clustered_points_information[clusters[i][j]].geometry.coordinates;
                        obj = setIndividualPoint(clustered_points_location, clustered_points_information, clusters[i][j], obj);
                        array.push(obj);
                    }
                    // Sort cluster where same energy type are next to one another
                    array.sort(function(a, b) {
                        var x = a.type;
                        var y = b.type;
                        return (x < y) ? -1 : (x > y) ? 1 : 0;
                    })
                    // If zoom level is more than 7, split up the clustered nodes accordingly
                    if (zoom_level < opt.maxZoom - 3) {
                        overlayPieChart(array);
                    } else {
                        overlayOverlappingMarkers(array);
                    }
                }

                // Set up individual markers
                var marker = layer.selectAll("svg")
                    .data(single_icon)
                    .enter().append("svg")
                    .attr('width', radius * 2 + 3)
                    .attr('height', radius * 2 + 3)
                    .style("left", function(d) {
                        return ((d.location[0] - radius) + "px")
                    })
                    .style("top", function(d) {
                        return ((d.location[1] - radius) + "px")
                    })
                    .attr('class', function(d) {
                        return 'marker';
                    });

                // Add a circle.
                var circle = marker.append("circle")
                    .attr("r", radius)
                    .attr('fill', function(d) {
                        var type = energy_type_filter[d.type];
                        if (type != null) return energy_color[type];
                        else {
                            return energy_color[d.type];
                        }
                    })
                    .attr('stroke', 'white')
                    .attr('strokeWeight', '1px')
                    .attr("cx", radius)
                    .attr("cy", radius)
                    .attr('class', function(d) {
                        return 'node';
                    });

                // Overlay images on top of the circle
                var images = marker.append("svg:image")
                    .attr("xlink:href", function(d) {
                      // Image changes depending if the user clicked 'More' or others menu tab
                        if (energy_chain_selected == 1) {
                            energy_chain_src = energy_chain_image_white[energy_chain_filter[d.stage]];
                            if (energy_chain_src != null) return energy_chain_src;
                        }
                        var type = energy_type_filter[d.type];
                        if (type != null) return energy_type_image_white[type];
                        else {
                            return energy_type_image_white[d.type];
                        }
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", radius * 2)
                    .attr("width", radius * 2)
                    .attr('class', 'node')
                    .on("mouseover", function(d) {
                        // Tooltip
                        var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "node-information")
                            .style('position', 'absolute');

                        tooltip.transition()
                            .duration(50)
                            .style("opacity", .9);
                        var energy_chain_src = energy_chain_image_color[energy_chain_filter[d.stage]];
                        if (energy_chain_src != null) {
                            var contentString = '<div style="font:bold 11px lato"> Accident id: ' + d.id + '</div>' +
                                '<div style="padding:3px;"><img src="' + energy_type_image_color[d.type] + '" width="15" height="15"> <img src="' + energy_chain_src + '" width="15" height="15"></div>' +
                                '<table>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Location</td><td style="font:10px lato">' + d.location_country + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Fatalities</td><td style="font:10px lato">' + d.fatalities + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Injured</td><td style="font:10px lato">' + d.injured + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Evacuees</td><td style="font:10px lato">' + d.evacuees + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + d.economic + '</td></tr>' +
                                '</table>';
                        } else {
                            var contentString = '<div style="font:bold 11px lato"> Accident id: ' + d.id + '</div>' +
                                '<div style="padding:3px;"><img src="' + energy_type_image_color[d.type] + '" width="15" height="15"></div>' +
                                '<table>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Location</td><td style="font:10px lato">' + d.location_country + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Fatalities</td><td style="font:10px lato">' + d.fatalities + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Injured</td><td style="font:10px lato">' + d.injured + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Evacuees</td><td style="font:10px lato">' + d.evacuees + '</td></tr>' +
                                '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + d.economic + '</td></tr>' +
                                '</table>';
                        }
                        tooltip.html(contentString)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px");
                    })
                    .on("mouseout", function(d) {
                        $('.node-information').remove();
                    })
                    .style("left", function(d) {
                        return ((d.location[0] - radius) + "px")
                    })
                    .style("top", function(d) {
                        return ((d.location[1] - radius) + "px")
                    });
                new_map = 0;
            }
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

function setClusterPoint(projection) {
    var size = Object.keys(data.features).length;
    for (var i = 0; i < size; i++) {
        var energy_type = data.features[i].properties.energy_chain;
        if (energy_type == null) energy_type = 'NA';
        var filter = energy_type_filter[energy_type];
        if (filter != null) energy_type = filter;
        // Filter
        var index = energy_type_active.indexOf(energy_type);
        if (index == -1) continue;
        var obj = [];
        d = new google.maps.LatLng(data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]);
        d = projection.fromLatLngToDivPixel(d);
        obj.push(d.x);
        obj.push(d.y);
        clustered_points_location.push(obj);
        var obj = data.features[i];
        clustered_points_information.push(obj);
    }
}

function setIndividualPoint(clustered_points_location, clustered_points_information, index, existing_object){
  if(!existing_object){
    obj = new Object();
  }else{
    obj = existing_object;
  }
  obj.location = clustered_points_location[index];
  obj.type = clustered_points_information[index].properties.energy_chain;
  if (obj.type == null) obj.type = 'NA';
  var filter = energy_type_filter[obj.type];
  if (filter != null) obj.type = filter;
  var selected = clustered_points_information[index].properties;
  obj.year = selected.incident_date.substring(0, 4);
  obj.location_country = selected.location;
  if (obj.location_country == null) obj.location_country = selected.country;
  obj.stage = selected.energy_chain_stage;
  if (obj.stage == null) obj.stage = 'NA';
  obj.infrastructure = selected.infra_type;
  if (obj.infrastructure == null) obj.infrastructure = 'NA';
  var fatalities = selected.fatalities;
  obj.fatalities = severityLevel(parseInt(fatalities), severity_level_fatalities);
  var injured = selected.injuries;
  obj.injured = severityLevel(parseInt(injured), severity_level_injured);
  var evacuees = selected.evacuees;
  obj.evacuees = severityLevel(parseInt(evacuees), severity_level_evacuees);
  var economic = selected.economic_damage;
  obj.economic = severityLevel(parseInt(economic), severity_level_economics);
  obj.id = selected.accident_id;
  return obj;
}

function getAveragePosition(clusters, clustered_points) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < clusters.length; i++) {
        x += clustered_points[clusters[i]][0];
        y += clustered_points[clusters[i]][1];
    }
    x = x / clusters.length;
    y = y / clusters.length;
    var array = [x, y];
    return array;
}

function resetMarkers() {
    $('.markers').remove();
    new_map = 1;
    zoom_level = map.getZoom();
    overlayMarkers();
}

function severityLevel(num, severity_level) {
    if ((num == 0) || (isNaN(num))) return 'Level 0';
    if (num <= severity_level[1]) return 'Level 1';
    if (num <= severity_level[2]) return 'Level 2';
    if (num <= severity_level[3]) return 'Level 3';
    if (num <= severity_level[4]) return 'Level 4';
    return 'Level 5';
}

google.maps.event.addListener(map, 'zoom_changed', function() {
    $('.markers').remove();
    if (map.getZoom() == 10) {
        $("div[title='Zoom in']").css("opacity", "0.5").css('cursor', 'not-allowed');
    } else {
        $("div[title='Zoom in']").css("opacity", "1").css('cursor', 'pointer');
    }
    if (map.getZoom() == 3) {
        $("div[title='Zoom out']").css("opacity", "0.5").css('cursor', 'not-allowed');
    } else {
        $("div[title='Zoom out']").css("opacity", "1").css('cursor', 'pointer');
    }
    $('.node-information').remove();
    // Set timer for the broswer to respond correctly, if not the visualization could become a mess
    setTimeout(function() {
        resetMarkers();
    }, 100);
});

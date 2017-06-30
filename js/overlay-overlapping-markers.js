function overlayOverlappingMarkers(array) {
    var increment = 360 / array.length;
    var angle = 0;
    var radius = circle_size['Level 0'];
    var max_radius = circle_size['Level 5'];
    var padding = 100;

    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");
        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
            var marker = layer.selectAll("svg")
                .data(array)
                .enter().append("svg")
                .attr('width', function(d){
                    return max_radius + padding + 5;
                })
                .attr('height', function(d){
                    return max_radius * 2 + 3;
                })
                // .style('border','1px solid black')
                .style("left", function(d) {
                      return ((d.exact_position[0] - max_radius - padding + 8.5) + "px")
                })
                .style("top", function(d) {
                    return ((d.exact_position[1] - max_radius) + "px")
                })
                .attr('transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    return 'rotate(' + rotate + ', ' + (max_radius - 7) + ', ' + '0' + ')'; // 6.5 due to 5 + 3/2
                })
                .attr('class', function(d) {
                    return 'marker';
                });

            angle = 0;

            // Add a circle.
            var circle = marker.append("circle")
                .attr("r", function(d){
                  if(damage_active == 1){
                    return circle_size[d[damage_filter[damage_selected]]];
                  }else{
                    return radius;
                  }
                })
                .attr('fill', function(d) {
                    var type = energy_type_filter[d.type];
                    if (type != null) return energy_color[type];
                    else {
                        return energy_color[d.type];
                    }
                })
                .attr('stroke', 'transparent')
                .attr('strokeWeight', '1px')
                .attr("cx", function(d){
                  return max_radius;
                })
                .attr("cy", function(d){
                  return (max_radius * 2 + 3)/2;
                });

            var images = marker.append("svg:image")
                .attr("xlink:href", function(d) {
                    if (energy_chain_active == 1) {
                        energy_chain_src = energy_chain_image_white[energy_chain_filter[d.stage]];
                        if (energy_chain_src != null) return energy_chain_src;
                    }
                    var type = energy_type_filter[d.type];
                    if (type != null) return energy_type_image_white[type];
                    else {
                        return energy_type_image_white[d.type];
                    }
                })
                .attr("x", function(d){
                  if((d.type == 'Non-hydro') || (d.type == 'NA')){
                    return max_radius - radius + 3;
                  }
                  return max_radius - radius;
                })
                .attr("y", function(d){
                  if((d.type == 'Non-hydro') || (d.type == 'NA')){
                    return (max_radius * 2 + 3)/2 - radius + 3;
                  }
                  return (max_radius * 2 + 3)/2 - radius;
                })
                .attr('transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    return 'rotate(' + (-rotate ) + ', ' + (max_radius) + ', ' + (max_radius+1.5) + ')';
                })
                .attr("height", function(d){
                  if((d.type == 'Non-hydro') || (d.type == 'NA')){
                    return 10;
                  }
                  return 17;
                })
                .attr("width", function(d){
                  if((d.type == 'Non-hydro') || (d.type == 'NA')){
                    return 10;
                  }
                  return 17;
                })
                .attr('class', 'node')
                .on("mouseover", function(d) {
                    var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "node-information")
                        .style('position', 'absolute');

                    tooltip.transition()
                        .duration(50);
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
                            '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + d.economic_damage + '</td></tr>' +
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
                            '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + d.economic_damage + '</td></tr>' +
                            '</table>';
                    }
                    tooltip.html(contentString)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                })
                .on("mouseout", function(d) {
                    $('.node-information').remove();
                });

            marker.append("circle")
                .attr("r", 3)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .attr('strokeWeight', '3px')
                .attr('class', 'dot')
                .attr("cx", function(d){
                  return max_radius * 2 + padding/2 - 15;
                })
                .attr("cy", function(d){
                  return (max_radius * 2 + 3)/2;
                });

            marker.append("svg:line")
                .style('stroke', 'black')
                .style("stroke-dasharray", "3,3")
                .attr('class', 'line')
                .attr("x1", function(d) {
                    if(damage_active == 1){
                      return max_radius + circle_size[d[damage_filter[damage_selected]]];
                    }else{
                      return max_radius + radius;
                    }
                })
                .attr("y1", function(d) {
                    return (max_radius * 2 + 3)/2;
                })
                .attr("x2", function(d) {
                    return max_radius * 2 + padding/2 - 15;
                })
                .attr("y2", function(d) {
                    return (max_radius * 2 + 3)/2;
              });

        };
    };
    overlay.setMap(map);
}

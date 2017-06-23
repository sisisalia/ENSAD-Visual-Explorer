function overlayOverlappingMarkers(array) {
    var increment = 360 / array.length;
    var angle = 0;
    var radius = 10;
    var padding = 40;

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
                .attr('width', radius + padding + 5)
                .attr('height', radius * 2 + 3)
                // .style('border','1px solid black')
                .style("left", function(d) {
                    return ((d.exact_position[0] - radius - padding) + "px")
                })
                .style("top", function(d) {
                    return ((d.exact_position[1] - radius) + "px")
                })
                .attr('transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    return 'rotate(' + rotate + ', ' + (radius * 2 + 2.5) + ', ' + (-1.5) + ')';
                })
                .attr('class', function(d) {
                    return 'marker';
                });

            angle = 0;

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
                .attr("cy", radius);

            var images = marker.append("svg:image")
                .attr("xlink:href", function(d) {
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
                .attr('transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    return 'rotate(' + (-rotate) + ', ' + radius + ', ' + (radius) + ')';
                })
                .attr("height", 20)
                .attr("width", 20)
                .attr('class', 'node')
                .on("mouseover", function(d) {
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
                });

            marker.append("circle")
                .attr("r", 3)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .attr('strokeWeight', '3px')
                .attr('class', 'dot')
                .attr("cx", radius + padding)
                .attr("cy", radius);

            marker.append("svg:line")
                .style('stroke', 'black')
                .style("stroke-dasharray", "3,3")
                .attr('class', 'line')
                .attr("x1", function(d) {
                    return radius * 2 + 3;
                })
                .attr("y1", function(d) {
                    return radius;
                })
                .attr("x2", function(d) {
                    return radius + padding + 3;
                })
                .attr("y2", function(d) {
                    return radius;
                });

        };
    };
    overlay.setMap(map);
}

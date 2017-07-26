/*
Purpose :
1. Overlay circles, a black dot and dashed line when there is overlapping markers after a certain zoom level
*/

// 'array' == contains an array of objects in which the object are on the same position
// each object contains information to create a circle and its tooltip
function overlayOverlappingMarkers(array) {
    // Angle need to be incremented
    var increment = 360 / array.length;
    var angle = 0;
    var radius = circle_size['Level 0'];
    var max_radius = circle_size['Level 5'];
    var padding = 100;

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");
        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
            // Note that width and height of svg might block other elements

            var marker = layer.selectAll("svg")
                .data(array)
                .enter().append("svg")
                .attr('width', function(d){
                    return max_radius + padding + 5;
                })
                .attr('height', function(d){
                    return max_radius * 2 + 3;
                })
                .style("left", function(d) {
                      return ((d.geodata.x - max_radius - padding + 8.5) + "px")
                })
                .style("top", function(d) {
                    return ((d.geodata.y - max_radius) + "px")
                })
                // Rotate the different nodes in the cluster so that they will not stack up together
                // .attr('transform', function(d) {
                //     var rotate = angle;
                //     angle += increment;
                //     return 'rotate(' + rotate + ', ' + (max_radius - 7) + ', ' + '0' + ')';
                // })
                .style('-webkit-transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    var temp = -max_radius + 7;
                    return 'translateX(50px) rotate(' + rotate + 'deg) translateX('+ temp +'px)';
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
                  return energy_color[d.type];
                })
                .attr('stroke', 'transparent')
                .attr("cx", function(d){
                  return max_radius;
                })
                .attr("cy", function(d){
                  return (max_radius * 2 + 3)/2;
                });

            var images = marker.append("svg:image")
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
                .attr("x", function(d){
                  // Due to different size of images, need to be manually adjusted
                  if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable')|| (energy_chain_active ==  1 && d.stage == 'DOM/COM')){
                    return max_radius - radius + 3;
                  }
                  return max_radius - radius;
                })
                .attr("y", function(d){
                  if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable')|| (energy_chain_active ==  1 && d.stage == 'DOM/COM')){
                    return (max_radius * 2 + 3)/2 - radius + 3;
                  }
                  return (max_radius * 2 + 3)/2 - radius;
                })
                // Rotate the image to face the correct way
                .attr('transform', function(d) {
                    var rotate = angle;
                    angle += increment;
                    return 'rotate(' + (-rotate ) + ', ' + (max_radius) + ', ' + (max_radius+1.5) + ')';
                })
                .attr("height", function(d){
                  if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable')|| (energy_chain_active ==  1 && d.stage == 'DOM/COM')){
                    return 10;
                  }
                  return 17;
                })
                .attr("width", function(d){
                  if((d.type == 'Non-hydro dam') || (d.type == 'Not applicable')|| (energy_chain_active ==  1 && d.stage == 'DOM/COM')){
                    return 10;
                  }
                  return 17;
                })
                .attr('class', 'node')
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
                  // var damage = ['fatalities', 'injured', 'evacuees','economic_damage'];
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
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Location</td><td style="font:10px lato">' + d.location + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Fatalities</td><td style="font:10px lato">' + bar0 + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Injuries</td><td style="font:10px lato">' + bar1 + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Evacuees</td><td style="font:10px lato">' + bar2 + '</td></tr>' +
                  // '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + bar3 + '</td></tr>' +
                  // '</table>';

                  // Text tooltip
                  contentString += '<table>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Year</td><td style="font:10px lato">' + d.year + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Location</td><td style="font:10px lato">' + d.location + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy type</td><td style="font:10px lato">' + d.type + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Energy stage</td><td style="font:10px lato">' + d.stage + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Infrastructure</td><td style="font:10px lato">' + d.infrastructure + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Fatalities</td><td style="font:10px lato">' + d.fatalities + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Injured</td><td style="font:10px lato">' + d.injured + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Evacuees</td><td style="font:10px lato">' + d.evacuees + '</td></tr>' +
                  '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Economic damage</td><td style="font:10px lato">' + d.economic_damage + '</td></tr>' +
                  '</table>';

                  tooltip.html(contentString)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY) + "px");
              })
              .on("mouseout", function(d) {
                  $('.node-information').remove();
              });



            // Add a black dot in the exact position of the cluster
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

            // Create dashed line to connect the black dot and the nodes after transform
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
    // Overlay onto the map
    overlay.setMap(map);
}

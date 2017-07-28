/*
Purpose :
1. Overlay pie chart on the map
2. Overlay small circles which are in the cluster on mouseover
*/

// 'obj' == contains an array of objects in a cluster
// each object contains information needed to form a pie chart, tooltip for the pie chart as well as small circles to annotate accidents found in the cluster
function overlayPieChart(obj) {
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");

        // a default size of pie chart
        var radius = circle_size['Level 0'] * 1.5;

        if(damage_active == 1){
          // changed the radius if 'Damage' menu is clicked
          radius = obj[obj.length-1].piechartrad;
          // get the average damage level to show on the tooltip
          var ave_level;
          $.map(circle_size, function(d,i){
            if(d == radius){
              ave_level = i;
            }
          })

          // Bar tooltip
          // if(ave_level != undefined){
          //   var color = [];
          //   for(var i = 0; i < 6; i++){
          //     if(i <= parseInt(ave_level[ave_level.length - 1])){
          //       color.push('#87A1B1');
          //     }else{
          //       color.push('white');
          //     }
          //   }
          //   var bar = '<table class="bar'+ i +'"><tr><td class="text-center" style="font-style:italic; padding-top:2px;">Low</td><td><svg width="60" height="10" style="margin-top:5px; padding-left:5px;">' +
          //     '<rect x="0" y="0" width="10" height="10" style="fill:'+ color[1] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
          //     '<rect x="10" y="0" width="10" height="10" style="fill:' + color[2] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
          //     '<rect x="20" y="0" width="10" height="10" style="fill:'+ color[3] + ';stroke-width:1;stroke:rgb(0,0,0)" />' +
          //     '<rect x="30" y="0" width="10" height="10" style="fill:'+ color[4] +';stroke-width:1;stroke:rgb(0,0,0)" />' +
          //     '<rect x="40" y="0" width="10" height="10" style="fill:'+ color[5] + ';stroke-width:1;stroke:rgb(0,0,0)" />' +
          //   '</svg></td><td class="text-center" style="font-style:italic; padding-top:2px;">High</td></tr></table>';
          //
          //   tooltip_temp = '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Average damage level</td><td style="padding-top:2px; font:10px lato">' + bar + '</td></tr>';
          // }

          // Text tooltip
          // Add 'Average damage level' to tooltip
          tooltip_temp = '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Average damage level</td><td style="padding-top:2px; font:10px lato">' + ave_level + '</td></tr>';
        }

        // number of objects in a cluster
        var total_nodes = obj.length;

        // Create an object contains all of the energy type and equate to 0
        var energy_count = Object.create(energy_type_image_color);
        $.map(energy_count, function(d, i){
          energy_count[i] = 0;
        })
        // Count number of energy type found in the cluster for tooltip
        for(var i = 0; i < total_nodes; i++){
          energy_count[obj[i].type]++;
        }

        // Contains data to create a pie chart(average_position, coordinates, type, number)
        // 'average_position' == where the pie chart is located
        // 'coordinates' == geographic position of the node in the map
        // 'type' == energy type of the node
        // 'number' == number of type in the cluster
        var pie_data = [];

        $.map(energy_count,function(d,i){
          if(d == 0) return;
          var new_obj = new Object();
          new_obj.type = i;
          new_obj.number = d;
          for(var i = 0; i < obj.length; i++){
            if(obj[i].type == new_obj.type){
              new_obj.average_position = obj[i].average_position;
              new_obj.coordinates = obj[i].coordinates;
              break;
            }
          }
          pie_data.push(new_obj);
        })

        // Create tooltip
        var contentString = '<table><tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">Accident(s) : </td></tr>';

        for(var i = 0; i <  pie_data.length; i++){
          contentString += '<tr><td style=" padding:2px; padding-right:8px; font:10px Lato;">'+ pie_data[i].type + '</td><td style="padding-top:2px; font:10px lato">' + pie_data[i].number + '</td></tr>';
        }

        if(damage_active == 1){
          contentString += tooltip_temp;
        }

        // Close the tooltip
        contentString += '</table>';

        overlay.draw = function() {

            // Create pie chart
            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);

            // Create portion of pie chart according to 'number'
            var pie = d3.pie().value(function(d) {return d.number;});

            var marker = layer.selectAll("svg")
                .data(pie(pie_data))
                .enter().append("svg")
                .attr('width', radius * 2)
                .attr('height', radius * 2)
                // On click, zoom
                .on('click', function(d) {
                    // eg. '1' => num = 1, '10' => num = 2, '100' => num = 3
                    var num = String(total_nodes).length;
                    if(d.data == null){
                      var pt = new google.maps.LatLng(d.coordinates[1], d.coordinates[0]);
                    }else{
                      var pt = new google.maps.LatLng(d.data.coordinates[1], d.data.coordinates[0]);
                    }
                    map.setCenter(pt);
                    // Set different zoom according to how many clusters in
                    if(map.getZoom() >= 7){
                      return map.setZoom(opt.maxZoom);
                    }
                    if(num == 1){
                      map.setZoom(7);
                    }
                    if(num == 2){
                      map.setZoom(7);
                    }
                    if(num == 3){
                      map.setZoom(7);
                    }
                })
                .style("left", function(d) {
                    return ((d.data.average_position[0] - radius) + "px")
                })
                .style("top", function(d) {
                    return ((d.data.average_position[1] - radius) + "px")
                })
                // Z-index to make sure that pie chart is always on top of small circles
                .style('z-index', 10)
                .attr("class", "pie-chart marker");

            marker.append("path")
                .attr("d", arc)
                .attr("transform", "translate(" + radius + "," + radius + ")")
                .style("fill", function(d) {
                  return energy_color[d.data.type];
                });

            // if 'Damage' menu is clicked
            if(damage_active == 1){
              // Due to different size of radius, changed the position of text accordingly
              var text = marker.append('text')
                  .style('fill', 'white')
                  .style('font-size', function(d){
                    var num = String(total_nodes).length;
                    if (num == 3) {
                        return '8px';
                    }
                    return '10px';
                  })
                  .attr('dx', function(d) {
                      // Centralize the text
                      var num = String(total_nodes).length;
                      if (num == 1) {
                          return radius - 3;
                      }
                      if (num == 2) {
                          if(radius == circle_size['Level 0']){
                            return radius/2 - 1.5;
                          }
                          return radius / 2 + 1;
                      }
                      if (num == 3) {
                          return radius / 2 - 3;
                      }
                  })
                  .attr('dy', function(d){
                    var num = String(total_nodes).length;
                    if(num == 3){
                      return radius + 3;
                    }
                    return radius + 4
                  })
                  .text(function(d) {
                      return total_nodes;
                  });
            }else{
              var text = marker.append('text')
                  .style('fill', 'white')
                  .style('font-size', '10px')
                  .attr('dx', function(d) {
                      // Centralize the text
                      var num = String(total_nodes).length;
                      if (num == 1) {
                          return radius - 3;
                      }
                      if (num == 2) {
                          return radius / 2 ;
                      }
                      if (num == 3) {
                          return radius / 2 - 3;
                      }
                  })
                  .attr('dy', radius + 4)
                  .text(function(d) {
                      return total_nodes;
                  });
            }

            // If mouseover the text on the pie chart
            marker.on("mouseover", function(d) {
              // Create small circles indicite the nodes found in the cluster
              var area = layer.selectAll('svg')
                              .data(obj).enter().append('svg')
                              .attr('width', 10).attr('height', 10).attr('class', 'area');

              area.append('circle').attr('r', 5).attr('cx',5).attr('cy', 5)
                  .style('fill', function(d){
                    return energy_color[d.type];
                  })
                  // Make sure that the circles always behind pie chart
                  .style('opacity', 0.5).style('z-index','1');

             area.style("left", function(d) {
                    return (d.geodata.x - 5 + "px")
                  })
                  .style("top", function(d) {
                    return (d.geodata.y - 5 + "px")
                  });

              // Tooltip
                var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "node-information")
                    .style('position', 'absolute');

                tooltip.html(contentString)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function(d) {
                // Remove small circles(area) and tooltip(node information)
                $('.area').remove();
                $('.node-information').remove();
            });
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

function overlayPieChart(obj) {
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");

        overlay.draw = function() {
            var radius = circle_size['Level 0'] * 1.5;
            var padding = 3;

            if(damage_active == 1){
              radius = obj[obj.length -1].piechartrad;
              var ave_level;
              $.map(circle_size, function(d,i){
                if(d == radius){
                  ave_level = i;
                }
              })
            }

            var total_nodes = obj.length;
            var energy_count = {
              'Battery' : 0,
              'Biomass' : 0,
              'Coal' : 0,
              'Electricity' : 0,
              'Fuel cell' : 0,
              'Geothermal' : 0,
              'Hydrogen' : 0,
              'Hydropower' : 0,
              'LPG' : 0,
              'Marine' : 0,
              'NA' : 0,
              'Natural gas' : 0,
              'Non-hydro' : 0,
              'Nuclear' : 0,
              'Oil' : 0,
              'Solar' : 0,
              'Wind' : 0,
            }

            for(var i = 0; i < total_nodes; i++){
              energy_count[obj[i].type]++;
            }

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

            var contentString = '<table><tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Accident(s) : </td></tr>';

            pie_data.sort(function(a, b) {
                var x = a.number;
                var y = b.number;
                return (x > y) ? -1 : (x < y) ? 1 : 0;
            })

            for(var i = 0; i <  pie_data.length; i++){
              contentString += '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">'+ pie_data[i].type + '</td><td style="padding-top:2px; font:10px lato">' + pie_data[i].number + '</td></tr>';
            }

            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);

            var pie = d3.pie().value(function(d) {return d.number;});

            var marker = layer.selectAll("svg")
                .data(pie(pie_data))
                .enter().append("svg")
                .attr('width', radius * 2 + padding)
                .attr('height', radius * 2 + padding)
                .on('click', function(d) {
                    var num = String(total_nodes).length;
                    var pt = new google.maps.LatLng(d.data.coordinates[1], d.data.coordinates[0]);
                    map.setCenter(pt);
                    if(num == 1){
                      map.setZoom(opt.maxZoom - 1);
                    }
                    if(num == 2){
                      map.setZoom(opt.maxZoom - 2);
                    }
                    if(num == 3){
                      map.setZoom(opt.maxZoom - 5);
                    }
                })
                .style("left", function(d) {
                    return ((d.data.average_position[0] - radius) + "px")
                })
                .style("top", function(d) {
                    return ((d.data.average_position[1] - radius) + "px")
                })
                .attr("class", "pie-chart marker");

            marker.append("path")
                .attr("d", arc)
                .attr("transform", "translate(" + radius + "," + radius + ")")
                .style('strokeWeight', '1px')
                .style("fill", function(d) {
                    var type = energy_type_filter[d.data.type];
                    if (type != null) return energy_color[type];
                    else {
                        return energy_color[d.data.type];
                    }
                });

            if(damage_active == 1){
              contentString += '<tr><td style="padding-top:3px; padding-right:5px; font:10px adelle;">Average damage level</td><td style="padding-top:2px; font:10px lato">' + ave_level + '</td></tr>';
              var text = marker.append('text')
                  .style('font-weight', 'bold')
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
                          return radius / 2 - 1;
                      }
                      if (num == 3) {
                          return radius / 2 - 3;
                      }
                  })
                  .attr('dy', radius + 4)
                  .text(function(d) {
                      return total_nodes;
                  });
            }else{
              var text = marker.append('text')
                  .style('font-weight', 'bold')
                  .style('fill', 'white')
                  .style('font-size', '10px')
                  .attr('dx', function(d) {
                      // Centralize the text
                      var num = String(total_nodes).length;
                      if (num == 1) {
                          return radius - 3;
                      }
                      if (num == 2) {
                          return radius / 2 + 1;
                      }
                      if (num == 3) {
                          return radius / 2 - 2;
                      }
                  })
                  .attr('dy', radius + 4)
                  .text(function(d) {
                      return total_nodes;
                  });
            }

            contentString += '</table>';

            text.on("mouseover", function(d) {
                // Tooltip
                var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "node-information")
                    .style('position', 'absolute');

                tooltip.transition()
                    .duration(50);

                tooltip.html(contentString)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function(d) {
                $('.node-information').remove();
            });
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

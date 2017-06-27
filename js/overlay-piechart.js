function overlayPieChart(obj) {
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");

        overlay.draw = function() {
            var radius = circle_size['Level 0'] * 1.5;
            var padding = 3;

            if(damage_active == 1){
              radius = obj[obj.length -1].piechartrad;
            }

            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);

            var pie = d3.pie().value(1);

            var marker = layer.selectAll("svg")
                .data(pie(obj))
                .enter().append("svg")
                .attr('width', radius * 2 + padding)
                .attr('height', radius * 2 + padding)
                .on('click', function(d) {
                    var pt = new google.maps.LatLng(d.data.coordinates[1], d.data.coordinates[0]);
                    map.setCenter(pt);
                    map.setZoom(opt.maxZoom - 3);
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
              marker.append('text')
                  .style('font-weight', 'bold')
                  .style('fill', 'white')
                  .style('font-size', function(d){
                    var num = String(d.data.length).length;
                    if (num == 3) {
                        return '8px';
                    }
                    return '10px';
                  })
                  .attr('dx', function(d) {
                      // Centralize the text
                      var num = String(d.data.length).length;
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
                      return d.data.length;
                  });
            }else{
              marker.append('text')
                  .style('font-weight', 'bold')
                  .style('fill', 'white')
                  .style('font-size', '10px')
                  .attr('dx', function(d) {
                      // Centralize the text
                      var num = String(d.data.length).length;
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
                      return d.data.length;
                  });
            }
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

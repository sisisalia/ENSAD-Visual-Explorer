function overlayPieChart(obj) {
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");

        overlay.draw = function() {
            var radius = 15;
            var padding = 3;

            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 6);

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

            marker.append('text')
                .style('font-weight', 'bold')
                .attr('dx', function(d) {
                    // Centralize the text
                    var num = String(d.data.length).length;
                    if (num == 1) {
                        return radius - 4;
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
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}

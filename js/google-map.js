/*
Purpose :
1. Create a google map
2. Set boundary of google map
3. Set minimum and maximum zoom level
*/

// Get data from 'map-styles.json' using ajax
var style = (function() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'data/map-styles.json',
        'dataType': "json",
        'success': function(data) {
            style = data;
        }
    });
    return style;
})();

// Create a map according to 'map-styles.json'
var styledMapType = new google.maps.StyledMapType(style, {
    name: "Simple Map"
});

// Create the Google Map
var map = new google.maps.Map(d3.select("#map").node(), {
    center: new google.maps.LatLng(37.76487, 0),
    zoom: initial_zoom,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
        // 'Map', 'satellite', 'simple map'
        mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid',
                    'styled_map'],
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControl: false,
});

// Include custom map type control
map.mapTypes.set('styled_map', styledMapType);
map.setMapTypeId('styled_map');

// Set zooming limit
map.setOptions(opt);

// restrict the appropriate region for users
// Hence, user is only able to view one map
var initial_center = map.getCenter();
var lastValidCenter = initial_center;

var pre_ne = new google.maps.LatLng(0, 0);
google.maps.event.addListener(map, 'bounds_changed', function() {
    var cur_scale = map.getZoom();

    var min_lat = -77,
        max_lat = 85;
    var min_lng = -180,
        max_lng = 180;

    var cur_bounds, cur_center, ne, sw;

    updateBound();

    if (sw.lat() < min_lat) {
        var lat_displacement = min_lat - sw.lat() + 1;
        var new_center = new google.maps.LatLng(cur_center.lat() + lat_displacement, cur_center.lng());
        map.panTo(new_center);
    }

    updateBound();
    if (ne.lat() > max_lat) {
        var lat_displacement = ne.lat() - max_lat + 1;
        var new_center = new google.maps.LatLng(cur_center.lat() - lat_displacement, cur_center.lng());
        map.panTo(new_center);
    }

    updateBound();
    var displacement = pre_ne.lng() - ne.lng();
    //  180 > displacement > 0, move left;
    // displacement < 0 or displacement > 180,  move right

    if (sw.lng() > 0 && sw.lng() > ne.lng() && displacement && displacement > 0 && displacement < 180) { // move left
        var lng_displacement = max_lng - sw.lng() + 1;
        var new_center = new google.maps.LatLng(cur_center.lat(), cur_center.lng() + lng_displacement);
        map.panTo(new_center);
    }

    updateBound();
    if (ne.lng() < 0 && sw.lng() > ne.lng()) {
        var lng_displacement = ne.lng() - min_lng + 1;

        var new_center = new google.maps.LatLng(cur_center.lat(), cur_center.lng() - lng_displacement);
        map.panTo(new_center);
    }

    pre_ne = ne;

    function updateBound() {
        cur_bounds = map.getBounds();
        cur_center = map.getCenter();

        ne = cur_bounds.getNorthEast();
        sw = cur_bounds.getSouthWest();
    }
});

// If zoom in/out of google map
google.maps.event.addListener(map, 'zoom_changed', function() {
    $('.markers').remove();
    zoom_level = map.getZoom();
    if (map.getZoom() == opt.maxZoom) {
        $("div[title='Zoom in']").css("opacity", "0.5").css('cursor', 'not-allowed');
    } else {
        $("div[title='Zoom in']").css("opacity", "1").css('cursor', 'pointer');
    }
    if (map.getZoom() == opt.minZoom) {
        $("div[title='Zoom out']").css("opacity", "0.5").css('cursor', 'not-allowed');
    } else {
        $("div[title='Zoom out']").css("opacity", "1").css('cursor', 'pointer');
    }
    $('.node-information').remove();
    // Set timer for the broswer to respond correctly, if not the visualization could become a mess
    setTimeout(function() {
        resetMarkers();
    }, 500);
});

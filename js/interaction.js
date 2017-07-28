/*
Purpose : Interaction between menu and the map
*/

// Intial set up when page is loaded
$('header').show();
$('.about-EVE-content').hide();
$('.menu-2').hide();
$('[id$="-tooltip"]').hide();
$('.chart-menu').hide();
$('.node-information').hide();
$('.cover').fadeOut(100);

// Header Interaction
$('.big-title').on('click', function() {
  if($('.about-EVE-content').is(':visible')){
    $('.about-EVE-content').hide();
  }else{
    $('.about-EVE-content').show();
  }
})
$('.fcl-image').on('click', function(){
  var win = window.open('http://www.fcl.ethz.ch', '_blank');
  if (win) {
      //Browser has allowed it to be opened
      win.focus();
  } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
  }
})
$('.frs-image').on('click', function(){
  var win = window.open('http://frs.ethz.ch', '_blank');
  if (win) {
      //Browser has allowed it to be opened
      win.focus();
  } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
  }
})
$('.psi-image').on('click', function(){
  var win = window.open('https://www.psi.ch/lea/', '_blank');
  if (win) {
      //Browser has allowed it to be opened
      win.focus();
  } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
  }
})


// About EVE link at extra menu
$('.about-EVE-content .fa-times').on('click', function() {
    $('.about-EVE-content').hide();
})
$('#map').on('click', function() {
    $('.about-EVE-content').hide();
})
$('.fa-info-circle').on('click', function() {
  if($('.about-EVE-content').is(':visible')){
    $('.about-EVE-content').hide();
  }else{
    $('.chart-menu').hide();
    $('.about-EVE-content').show();
  }
})

// Set on/off according to 'energy_type_active' variable
$('.energy-type').each(function(){
  var text = $(this).attr('src');
  var index = (text.lastIndexOf('/'));
  var temp = text.substring(index + 1, text.length - 4);
  var filter = energy_type_filter[temp];
  if(filter != null) temp = filter;
  var choice = energy_type_active.indexOf(temp);
  if(choice == -1){
    var index = (text.lastIndexOf('/'));
    var temp = text.substring(index + 1, text.length);
    var src = 'image/energy-type-off/' + temp;
    var type = $(this).attr('class');
    var index = type.indexOf(' ');
    var type = type.substring(index + 1, type.length);
    $('.' + type).attr('src', src);
    ($('.' + type).parent().css('color', '#87A1B1'));
  }
})

// Set on/off according to 'damage_selected' variable
$('.damage-type').each( function() {
    var text = $.trim(($(this).parent().text()));
    if (text == damage_selected){
      $(this).parent().css('color', '#87A1B1');
      $(this).parent().css('color', 'black');
      var text = $(this).attr('src');
      var index = (text.lastIndexOf('/'));
      var temp = text.substring(index + 1, text.length);
      var src = 'image/damage-on/' + temp;
      $(this).attr('src', src);
    }
})

// Set on/off according to 'energy_chain_filter_out'
$('.energy-stage').each(function() {
    var text = $.trim(($(this).parent().text()));
    if(energy_chain_filter_out.indexOf(text) == -1) return;
    else{
      var text = $(this).attr('src');
      var index = (text.lastIndexOf('/'));
      var temp = text.substring(index + 1, text.length);
      var src = 'image/energy-stage-off/' + temp;
      $(this).attr('src', src);
      ($(this).parent().css('color', '#87A1B1'));
    }
})

// Set on/off according to 'region_active'
$('.regions').each(function() {
    var id = $(this).attr('id');
    var checked = region_active.indexOf(id);
    if (checked != -1) return;
    else{
      $('#' + id).attr('checked', false);
    }
})

// Hovering on the 'Accidents' menu after either clicking 'Damage' or 'More' menu
// Tooltip for energy types in 'Accidents' menu appears
$(".menu-2-accidents .energy-type").mouseover(function() {
    $('.menu-2-accidents-tooltip').css('z-index', '10');
    var temp = $(this).attr('class');
    var index = temp.indexOf(' ');
    temp = '#' + temp.substring(index + 1, temp.length) + '-tooltip';
    $(temp).fadeIn(100);
});

$(".menu-2-accidents .energy-type").mouseout(function() {
    $('[id$="-tooltip"]').hide();
    $('.menu-2-accidents-tooltip').css('z-index', '3');
});

// Upon clicking on 'Damage' menu
$('.damage').on('click', function() {
    $('.menu-2-damage-content').show();
    if ($('.menu-2-damage').is(':hidden')) {
        $('.menu-1').hide();
        $('.menu-2-more').hide();
        $('.menu-2').show();
        $('.menu-2-damage').show();
        energy_chain_active = 0;
        damage_active = 1;
        not = 1;
        resetMarkers();
    }
})

// Upon clicking on 'Accidents' menu
$('.accidents').on('click', function() {
    if ($('.menu-1').is(':hidden')) {
        $('.menu-2').hide();
        $('.menu-1').show();
        energy_chain_active = 0;
        damage_active = 0;
        resetMarkers();
    }
})

// Upon clicking on 'More' menu
$('.more').on('click', function() {
    $('.menu-2-more-content').show();
    if ($('.menu-2-more').is(':hidden')) {
        $('.menu-1').hide();
        $('.menu-2-damage').hide();
        $('.menu-2').show();
        $('.menu-2-more').show();
        energy_chain_active = 1;
        damage_active = 0;
        resetMarkers();
    }
})

// Upon clicking on 'Sign out' icon at 'Extra menu' (menu below 'Year' menu)
$('.fa-sign-out').on('click', function() {
    window.location.replace(home);
})

// Upon clicking on 'Chart' icon at 'Extra menu'
$('.fa-area-chart').on('click', function() {
  $('#chart').empty();
  if($('.about-EVE-content').is(':visible')){
    $('.about-EVE-content').hide();
  }
    if ($('.chart-menu').is(':visible')) {
        $('.chart-menu').hide();
        $('#chart').empty();
    } else {
        var scale = $('#scale').val();
        if(scale == 'linear'){
          createRegionsChartData();
          createEnergyTypeChartData();
        }else{
          createRegionsChartData(1);
          createEnergyTypeChartData(1);
        }
        var y_axis = $('#chart-y').val();
        var x_axis = $('#chart-display').val();
        var index = y_axis.indexOf('-');
        y_axis = y_axis.substring(index + 1,y_axis.length);
        var index1 = x_axis.indexOf('-');
        var index2 = x_axis.lastIndexOf('-');
        var type = x_axis.substring(index1 + 1, index2);
        type = type.replace('-','_');
        var chart_type = x_axis.substring(index2 + 1, x_axis.length);
        if(chart_type == 'bar'){
          barChart(window[type + '_chart_data'][y_axis], type, y_axis);
        }
        if(chart_type == 'line'){
          if(type == 'regions'){
            createRegionLine(window[type + '_chart_data'][y_axis], y_axis);
          }else{
            createEnergyLine(window[type + '_chart_data'][y_axis], y_axis);
          }
        }
        $('.chart-menu').show();
    }
})

$('#chart-display, #chart-y, #scale').change(function() {
    $('#chart').empty();
    var scale = $('#scale').val();
    if(scale == 'linear'){
      createRegionsChartData();
      createEnergyTypeChartData();
    }else{
      createRegionsChartData(1);
      createEnergyTypeChartData(1);
    }
    var y_axis = $('#chart-y').val();
    var x_axis = $('#chart-display').val();
    var index = y_axis.indexOf('-');
    y_axis = y_axis.substring(index + 1,y_axis.length);
    var index1 = x_axis.indexOf('-');
    var index2 = x_axis.lastIndexOf('-');
    var type = x_axis.substring(index1 + 1, index2);
    type = type.replace('-','_');
    var chart_type = x_axis.substring(index2 + 1, x_axis.length);
    if(chart_type == 'bar'){
      barChart(window[type + '_chart_data'][y_axis], type, y_axis);
    }
    if(chart_type == 'line'){
      if(type == 'regions'){
        createRegionLine(window[type + '_chart_data'][y_axis], y_axis);
      }else{
        createEnergyLine(window[type + '_chart_data'][y_axis], y_axis);
      }
    }
})

// Upon clicking the content under 'Accidents' menu
$('.energy-type').on('click', function() {
    var text = $(this).attr('src');
    var choice = text.indexOf('-on/');
    var type = $(this).attr('class');
    var index = type.indexOf(' ');
    var type = type.substring(index + 1, type.length);
    // if off, on it
    if (choice == -1) {
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-type-on/' + temp;
        $('.' + type).attr('src', src);
        $('.' + type).parent().css('color', 'black');
        var temp = $(this).attr('class');
        var index = temp.indexOf(' ');
        temp = temp.substring(index + 1, temp.length);
        filter = energy_type_filter[temp];
        if(filter != null) temp = filter;
        energy_type_active.push(temp);
        resetMarkers();
    }
    // if on, off it
    else {
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-type-off/' + temp;
        $('.' + type).attr('src', src);
        ($('.' + type).parent().css('color', '#87A1B1'));
        index = temp.indexOf('.');
        var temp = $(this).attr('class');
        var index = temp.indexOf(' ');
        temp = temp.substring(index + 1, temp.length);
        filter = energy_type_filter[temp];
        if(filter != null) temp = filter;
        var index = energy_type_active.indexOf(temp);
        energy_type_active.splice(index, 1);
        resetMarkers();
    }
    if ($('.chart-menu').is(':visible')) {
        $('#chart-display, #chart-y').trigger('change');
    }
})

// Upon clicking content of 'More' menu under 'by Energy Chain Stages'
$('.energy-stage').on('click', function() {
    var text = $(this).attr('src');
    var choice = text.indexOf('-on/');
    // if off, on it
    if (choice == -1) {
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-stage-on/' + temp;
        $(this).attr('src', src);
        ($(this).parent().css('color', 'black'));
        var index = energy_chain_filter_out.indexOf($(this).next().next().text());
        if (index != -1) {
            energy_chain_filter_out.splice(index, 1);
        }
        resetMarkers();
    }
    // if on, off it
    else {
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-stage-off/' + temp;
        $(this).attr('src', src);
        ($(this).parent().css('color', '#87A1B1'));
        energy_chain_filter_out.push($(this).next().next().text());
        resetMarkers();
    }
    if ($('.chart-menu').is(':visible')) {
        $('#chart-display, #chart-y').trigger('change');
    }
})

// Upon clicking content in 'Damage' menu under 'by Damage Type'
$('.damage-type').on('click', function() {
    $('.damage-type').parent().css('color', '#87A1B1');
    $(this).parent().css('color', 'black');
    $('.damage-type').each(function() {
        var text = $(this).attr('src');
        var choice = text.indexOf('-on/');
        if (choice != -1) {
            var index = (text.lastIndexOf('/'));
            var temp = text.substring(index + 1, text.length);
            var src = 'image/damage-off/' + temp;
            $(this).attr('src', src);
        }
    })
    var text = $(this).attr('src');
    var choice = text.indexOf('-on/');
    // if off, on it
    if (choice == -1) {
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/damage-on/' + temp;
        $(this).attr('src', src);
        damage_selected = $.trim(($(this).parent().text()));
        resetMarkers();
    }
})

// Upon clicking the content in 'More' menu under 'by Regions'
$('.regions').on('click', function() {
    var id = $(this).attr('id');
    var checked = region_active.indexOf(id);
    if (checked == -1) {
        region_active.push(id);
    } else {
        region_active.splice(checked, 1);
    }
    resetMarkers();
    if ($('.chart-menu').is(':visible')) {
        $('#chart-display, #chart-y').trigger('change');
    }
})

// Click 'Select all' in accidents-menu
$('#energy_type_select').on('click', function(){
  energy_type_active = ['Battery', 'Biomass', 'Electricity', 'Fuel cell', 'Geothermal', 'Hydrogen', 'Hydropower', 'LPG', 'Marine', 'Natural gas', 'Non-hydro dam', 'Nuclear', 'Oil', 'Solarthermal', 'Solar photovolatic', 'Wind', 'Not applicable'];
  resetMarkers();
  $('.energy-type').each(function(){
    var text = $(this).attr('src');
    var index = (text.lastIndexOf('/'));
    var temp = text.substring(index + 1, text.length);
    var src = 'image/energy-type-on/' + temp;
    var type = $(this).attr('class');
    var index = type.indexOf(' ');
    var type = type.substring(index + 1, type.length);
    $('.' + type).attr('src', src);
    ($('.' + type).parent().css('color', 'black'));
  })
})

// Click 'Unselect all' in accidents-menu
$('#energy_type_unselect').on('click', function(){
  energy_type_active = [];
  resetMarkers();
  $('.energy-type').each(function(){
    var text = $(this).attr('src');
    var index = (text.lastIndexOf('/'));
    var temp = text.substring(index + 1, text.length);
    var src = 'image/energy-type-off/' + temp;
    var type = $(this).attr('class');
    var index = type.indexOf(' ');
    var type = type.substring(index + 1, type.length);
    $('.' + type).attr('src', src);
    ($('.' + type).parent().css('color', '#87A1B1'));
  })
})

// Click 'Select all' in energy Chain
$('#energy_chain_select').on('click', function(){
  energy_chain_filter_out = [];
  resetMarkers();
  $('.energy-stage').each(function() {
    var text = $(this).attr('src');
    var index = (text.lastIndexOf('/'));
    var temp = text.substring(index + 1, text.length);
    var src = 'image/energy-stage-on/' + temp;
    $(this).attr('src', src);
    ($(this).parent().css('color', 'black'));
  })
})

// Click 'Unselect all' in energy Chain
$('#energy_chain_unselect').on('click', function(){
  energy_chain_filter_out = ['Exploration', 'Extraction', 'Processing', 'Transport', 'Storage', 'Power plant', 'Waste processing', 'Domestic and commercial end use', 'Other end use'];
  resetMarkers();
  $('.energy-stage').each(function() {
    var text = $(this).attr('src');
    var index = (text.lastIndexOf('/'));
    var temp = text.substring(index + 1, text.length);
    var src = 'image/energy-stage-off/' + temp;
    $(this).attr('src', src);
    ($(this).parent().css('color', '#87A1B1'));
  })
})

// Severity range in 'Damage' menu under 'Severity Level'
// This will determine the distance in which the slider move
var values = [0, 28, 50, 68, 85, 100];
var severity_height = [0,16,29,39,49,58];
var initial_severity = [];
for(var i = 0; i < severity_level_included.length; i++){
  var temp = severity_level_included[i].substring(severity_level_included[i].length - 1);
  initial_severity.push(parseInt(temp));
}
initial_severity.sort();

var slider = $("#severity-range").slider({
    orientation: 'vertical',
    range: true,
    min: 0,
    max: 100,
    values: [values[initial_severity[0]], values[initial_severity[initial_severity.length - 1]]],
    slide: function(event, ui) {
      setTimeout(function() {
        var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
        var includeRight = event.keyCode != $.ui.keyCode.LEFT;
        var value = findNearest(includeLeft, includeRight, ui.value);
        if (ui.value == ui.values[0]) {
            slider.slider('values', 0, value);
        } else {
            slider.slider('values', 1, value);
        }
        var height = $('.ui-slider-range').css('height');
        var index = height.indexOf('p');
        height = parseInt(height.substring(0, index));
        // Safari returns percentage not pixel
        var bottom = $('.ui-slider-range').css('bottom');
        var check = bottom.indexOf('%');
        if(check != -1){
          bottom = parseInt(bottom.substring(0, check));
          index = values.indexOf(bottom);
          bottom = severity_height[index];
        }else{
          var index = bottom.indexOf('p');
          bottom = parseInt(bottom.substring(0, index));
        }
        var upper_value = height + bottom;
        var lower_value = bottom;
        var upper_index = severity_height.indexOf(upper_value);
        var lower_index = severity_height.indexOf(lower_value);
        if(upper_index == -1){
          var temp = upper_value - 1;
          upper_index = severity_height.indexOf(temp);
        }
        if(upper_index == -1){
          var temp = upper_value + 1;
          upper_index = severity_height.indexOf(temp);
        }
        if(lower_index == -1){
          var temp = lower_value - 1;
          lower_index = severity_height.indexOf(temp);
        }
        if(lower_index == -1){
          var temp = lower_value + 1;
          lower_index = severity_height.indexOf(temp);
        }
        severity_level_included = [];
        for(var i = lower_index; i <= upper_index; i++){
          severity_level_included.push('Level ' + i);
        }
        for(var i = 5; i >= 0; i--){
          if(i == upper_index){
            $('#lvl' + i).css('fill','#87A1B1');
          }
          if(i < upper_index){
            $('#lvl' + i).css('fill','transparent');
          }
          if(i > upper_index){
            $('#lvl' + i).css('fill','white');
          }
          if(i < lower_index){
            $('#lvl' + i).css('fill','white');
          }
        }
        resetMarkers();
        return false;
      }, 100);
    },
});

// Color the severity circles accordingly
$('[id^="lvl"]').each(function(){
  var id = $(this).attr('id');
  var num = id.substring(id.length - 1);
  var upper_limit = initial_severity[initial_severity.length - 1];
  var lower_limit = initial_severity[0];
  if(num == upper_limit){
    $(this).css('fill','#87A1B1');
  }
  if(num < upper_limit){
    $(this).css('fill','transparent');
  }
  if(num > upper_limit){
    $(this).css('fill','white');
  }
  if(num < lower_limit){
    $(this).css('fill','white');
  }
})

// Function for 'Severity' slider
function findNearest(includeLeft, includeRight, value) {
    var nearest = null;
    var diff = null;
    for (var i = 0; i < values.length; i++) {
        if ((includeLeft && values[i] <= value) || (includeRight && values[i] >= value)) {
            var newDiff = Math.abs(value - values[i]);
            if (diff == null || newDiff < diff) {
                nearest = values[i];
                diff = newDiff;
            }
        }
    }
    return nearest;
}

// Severity slider styling
$('#severity-range .ui-slider-handle').css('background-color', 'white');
$('#severity-range .ui-slider-handle').css('border-radius', '1px');
$('#severity-range .ui-slider-handle').css('height', '8px');
$('#severity-range .ui-slider-handle').css('width', '18px');
$('#severity-range .ui-slider-handle').css('box-shadow', '0 1px 2px 0 rgba(0,0,0,0.5);');
$('#severity-range .ui-slider-handle').css('margin-left', '-3px');
$('#severity-range .ui-slider-handle').css('margin-bottom', '-1px');

// Year slider
$("#slider-range").slider({
    range: true,
    min: minYear,
    max: maxYear,
    step: 10,
    values: years,
    slide: function(event, ui) {
        $('#year-range').text(ui.values[0] + ' - ' + ui.values[1]);
        years = [];
        years.push(ui.values[0]);
        years.push(ui.values[1]);
        setTimeout(function() {
            resetMarkers();
        }, 100);
        if ($('.chart-menu').is(':visible')) {
            changeDuration();
            $('#chart-display, #chart-y').trigger('change');
        }
    },
});

$('#slider-range').slider().slider('pips');

// Year slider's styling
$('#slider-range .ui-slider-handle').css('background-color', 'white');
$('#slider-range .ui-slider-handle').css('border-radius', '1px');
$('#slider-range .ui-slider-handle').css('height', '18px');
$('#slider-range .ui-slider-handle').css('width', '8px');
$('#slider-range .ui-slider-handle').css('box-shadow', '0 1px 2px 0 rgba(0,0,0,0.5);');
$('#slider-range .ui-slider-handle').css('margin-top', '-4.5px');
$('#slider-range .ui-slider-handle').css('margin-left', '-3px');

// Refresh
$('.fa-repeat').on('click', function() {
    energy_type_active = ['Non-hydro dam', 'Hydropower', 'Natural gas', 'LPG', 'Not applicable'];
    energy_chain_filter_out = [];
    severity_level_included = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
    damage_selected = 'Fatalities';
    region_active = ['oecd','non_oecd', 'g20', 'eu28'];
    years = [minYear, maxYear];
    $('.markers').remove();
    map.panTo(map.getCenter());
    map.setZoom(initial_zoom);
    resetMarkers();
    // Set on/off according to 'energy_type_active' variable
    $('.energy-type').each(function(){
      var text = $(this).attr('src');
      var index = (text.lastIndexOf('/'));
      var temp = text.substring(index + 1, text.length - 4);
      var filter = energy_type_filter[temp];
      if(filter != null) temp = filter;
      var choice = energy_type_active.indexOf(temp);
      if(choice == -1){
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-type-off/' + temp;
        var type = $(this).attr('class');
        var index = type.indexOf(' ');
        var type = type.substring(index + 1, type.length);
        $('.' + type).attr('src', src);
        ($('.' + type).parent().css('color', '#87A1B1'));
      }
      if(choice != -1){
        var index = (text.lastIndexOf('/'));
        var temp = text.substring(index + 1, text.length);
        var src = 'image/energy-type-on/' + temp;
        var type = $(this).attr('class');
        var index = type.indexOf(' ');
        var type = type.substring(index + 1, type.length);
        $('.' + type).attr('src', src);
        ($('.' + type).parent().css('color', 'black'));
      }
    })

    // Set on/off according to 'damage_selected' variable
    $('.damage-type').each( function() {
        var text = $.trim(($(this).parent().text()));
        if (text == damage_selected){
          $(this).parent().css('color', 'black');
          var text = $(this).attr('src');
          var index = (text.lastIndexOf('/'));
          var temp = text.substring(index + 1, text.length);
          var src = 'image/damage-on/' + temp;
          $(this).attr('src', src);
        }else{
          $(this).parent().css('color', '#87A1B1');
          var text = $(this).attr('src');
          var index = (text.lastIndexOf('/'));
          var temp = text.substring(index + 1, text.length);
          var src = 'image/damage-off/' + temp;
          $(this).attr('src', src);
        }
    })

    // Set on/off according to 'energy_chain_filter_out'
    $('.energy-stage').each(function() {
        var text = $.trim(($(this).parent().text()));
        if(energy_chain_filter_out.indexOf(text) == -1){
          var text = $(this).attr('src');
          var index = (text.lastIndexOf('/'));
          var temp = text.substring(index + 1, text.length);
          var src = 'image/energy-stage-on/' + temp;
          $(this).attr('src', src);
          ($(this).parent().css('color', 'black'));
        }
        else{
          var text = $(this).attr('src');
          var index = (text.lastIndexOf('/'));
          var temp = text.substring(index + 1, text.length);
          var src = 'image/energy-stage-off/' + temp;
          $(this).attr('src', src);
          ($(this).parent().css('color', '#87A1B1'));
        }
    })

    // Set on/off according to 'region_active'
    $('.regions').each(function() {
        var id = $(this).attr('id');
        var checked = region_active.indexOf(id);
        if (checked != -1){
          $('#' + id).attr('checked', true);
        }
        else{
          $('#' + id).attr('checked', false);
        }
    })
    $('.damage-type').parent().css('color', '#B9CAD4');
    $('#fatalities').css('color', 'black');
    $('.regions').each(function() {
        $(this).prop('checked', true);
    });
    $("#severity-range").slider({
      values: [values[initial_severity[0]], values[initial_severity[initial_severity.length - 1]]],
    });
    $("#slider-range").slider({
        values: years
    });
    $('#year-range').html(years[0] + ' - ' + years[1]);
    for (i = 0; i <= 5; i++) {
        if (i == 5) {
            $('#lvl5').css('fill', '#87A1B1');
        } else {
            $('#lvl' + i).css('fill', 'transparent');
        }
    }
    $('.chart-menu').hide();
    $('#chart').empty();
})

// When resize button in menu is clicked
$('.fa-compress').on('click', function(){
  $('.menu-1').hide();
  $('.menu-2').show();
  $('.menu-2-more').hide();
  $('.menu-2-damage').hide();
})

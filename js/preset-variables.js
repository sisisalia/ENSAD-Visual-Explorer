// Preset variables for filtering

// Energy type to be included in the map
// This will also filter out the energy type which is not defined in the database
var energy_type_active = ['Hydropower', 'Natural gas', 'LPG', 'Battery', 'Biomass', 'Coal', 'Electricity', 'Fuel Cell', 'Geothermal', 'Hydrogen', 'Marine', 'Nuclear', 'Oil', 'Solar', 'Wind', 'Non-hydro', 'NA'];
// Energy to be filtered out from the map
var energy_chain_filter_out = [];
// This will keep range of year of accidents when the user changes the year
// years[0] will be the earliest year while years[1] will be the latest year
var years = [];
// severity level to be included
var severity_level_included = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
// Damage selected, only one damage is shown
var damage_selected = 'Fatalities';
// Toogle between 0 and 1, if user clicks 'More', it will become 1, other than that it will be kept as 0
var energy_chain_selected = 0;
// Region to be filtered out
var region_filter_out = [];

// Preset values for severity level
// Taking example of fatalities: 0 is 'Level 0', 1 - 4 is 'Level 1' , 5 - 20 is 'Level 2', 21 - 100 is 'Level 3', 101 - 500 is 'Level 4', 501 above is 'Level 5'
var severity_level_fatalities = [0,4,20,100,500];
var severity_level_injured = [0,9,50,100,500];
var severity_level_evacuees = [0,199,1000,5000,10000];
var severity_level_spillsize = [0,199,1000,10000,100000];
var severity_level_economics = [0,4.99,20,100,1000];

// Link after sign out from EVE visualisation
var home = 'http://localhost:8000';

// Size of the image(Hydropower, LPG, Natural gas etc)
var image_size = 15;
// Size of the circle in different level
var circle_size = {
  'Level 0' : 8.25,
  'Level 1' : 11.667,
  'Level 2' : 14.289419,
  'Level 3' : 16.5,
  'Level 4' : 18.447561,
  'Level 5' : 20.20829,
};
// Size of anchor for the markers
// For understanding of anchor, read the documentation below
// https://developers.google.com/maps/documentation/javascript/examples/icon-complex
var anchor_size = 8.00;
// All the existing markers
var markers = [];
var markers_circles = [];

// Filter energy type to a proper representation
// right side is the proper representation while left side is any input to change to a proper representation
// right side is following the text found in the top left menu
var energy_type_filter = {
  'NA' : 'NA',
  'Non-hydro' : 'Non-hydro',
  'Natural Gas' : 'Natural gas',
  'Solarthermal' : 'Solar',
  'Solar Photovolatic' : 'Solar',
  'hydropower' : 'Hydropower',
  'battery' : 'Battery',
  'biomass' : 'Biomass',
  'coal' : 'Coal',
  'electricity' : 'Electricity',
  'fuelcell' : 'Fuel Cell',
  'geothermal' : 'Geothermal',
  'hydrogen' : 'Hydrogen',
  'lpg' : 'LPG',
  'marine' : 'Marine',
  'naturalgas' : 'Natural gas',
  'nuclear' : 'Nuclear',
  'oil' : 'Oil',
  'solar' : 'Solar',
  'wind' : 'Wind',
};

// Filtering energy chain stages to a proper presentation
// Proper presentation is following the text found in the top left menu
var energy_chain_filter = {
  'Power/Heating Plant' : 'Power plant',
  'Processing/Production' : 'Processing',
};

var energy_type_image_color = {
  'Battery' : '/image/energy-type-on/battery.png',
  'Biomass' : '/image/energy-type-on/biomass.png',
  'Coal' : '/image/energy-type-on/coal.png',
  'Electricity' : '/image/energy-type-on/electricity.png',
  'Fuel cell' : '/image/energy-type-on/fuelcell.png',
  'Geothermal' : '/image/energy-type-on/geothermal.png',
  'Hydrogen' : '/image/energy-type-on/hydrogen.png',
  'Hydropower' : '/image/energy-type-on/hydropower.png',
  'LPG' : '/image/energy-type-on/lpg.png',
  'Marine' : '/image/energy-type-on/marine.png',
  'Natural gas' : '/image/energy-type-on/naturalgas.png',
  'Nuclear' : '/image/energy-type-on/nuclear.png',
  'Oil' : '/image/energy-type-on/oil.png',
  'Solar' : '/image/energy-type-on/solar.png',
  'Wind' : '/image/energy-type-on/wind.png',
};

var energy_type_image_white = {
  'Battery' : '/image/energy-type-white/battery-w.png',
  'Biomass' : '/image/energy-type-white/biomass-w.png',
  'Coal' : '/image/energy-type-white/coal-w.png',
  'Electricity' : '/image/energy-type-white/electricity-w.png',
  'Fuel cell' : '/image/energy-type-white/fuelcell-w.png',
  'Geothermal' : '/image/energy-type-white/geothermal-w.png',
  'Hydrogen' : '/image/energy-type-white/hydrogen-w.png',
  'Hydropower' : '/image/energy-type-white/hydropower-w.png',
  'LPG' : '/image/energy-type-white/lpg-w.png',
  'Marine' : '/image/energy-type-white/marine-w.png',
  'Natural gas' : '/image/energy-type-white/naturalgas-w.png',
  'Nuclear' : '/image/energy-type-white/nuclear-w.png',
  'Oil' : '/image/energy-type-white/oil-w.png',
  'Solar' : '/image/energy-type-white/solar-w.png',
  'Wind' : '/image/energy-type-white/wind-w.png',
};

var energy_chain_image_color = {
  'End use' : '/image/energy-stage-on/enduse.png',
  'Exploration' : '/image/energy-stage-on/exploration.png',
  'Extraction' : '/image/energy-stage-on/extraction.png',
  'Power plant' : '/image/energy-stage-on/powerplant.png',
  'Processing' : '/image/energy-stage-on/processing.png',
  'Storage' : '/image/energy-stage-on/storage.png',
  'Transport' : '/image/energy-stage-on/transport.png',
  'Waste processing' : '/image/energy-stage-on/waste.png',
};

// Color for the circles in the map
var energy_color = {
  'Battery' : '#F49064',
  'Biomass' : '#7FAD3E',
  'Coal' : '#606060',
  'Electricity' : '#FFCC33',
  'Fuel cell' : '#A0A0A0',
  'Geothermal' : '#992825',
  'Hydrogen' : '#7E3874',
  'Hydropower' : '#1EA2E2',
  'LPG' : '#33A594',
  'Marine' : '#197EBF',
  'Natural gas' : '#DB4C60',
  'Nuclear' : '#DEAA00',
  'Oil' : '#A39AE7',
  'Solar' : '#E5632F',
  'Wind' : '#21A554',
  'NA' : 'black',
  'Non-hydro' : 'pink',
};

var energy_chain_image_white = {
  'End use' : '/image/energy-stage-white/enduse-w.png',
  'Exploration' : '/image/energy-stage-white/exploration-w.png',
  'Extraction' : '/image/energy-stage-white/extraction-w.png',
  'Power plant' : '/image/energy-stage-white/powerplant-w.png',
  'Processing' : '/image/energy-stage-white/processing-w.png',
  'Storage' : '/image/energy-stage-white/storage-w.png',
  'Transport' : '/image/energy-stage-white/transportation-w.png',
  'Waste processing' : '/image/energy-stage-white/waste-w.png',
}

var damage_on = {
  'Evacuees' : '/image/damage-on/evacuees.png',
  'Fatalities' : '/image/damage-on/fatalities.png',
  'Injured' : '/image/damage-on/injured.png',
  'Spill size' : '/image/damage-on/spillsize.png',
  'Economics' : '/image/damage-on/dollars.png',
}

var damage_on = {
  'Evacuees' : '/image/damage-on/evacuees.png',
  'Fatalities' : '/image/damage-on/fatalities.png',
  'Injured' : '/image/damage-on/injured.png',
  'Spill size' : '/image/damage-on/spillsize.png',
  'Economics' : '/image/damage-on/dollars.png',
}

var damage_off = {
  'Evacuees' : '/image/damage-off/evacuees.png',
  'Fatalities' : '/image/damage-off/fatalities.png',
  'Injured' : '/image/damage-off/injured.png',
  'Spill size' : '/image/damage-off/spillsize.png',
  'Economics' : '/image/damage-off/dollars.png',
}

var zoom_level = 3;
var clustered_points_location = [];
var clustered_points_information = [];
var zoom = {
  3 : 16,
  4 : 12,
  5 : 7,
}
var new_map = 1;
var dbscan;
var clusters;
var single_icon;
var touch = 0;

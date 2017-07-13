//////////////////////////////////
////    To retrieve image     ////
//////////////////////////////////

/*
Purpose : To retrieve the images according to the energy type
Rule : The object's keys will follow the name indicated on the 'Menu' in the interface
*/

// Energy type image with color
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
  'Solarthermal' : '/image/energy-type-on/solar.png',
  'Wind' : '/image/energy-type-on/wind.png',
  'Solar photovolatic' : '/image/energy-type-on/solarp.png',
  'Not applicable' : '/image/energy-type-on/na.png',
  'Non-hydro' : '/image/energy-type-on/nonhydro.png',
};

// Energy type image without color
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
  'Solarthermal' : '/image/energy-type-white/solar-w.png',
  'Wind' : '/image/energy-type-white/wind-w.png',
  'Solar photovolatic' : '/image/energy-type-white/solarp-w.png',
  'Not applicable' : '/image/energy-type-white/na-w.png',
  'Non-hydro' : '/image/energy-type-white/nonhydro-w.png',
};

// Energy chain image with color
var energy_chain_image_color = {
  'Other end use' : '/image/energy-stage-on/enduse.png',
  'Exploration' : '/image/energy-stage-on/exploration.png',
  'Extraction' : '/image/energy-stage-on/extraction.png',
  'Power plant' : '/image/energy-stage-on/powerplant.png',
  'Processing' : '/image/energy-stage-on/processing.png',
  'Storage' : '/image/energy-stage-on/storage.png',
  'Transport' : '/image/energy-stage-on/transport.png',
  'Waste processing' : '/image/energy-stage-on/waste.png',
  'Domestic and commercial end use' : '/image/energy-stage-on/enduse-dom.png',
};

// Energy chain image without color
var energy_chain_image_white = {
  'End use' : '/image/energy-stage-white/enduse-w.png',
  'Exploration' : '/image/energy-stage-white/exploration-w.png',
  'Extraction' : '/image/energy-stage-white/extraction-w.png',
  'Power plant' : '/image/energy-stage-white/powerplant-w.png',
  'Processing' : '/image/energy-stage-white/processing-w.png',
  'Storage' : '/image/energy-stage-white/storage-w.png',
  'Transport' : '/image/energy-stage-white/transportation-w.png',
  'Waste processing' : '/image/energy-stage-white/waste-w.png',
  'Domestic and commercial end use' : '/image/energy-stage-white/enduse-dom-w.png',
}

// Damage image when it is on
var damage_on = {
  'Evacuees' : '/image/damage-on/evacuees.png',
  'Fatalities' : '/image/damage-on/fatalities.png',
  'Injured' : '/image/damage-on/injured.png',
  'Spill size' : '/image/damage-on/spillsize.png',
  'Economics' : '/image/damage-on/dollars.png',
}

// Damage image when it is off
var damage_off = {
  'Evacuees' : '/image/damage-off/evacuees.png',
  'Fatalities' : '/image/damage-off/fatalities.png',
  'Injured' : '/image/damage-off/injured.png',
  'Spill size' : '/image/damage-off/spillsize.png',
  'Economics' : '/image/damage-off/dollars.png',
}

/////////////////////////////
////    Energy Color     ////
/////////////////////////////

/*
Purpose : To retrieve the color according to the energy type
Rule : The object's keys will follow the name indicated on the 'Menu' in the interface
*/

// Color for the circles in the map
var energy_color = {
  'Battery' : '#f29a7e',
  'Biomass' : '#8faf08',
  'Coal' : '#414141',
  'Electricity' : '#ffdd33',
  'Fuel cell' : '#6e6e6e',
  'Geothermal' : '#992825',
  'Hydrogen' : '#7E3874',
  'Hydropower' : '#1EA2E2',
  'LPG' : '#39b2af',
  'Marine' : '#1b68bc',
  'Natural gas' : '#DB4C60',
  'Nuclear' : '#DEAA00',
  'Oil' : '#A39AE7',
  'Solarthermal' : '#E5632F',
  'Solar photovolatic' : '#9e642b',
  'Wind' : '#1f9b4b',
  'Not applicable' : '#b4b4b4',
  'Non-hydro' : '#7fd6e2',
};

///////////////////////////
////    Transform     ////
//////////////////////////

/*
Purpose : Filter the words found in the database into a proper representation(same wording as the ones found on the 'Menu' on the interface)
Rule : The object's keys will follow the name indicated on the 'Menu' in the interface
*/

var energy_type_filter = {
  'Natural Gas' : 'Natural gas',
  'Solar Photovolatic' : 'Solar photovolatic',
  'Fuel Cell' : 'Fuel cell',
  'hydropower' : 'Hydropower',
  'battery' : 'Battery',
  'biomass' : 'Biomass',
  'coal' : 'Coal',
  'electricity' : 'Electricity',
  'fuelcell' : 'Fuel cell',
  'geothermal' : 'Geothermal',
  'hydrogen' : 'Hydrogen',
  'lpg' : 'LPG',
  'marine' : 'Marine',
  'naturalgas' : 'Natural gas',
  'nuclear' : 'Nuclear',
  'oil' : 'Oil',
  'solar' : 'Solarthermal',
  'solarp' : 'Solar photovolatic',
  'wind' : 'Wind',
  'na' : 'Not applicable',
  'nonhydro' : 'Non-hydro',
  'NA' : 'Not applicable',
};

var energy_chain_filter = {
  'Other End Use' : 'Other end use',
  'Power/Heating Plant' : 'Power plant',
  'Processing/Production' : 'Processing',
  'DOM/COM' : 'Domestic and commercial end use',
};

/* Special case */
// Left side is the one represented on the 'Menu'
// Right side is the varibles used in the coding
var damage_filter = {
  'Fatalities' : 'fatalities',
  'Injured' : 'injured',
  'Evacuees' : 'evacuees',
  'Economics' : 'economic_damage',
  'Spill size' : 'spillsize',
}

////////////////////////////////
///        Variables        ///
///////////////////////////////

var touch = 0;
var projection;
var zoom_level;

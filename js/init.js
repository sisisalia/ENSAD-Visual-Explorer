/*
Purpose :
1. Set initial setting for the map
*/

// Min year and max year
var minYear = 1860;
var maxYear = 2020;

// Link after sign out from EVE visualisation
var home = 'http://localhost:8000';

// Size of the circle in different level
var circle_size = {
  'NA' : 8.25,
  'Level 0' : 8.25,
  'Level 1' : 11.667,
  'Level 2' : 14.289419,
  'Level 3' : 16.5,
  'Level 4' : 18.447561,
  'Level 5' : 20.20829,
};

// Initial zoom level
var zoom_level = opt.minZoom + 1;
// Key == zoom level while value == distance to be clustered in km
var zoom = {
  2 : 1000,
  3 : 500,
  4 : 250,
  5 : 100,
  6 : 50,
}

// Taking example of fatalities: 0 is 'Level 0', 1 - 4 is 'Level 1' , 5 - 20 is 'Level 2', 21 - 100 is 'Level 3', 101 - 500 is 'Level 4', 501 above is 'Level 5'
var severity_level_fatalities = [0,4,20,100,500];
var severity_level_injured = [0,9,50,100,500];
var severity_level_evacuees = [0,199,1000,5000,10000];
var severity_level_spillsize = [0,199,1000,10000,100000];
var severity_level_economic_damage = [0,4.99,20,100,1000];

// Energy type included will be active in the map
var energy_type_active = ['Hydropower', 'Natural gas', 'LPG', 'Battery', 'Biomass', 'Coal', 'Electricity', 'Fuel cell', 'Geothermal', 'Hydrogen', 'Marine', 'Nuclear', 'Oil', 'Solarthermal', 'Solar photovolatic', 'Wind', 'Non-hydro', 'Not applicable'];

// Energy chain included will be filtered out from the map
var energy_chain_filter_out = [];

// This will keep range of year of accidents when the user changes the year
// years[0] will be the earliest year while years[1] will be the latest year
var years = [minYear, maxYear];

// severity level to be included
var severity_level_included = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

// Damage selected, only one damage is shown
var damage_selected = 'Fatalities';
// 0 if 'Damage' menu is not selected and 1 if 'Damage' menu is selected
var damage_active = 0;
// Toogle between 0 and 1, if user clicks 'More', it will become 1, other than that it will be kept as 0
var energy_chain_active = 0;
// Region to be filtered out
var region_filter_out = [];

$('#year-range').html(minYear + ' - ' + maxYear);

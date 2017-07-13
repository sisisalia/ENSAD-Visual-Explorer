// Get data from 'data.json' using ajax
var data = (function() {
    var data = null;
    $.ajax({
        'async': false,
        'global': false,
        'url' : 'data/data.json',
        'dataType': "json",
        'success': function(x) {
            data = x;
        }
    });
    return data;
})();

var data_size = Object.keys(data.features).length;

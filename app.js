
var map;

var initMap = function () {
    // Creating map
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
            mapTypeControl: false
        });

    // Get the input from pointA
    var input = document.getElementById('pointA');
    // Create input field on the map for the first location
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    // Create the autocomplete object
    var autocomplete = new google.maps.places.Autocomplete(input, options);
}

$(document).ready(initMap);
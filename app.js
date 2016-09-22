/*
var addSearchBox = function () {


    var box = "<input>";
    $('#searchBoxes').append(box);

}

*/
var map;
var markerArr = [];
var counter = 2;
var latArray = [];
var lngArray = [];
var autoCompleteArray = [];

function addInput(divName){
  var newdiv = document.createElement('div');
  newdiv.id = ("d" + counter);
  newdiv.innerHTML = "<input id='point" + counter + "' class='controls' type='text' placeholder='Enter a location'>";
  document.getElementById(divName).appendChild(newdiv);
  counter++;
  this.initMap();;
}
function minusInput(divName){
    if(2 < counter) {
        document.getElementById(divName).removeChild(document.getElementById('d' + (counter - 1)));
        counter--;
        this.initMap();;
    } else {
        alert("Cannot find midpoint of a single location");
    }
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false
    });

    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    for (var i = 0; i < counter; i++) {
        var input = (document.getElementById('point' + i));
        var autoComplete = new google.maps.places.Autocomplete(input);
        autoComplete.bindTo('bounds', map);
        autoCompleteArray.push(autoComplete);
    }

    var infowindow = new google.maps.InfoWindow();

    for (var a = 0; a < autoCompleteArray.length; a++){
        
        var placeObject = autoCompleteArray[a];

            placeObject.addListener('place_changed', function() {
            var place = this.getPlace();

            latArray.push(place.geometry.location.lat());
            lngArray.push(place.geometry.location.lng());

            paint (place, place.geometry.location.lat(), place.geometry.location.lng());
        });
    }

    function paint(place, lat, lng){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map
        });

        markerArr.push(marker);

        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));

        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    }

    function findMidPoint(latArr, lngArr) {

        var currLatMid = 0;
        var currLngMid = 0;

        var mid = [];

        console.log(latArr,lngArr);

        for (var x = 0; x < counter; x++) {
            console.log(latArr[x],lngArr[x]);
            currLatMid = currLatMid + latArr[x];
            currLngMid = currLngMid + lngArr[x];
        }

        var finalMid = [];
        finalMid.push(currLatMid/latArr.length);
        finalMid.push(currLngMid/lngArr.length);

        console.log(finalMid);


       return finalMid;
    }

    // function findMidPoint(latArr, lngArr) {

    //     var currLatMid;
    //     var currLngMid;

    //     var mid = [];

    //     for (var x = 0; x < counter; x++) {
    //         var lat1;
    //         var lat2;
    //         var lng1;
    //         var lng2;

    //         console.log(latArr[x], lngArr[x]);

    //         if (x <= 0) {
    //             lat1 = latArr[x];
    //             lat2 = latArr[(x+1)];

    //             lng1 = lngArr[x];
    //             lng2 = lngArr[(x+1)];

    //             mid[0] = (lat1 + lat2) / 2;
    //             mid[1] = (lng1 + lng2) / 2;
    //         } 
    //         if (x > 0) {
    //             lat2 = latArr[(x+1)];
    //             lng2 = lngArr[(x+1)];

    //             mid[0] = (currLatMid + lat2) / 2;
    //             mid[1] = (currLngMid + lng2) / 2;
               
    //         }
    //         currLatMid = mid[0];
    //         currLngMid = mid[1];
    //     }

    //     var finalMid = [];
    //     finalMid.push(currLatMid);
    //     finalMid.push(currLngMid);

    //     console.log(finalMid);


    //    return finalMid;
    // }


    $("#findButton").click(function(){
        var mid = findMidPoint(latArray, lngArray);
        findTims(mid);

    //latArray = [];
    //lngArray = [];

    });
}

function findTims(mid) {
    var bounds = new google.maps.LatLng(mid[0],mid[1]);
    var request = {
        location: bounds,
        types: ['cafe'],
        keyword: 'Tim Horton',
        rankBy: google.maps.places.RankBy.DISTANCE
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();

        paintTims(lat, lng);

    }

}


function paintTims(lat, lng) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
    });

    marker.setIcon(({
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setVisible(true);
}




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}



$(document).ready(initMap);

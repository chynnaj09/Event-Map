var marker;
var places;
var autocomplete;
var beginSearch = document.getElementById('userSearch');
// var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';

//Start declaring variables for SeatGeek
var id = 	'MzI4Mzc0M3wxNTU1NTUzMjg4LjU3';
var zipcode = 75238;
var userCity = "Dallas";

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: 32.7838, lng: -96.7832},
      mapTypeControl: false,
      panControl: false,
      zoomControl: true,
      streetViewControl: false
    });

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */ (
            document.getElementById('userInput')), {
          types: ['(cities)']
        });
    places = new google.maps.places.PlacesService(map);
  
    beginSearch.addEventListener('click', onPlaceChanged);
  }


function onPlaceChanged(e) {
    e.preventDefault();
    var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      placeMarkers();
    } else {
      document.getElementById('userInput').placeholder = 'Enter a city';
    }
  }

  function placeMarkers() {
    //calling ajax function
    var queryURL = 'https://api.seatgeek.com/2/events?client_id=' + id + '&venue.city=' + userCity;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(queryURL);
      console.log(response);
      console.log(response.events[0].venue.location.lat);
      console.log(response.events[0].venue.location.lon);
      
      //loop for setting markers
      for (var i = 0; i < response.events.length; i++) { 
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" class="firstHeading">' + response.events[i].title + '</h3>'+
        '<div id="bodyContent">'+
        '<p>Date: ' + response.events[i].datetime_local + '</p>'+
        '<p>Location: ' + response.events[i].venue.address + 
        ' ' + response.events[i].venue.extended_address + '</p>' +
        '<p><a href="'+ response.events[i].url + '">Buy your tickets now!</a>' + 
        '</p>'+
        '</div>'+
        '</div>';

        var marker = response.events[i];
        var content = contentString;
        var infowindow = new google.maps.InfoWindow();


      marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: {lat: response.events[i].venue.location.lat, lng: response.events[i].venue.location.lon}
      });
      
      google.maps.event.addListener(marker, 'click', function(content) {
        return function(){
          infowindow.close();
          infowindow.setContent(content);
          infowindow.open(map, this);
        }
      }(content));

      }
    });
  }




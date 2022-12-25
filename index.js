// Initialize and add the map
var map;
function initMap() {
    // The location of Uluru
    const cebu = { lat: 10.3156992, lng: 123.88543660000005 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: cebu,
    });
    // The marker, positioned at cebu
    const marker = new google.maps.Marker({
      position: cebu,
      map: map,
    });


    var request = {
      location: cebu,
      type:['restaurant'],
      radius: 20000
    };
  var test;
    var service = new google.maps.places.PlacesService(map);
  
    service.nearbySearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            test = results[0];
            console.log(results[i]);
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location); 
      }
    });
  }

function createMarker(location) {
    var marker = new google.maps.Marker({
      position: { lat: 11.3156992, lng: 124.88543660000005 }
    });
    marker.setMap(map);
}
  
  window.initMap = initMap;

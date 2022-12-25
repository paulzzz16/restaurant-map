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
          //console.log(results[i]);
            if (i == 0) {
                var detailsRequest = {
                    placeId: results[0].place_id;
                }
                service.getDetails(detailsRequest, function(results, status) {
                    if (status === status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                });
            }
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location); 
      }
    });
  }

function createMarker(location) {
    var marker = new google.maps.Marker({
      position: location.geometry.location,
        map: map
    });
    //marker.setMap(map);
}
  
  window.initMap = initMap;

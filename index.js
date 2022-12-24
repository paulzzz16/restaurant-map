// Initialize and add the map
function initMap() {
    // The location of Uluru
    const cebu = { lat: 10.3156992, lng: 123.88543660000005 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: cebu,
    });
    // The marker, positioned at cebu
    const marker = new google.maps.Marker({
      position: cebu,
      map: map,
    });


    var request = {
      query: 'restaurant',
      fields: ['restaurant'],
    };
  
    var service = new google.maps.places.PlacesService(map);
  
    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  }
  
  window.initMap = initMap;
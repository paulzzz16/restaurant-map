// Initialize and add the map
var map;
var searchBox;
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


    // mark only places of type restaurant
    var request = {
      location: cebu,
      type:['restaurant'],
      radius: 1000
    };
   
    callNearbySearch(request);
    
    //searchbox events
     const input = document.getElementById("current-location");
  searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
    map.fitBounds(bounds);
  });
  }

function callNearbySearch(request) {
     var service = new google.maps.places.PlacesService(map);
  
    service.nearbySearch(request, function(results, status, next_page_token) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(next_page_token);
        for (var i = 0; i < results.length; i++) {
          //console.log(results[i]);
//             if (i == 0) {
//                 var detailsRequest = {
//                     placeId: results[0].place_id
//                 }
//                 service.getDetails(detailsRequest, function(results, status) {
//                     if (status ===  google.maps.places.PlacesServiceStatus.OK) {
//                         console.log(results);
//                     }
//                 });
//             }
          
          createMarker(results[i]);
            
        }
        map.setCenter(results[0].geometry.location); 
//         while(next_page_token) {
//             callNearbySearch(request);
//         }
          
      }
    });
}

function createMarker(location) {
    var marker = new google.maps.Marker({
      position: location.geometry.location,
        map: map
    });
    marker.addListener("click", () => {
        console.log(searchBox);
        console.log(marker);
      });
}
  
  window.initMap = initMap;

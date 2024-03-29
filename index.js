// Initialize and add the map
var map;
var searchBox;
var directionsService;
var directionsRenderer;
var cafeLayer;
var fastFoodLayer;
var restaurantLayer;
var infoWindow;
function initMap() {
    // The location of Cebu
    const cebu = { lat: 10.3156992, lng: 123.88543660000005 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: cebu,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
    });


    //initialize all layer geojson
    cafeLayer = new google.maps.Data();
    fastFoodLayer = new google.maps.Data();
    restaurantLayer = new google.maps.Data();
    cafeLayer.loadGeoJson('cafe.json');
    restaurantLayer.loadGeoJson('restaurants.json');
    fastFoodLayer.loadGeoJson('fastfood.json');
    cafeLayer.setMap(map);
    restaurantLayer.setMap(map);
    fastFoodLayer.setMap(map);

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);


    // mark only places of type restaurant
    var request = {
      location: cebu,
      type:['restaurant'],
      radius: 1000
    };

    callNearbySearch(request);

//searchbox events
  const input = document.getElementById("current-location");
  input.value = 'Guadalupe, Cebu City, Cebu, Philippines';
  const filterPanel = document.getElementById("filter-panel");
  searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(filterPanel);
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
    
    // Show the information for a store when its marker is clicked.
    infoWindow = new google.maps.InfoWindow()
    cafeLayer.addListener('click', clickEvent);
    restaurantLayer.addListener('click', clickEvent);
    fastFoodLayer.addListener('click', clickEvent);
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
          
         // createMarker(results[i]);
            
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
//     marker.addListener("click", (event) => {
//         console.log(event);
//         var currentLocationValue = document.getElementById('current-location').value;
//         if (currentLocationValue) {
            
//             var request = {
//               origin: currentLocationValue,
//               destination: marker.position,
//               travelMode: 'WALKING'
//             };
//             directionsService.route(request, function(result, status) {
//             if (status == 'OK') {
//               directionsRenderer.setDirections(result);
//             }
//             });
//         }
//     });
}

const clickEvent = ((event) => {
  const category = event.feature.getProperty('category');
  const name = event.feature.getProperty('name');
  const ratings = event.feature.getProperty('user_ratings_total');
  const hours = event.feature.getProperty('hours');
  const specialty = event.feature.getProperty('specialty');
  const position = event.feature.getGeometry().get();
  const content = `
    <h5>${name}</h5>
    <p><b>Reviews: </b>${ratings}<br/><b>Open:</b> ${hours}<br/><b>Specialty:</b> ${specialty}<br/>
    <b>Category:</b> ${category}</p>
`;
  infoWindow.setContent(content);
  infoWindow.setPosition(position);
  infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
  infoWindow.open(map);
    
    var currentLocationValue = document.getElementById('current-location').value;
  if (currentLocationValue) {
      
      var request = {
        origin: currentLocationValue,
        destination: event.latLng,
        travelMode: 'WALKING'
      };
      directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
      });
  }
});

 $('#restaurant-button').on("click", function(event) {
     if ($('#restaurant-button').is('.active')) {
         restaurantLayer.setMap(null);
     } else {
         restaurantLayer.setMap(map);
     }
 });

 $('#cafe-button').on("click", function(event) {
    if ($('#cafe-button').is('.active')) {
         cafeLayer.setMap(null);
     } else {
         cafeLayer.setMap(map);
     }
 });

 $('#fast-food-button').on("click", function(event) {
    if ($('#fast-food-button').is('.active')) {
         fastFoodLayer.setMap(null);
     } else {
         fastFoodLayer.setMap(map);
     }
 });

  window.initMap = initMap;

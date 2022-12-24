// Initialize and add the map
function initMap() {
    // The location of Uluru
    const cebu = { lat: 10.3156992, lng: 123.88543660000005 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: cebu,
    });
    // The marker, positioned at cebu
    const marker = new google.maps.Marker({
      position: cebu,
      map: map,
    });
  }
  
  window.initMap = initMap;
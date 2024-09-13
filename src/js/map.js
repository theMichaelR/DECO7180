// map.js

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: { lat: -27.4698, lng: 153.0251 }, // Brisbane
      mapTypeId: 'roadmap'
  });

  // Example function to update map with boundaries (from suburbBoundaries.js)
  window.updateMapWithBoundaries = function(fetchSuburbBoundaries) {
      map.data.addGeoJson(fetchSuburbBoundaries);
  };
}
  
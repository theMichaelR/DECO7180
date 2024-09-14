// map.js

function initMap() {

  const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: { lat: -27.4698, lng: 153.0251 }, // Brisbane
      mapTypeId: 'roadmap'
  });

     // convert KML file into geoJSON
     // didn't like local file so had to link to our github
     fetch('https://raw.githubusercontent.com/theMichaelR/DECO7180/main/src/js/QPS_DIVISIONS.kml')
     .then(response => response.text())
     .then(kmlText => {
         const kml = new DOMParser().parseFromString(kmlText, 'text/xml');
         const geojson = toGeoJSON.kml(kml);

         // Add the converted GeoJSON to the map and style it
         map.data.addGeoJson(geojson);
         applyBoundaryStyles(map);

     })
     .catch(error => console.error('Error loading KML:', error));
}


// generate random colours for divions as a placeholder for real data input
function applyBoundaryStyles(map) {
  map.data.setStyle(function(feature) {
      const color = getRandomColor();
      return {
          fillColor: color,
          strokeColor: 'black',
          strokeWeight: 1,
          fillOpacity: 0.6
      };
  });
}

// generate random colour for boundary styles
function getRandomColor() {

  const random_colors = ['red', 'orange', 'yellow', 'green'];

  const index = Math.floor(Math.random() * random_colors.length);

  return random_colors[index];
}
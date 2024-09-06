// map.js

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: -27.4698, lng: 153.0251 }, // location: Brisbane
      mapTypeId: 'roadmap'
    });
  
    // Heatmap data example
    const heatmapData = [
        { location: new google.maps.LatLng(-27.4698, 153.0251), weight: 3 },
        { location: new google.maps.LatLng(-27.4708, 153.0261), weight: 2 },
        { location: new google.maps.LatLng(-27.4718, 153.0271), weight: 4 },
        { location: new google.maps.LatLng(-27.4728, 153.0241), weight: 1 },
        { location: new google.maps.LatLng(-27.4692, 153.0231), weight: 5 },
        { location: new google.maps.LatLng(-27.4688, 153.0221), weight: 2 },
        { location: new google.maps.LatLng(-27.4695, 153.0211), weight: 3 },
        { location: new google.maps.LatLng(-27.4705, 153.0281), weight: 1 },
        { location: new google.maps.LatLng(-27.4710, 153.0291), weight: 4 },
        { location: new google.maps.LatLng(-27.4720, 153.0301), weight: 5 },
      ];
  
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 30 // Adjust this value to increase/decrease circle size
      });
  
    heatmap.setMap(map);
  }
  
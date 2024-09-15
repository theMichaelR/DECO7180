// map.js

// Fetch crime data
function fetchCrimeData() {
  const resource_id = "34f74f13-3269-4916-b1a8-c5ba825972af";
  const limit = 10000;
  let offset = 0;
  let allRecords = [];

  function fetchPage() {
    const data = {
      resource_id: resource_id,
      limit: limit,
      offset: offset
    };

    return fetch("https://www.data.qld.gov.au/api/3/action/datastore_search?" + new URLSearchParams(data))
      .then(response => response.json())
      .then(data => {
        allRecords = allRecords.concat(data.result.records);
        if (data.result.records.length === limit) {
          offset += limit;
          return fetchPage();
        } else {
          return allRecords;
        }
      });
  }

  return fetchPage().catch(error => console.error('Error fetching crime data:', error));
}

// Aggregate crime data by division
function processCrimeData(records) {
  const crimeData = {};

  records.forEach(record => {
    let division = record["Division"];
    if (!division) return;

    // Normalize division names
    division = division.toLowerCase().trim();

    // Initialize division entry if not exists
    if (!crimeData[division]) {
      crimeData[division] = {
        totalOffences: 0,
        offenceCounts: {}
      };
    }

    // Sum up all offences for the division
    Object.keys(record).forEach(key => {
      if (key !== 'Division' && key !== 'Month Year' && key !== '_id') {
        const offenceCount = parseInt(record[key] || 0, 10);
        crimeData[division].totalOffences += offenceCount;

        // Sum offences per category
        if (crimeData[division].offenceCounts[key]) {
          crimeData[division].offenceCounts[key] += offenceCount;
        } else {
          crimeData[division].offenceCounts[key] = offenceCount;
        }
      }
    });
  });

  return crimeData;
}

// Main map initialization function
function initMap() {

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: -27.4698, lng: 153.0251 }, // Brisbane
    mapTypeId: 'roadmap'
  });


  // Michael I replaced your link with the one below and it didn't require CORS
  // on my machine, does it work on yours? Your old link is below:
  // https://cors-anywhere.herokuapp.com/https://gist.githubusercontent.com/theMichaelR/3c5272233ce9cf0c257cd7d9cd27a48f/raw/QPS_DIVISIONS.kml

  // Fetch and add GeoJSON data
  fetch('https://raw.githubusercontent.com/theMichaelR/DECO7180/main/src/js/QPS_DIVISIONS.kml')
    .then(response => response.text())
    .then(kmlText => {
      const kml = new DOMParser().parseFromString(kmlText, 'text/xml');
      const geojson = toGeoJSON.kml(kml);

      map.data.addGeoJson(geojson);

      // Fetch crime data after GeoJSON is loaded
      return fetchCrimeData();
    })
    .then(records => {
      const crimeCounts = processCrimeData(records);
      applyBoundaryStyles(map, crimeCounts);
    })
    .catch(error => console.error('Error loading data:', error));
  }

// Map crime data to divisions and apply styles
function applyBoundaryStyles(map, crimeData) {
  const counts = Object.values(crimeData).map(data => data.totalOffences);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  map.data.setStyle(function(feature) {
    let divisionName = feature.getProperty('Name') || feature.getProperty('name');
    if (!divisionName) return {};

    divisionName = divisionName.toLowerCase().trim();
    const divisionData = crimeData[divisionName];
    const crimeCount = divisionData ? divisionData.totalOffences : 0;
    const color = getColorForCrimeCount(crimeCount, minCount, maxCount);

    return {
      fillColor: color,
      strokeColor: 'black',
      strokeWeight: 1,
      fillOpacity: 0.6
    };
  });

  // Click listener
  map.data.addListener('click', function(event) {
    const divisionName = event.feature.getProperty('Name') || event.feature.getProperty('name');
    if (!divisionName) return;

    const divisionNameNormalized = divisionName.toLowerCase().trim();
    const divisionData = crimeData[divisionNameNormalized];

    let contentString = `<strong>${divisionName}</strong><br>`;
    if (divisionData) {
      contentString += `Total Crimes: ${divisionData.totalOffences}<br>`;
      contentString += `<ul>`;
      for (const [offence, count] of Object.entries(divisionData.offenceCounts)) {
        contentString += `<li>${offence}: ${count}</li>`;
      }
      contentString += `</ul>`;
    } else {
      contentString += 'No crime data available.';
    }

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      position: event.latLng
    });

    infowindow.open(map);
  });
}

// Generate color based on crime count
function getColorForCrimeCount(count, min, max) {
  let normalized = 0;
  if (max !== min) {
    normalized = (count - min) / (max - min);
  }

  // Interpolate between green (low crime) and red (high crime)
  const red = Math.floor(255 * normalized);
  const green = Math.floor(255 * (1 - normalized));

  return `rgb(${red}, ${green}, 0)`;
}


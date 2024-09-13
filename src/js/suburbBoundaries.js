// suburbBoundaries.js

const API_URL = 'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/suburb-boundaries/records';

// Function to fetch and display boundaries for suburbs
function fetchAllSuburbBoundaries() {
    const limit = 100;  
    
    // First request with offset 0 
    fetchSuburbsWithOffset(0, limit);

    // Second request with offset 100 
    fetchSuburbsWithOffset(100, limit);
}

// Fetch suburbs with a given offset
function fetchSuburbsWithOffset(offset, limit) {
    const params = {
        limit: limit,
        offset: offset
    };

    const url = `${API_URL}?${new URLSearchParams(params).toString()}`;

    console.log(`Fetching suburbs from offset ${offset} with limit ${limit} from URL:`, url);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                data.results.forEach(record => {
                    const suburbData = record.geo_shape;  // Get boundary data from each suburb
                    window.updateMapWithBoundaries(suburbData);  // Display the boundaries on the map
                });
                console.log(`Displayed suburbs from offset ${offset}`);
            } else {
                console.error('No data found for suburbs.');
            }
        })
        .catch(error => {
            console.error('Error fetching suburb data:', error);
        });
}

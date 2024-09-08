// digital boundaries -> https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files

// implementaion by QPS -> https://qps-ocm.s3-ap-southeast-2.amazonaws.com/index.html 

// google maps api docs -> https://developers.google.com/maps/documentation/javascript 

// all offences listed in offences.txt
const offenceCategories = [
    "Drug Offences",
    "Trafficking Drugs",
    "Possess Drugs",
    "Produce Drugs",
    "Sell Supply Drugs",
    "Other Drug Offences"
]

// Function to iterate over records and append them to the DOM
function iterateRecords(data) {
    console.log(data);

    // recordsContainer is used to store and later delete specific records
    const recordsContainer = document.getElementById('records');
    recordsContainer.innerHTML = ''; // Clear previous records

    data.result.records.forEach(function (recordValue) {

        var divisionName = recordValue["Division"];
        var MonthYear = recordValue["Month Year"];

        if (divisionName && MonthYear) {
            // Create new DOM elements
            var section = document.createElement('section');
            section.classList.add('record');

            var name = document.createElement('h2');
            name.textContent = divisionName;

            var date = document.createElement('p');
            date.textContent = "Month and Year: " + MonthYear;

            // Append the elements to the section
            section.appendChild(name);
            section.appendChild(date);

            // Loop through offence categories and create DOM elements for each
            offenceCategories.forEach(function (category) {
                if (recordValue[category] !== undefined) {
                    var offenceElement = document.createElement('p');
                    offenceElement.textContent = `${category}: ${recordValue[category]}`;
                    section.appendChild(offenceElement);
                }
            });

            // Append the section to the #records div
            recordsContainer.appendChild(section);
        }
    });
}

// Function to run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    var data = {
        resource_id: "34f74f13-3269-4916-b1a8-c5ba825972af",
        // search for a specific division (see unique_divisions.txt)
        q: "coomera",
        // change how many results are returned
        limit: 5
    };

    // Vanilla JS AJAX request using Fetch API
    fetch("https://www.data.qld.gov.au/api/3/action/datastore_search?" + new URLSearchParams(data), {
        method: 'GET',
        cache: 'default'
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => iterateRecords(data)) // Call the iterateRecords function with the fetched data
        .catch(error => console.error('Error fetching data:', error)); // Handle errors
});

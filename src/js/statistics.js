// offences here will be shown in checkboxes
const selectedOffences = [
    "Assault",
    "Sexual Offences",
    "Unlawful Entry",
    "Vehicles (steal from/enter with intent)",
    "Other Stealing",
    "Offences Against Property",
    "Drug Offences",
    "Public Nuisance",
    "Drink Driving",
    "Other Offences"
]

// Function to dynamically generate checkboxes for each category
function generateCheckboxes() {
    const checkboxContainer = document.getElementById('checkboxContainer');
    
    selectedOffences.forEach(category => {
        const checkboxWrapper = document.createElement('div');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category;
        checkbox.value = category;
        checkbox.checked = true; // Default to checked

        const label = document.createElement('label');
        label.htmlFor = category;
        label.textContent = category;

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        checkboxContainer.appendChild(checkboxWrapper);
    });
}

// Function to sum offences in a given range
function sumOffencesInRange(data, startDate, endDate, selectedOffences) {
    // Convert start and end dates to a comparable format (assuming format is MMMYY)
    const start = new Date(startDate + "-01");
    const end = new Date(endDate + "-01");

    // Initialize an object to store the sums for each category
    let offenceSums = {};
    selectedOffences.forEach(category => {
        offenceSums[category] = 0;
    });

    // Initilise division name for later
    let divisionName = '';

    // Iterate over the records
    data.result.records.forEach(function (recordValue) {
        var currentDivisionName = recordValue["Division"];
        var MonthYear = recordValue["Month Year"];
        
        if (currentDivisionName && MonthYear) {
            // Set division name
            if (!divisionName) {
                divisionName = currentDivisionName;
            }
            
            // Parse the MonthYear field into a Date object for comparison
            let recordDate = new Date(MonthYear + "-01");

            // Check if the record is within the date range
            if (recordDate >= start && recordDate <= end) {
                // Sum up the offences for each category
                selectedOffences.forEach(function (category) {
                    if (recordValue[category] !== undefined) {
                        offenceSums[category] += parseInt(recordValue[category], 10);
                    }
                });
            }
        }
    });

    console.log(divisionName, startDate, endDate, offenceSums);
    return { offenceSums, divisionName };
}

// Function to iterate over records and append them to the DOM
function createChart(data, startDate, endDate, selectedOffences) {

    // Sum offences within the desired range (JAN02 to JAN04 for example)
    const { offenceSums, divisionName } = sumOffencesInRange(data, startDate, endDate, selectedOffences);

    const offenceLabels = selectedOffences;
    const offenceData = offenceLabels.map(category => offenceSums[category]);

    const ctx = document.getElementById('offencesChart').getContext('2d');
    
    // If chart already exists, destroy it before creating a new one
    if (window.offencesChart instanceof Chart) {
        window.offencesChart.destroy();
    }

    // Create a new bar chart using Chart.js
    window.offencesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: offenceLabels,
            datasets: [{
                label: `Offence Counts for ${divisionName} (${startDate} to ${endDate})`,
                data: offenceData,
                backgroundColor: 'lightblue',
                borderColor: 'blue',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to fetch data and display results
function fetchData(suburb, startDate, endDate, selectedOffences) {
    const data = {
        resource_id: "34f74f13-3269-4916-b1a8-c5ba825972af",
        q: suburb,
        limit: 1000
    };

    fetch("https://www.data.qld.gov.au/api/3/action/datastore_search?" + new URLSearchParams(data), {
        method: 'GET',
        cache: 'default'
    })
        .then(response => response.json())
        .then(data => createChart(data, startDate, endDate, selectedOffences)) 
        .catch(error => console.error('Error fetching data:', error));
}

// Function to get the selected crime categories from checkboxes
function getSelectedCategories() {
    return selectedOffences.filter(category => document.getElementById(category).checked);
}

// Add event listener for the form submission
document.getElementById('submitBtn').addEventListener('click', function () {
    // Get values from the form inputs
    let suburb = document.getElementById('suburb').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    //Populate blank fields with default values
    if (!suburb) {
        suburb = "Brisbane";
    }
    if (!startDate) {
        startDate = "JUN01";
    }
    if (!endDate) {
        endDate = "JUL21";
    }

    // Get selected categories
    const selectedCategories = getSelectedCategories();

    // Fetch and display data based on user input or default values
    fetchData(suburb, startDate, endDate, selectedCategories);
});

// Generate checkboxes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', generateCheckboxes);
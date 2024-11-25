// Import dependencies
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files like HTML/CSS

// Dummy database in JSON
const dataFilePath = './data.json';  // JSON file to store data

// Load JSON data
const loadData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Save JSON data
const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Routes

// Get all threat alerts
app.get('/api/alerts', (req, res) => {
    const data = loadData();
    res.json(data.alerts);
});

// Add a new threat alert
app.post('/api/alerts', (req, res) => {
    const data = loadData();
    const newAlert = req.body;
    data.alerts.push(newAlert);
    saveData(data);
    res.status(201).json(newAlert);
});

// Acknowledge an alert
app.put('/api/alerts/:id', (req, res) => {
    const data = loadData();
    const alertId = req.params.id;
    const alertIndex = data.alerts.findIndex(alert => alert.id === alertId);

    if (alertIndex !== -1) {
        data.alerts[alertIndex].acknowledged = true;
        saveData(data);
        res.json(data.alerts[alertIndex]);
    } else {
        res.status(404).json({ message: 'Alert not found' });
    }
});

// Get user settings
app.get('/api/settings', (req, res) => {
    const data = loadData();
    res.json(data.userSettings);
});

// Update user settings
app.put('/api/settings', (req, res) => {
    const data = loadData();
    data.userSettings = req.body;
    saveData(data);
    res.json(data.userSettings);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
fetch('/api/alerts')
    .then(response => response.json())
    .then(data => {
        // Display data in the alert cards
        console.log(data);
    })
    .catch(error => console.error('Error fetching alerts:', error));
// afterlog.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/alerts')
    .then(response => response.json())
    .then(data => {
        // Display the alerts dynamically on the page
        let alertsContainer = document.getElementById("alerts-container");
        data.forEach(alert => {
            let alertCard = document.createElement("div");
            alertCard.classList.add("alert-card");

            alertCard.innerHTML = `
                <h3>${alert.type}</h3>
                <p>Location: ${alert.location}</p>
                <p>Time: ${alert.time}</p>
                <button onclick="acknowledgeAlert(${alert.id})">Acknowledge</button>
            `;

            alertsContainer.appendChild(alertCard);
        });
    })
    .catch(error => console.error("Error fetching alerts:", error));
});

function acknowledgeAlert(alertId) {
    // Logic to handle acknowledging the alert, e.g., marking it as resolved
    console.log(`Acknowledging alert with ID: ${alertId}`);
}
// Fetch data from the backend API
fetch('/api/alerts')
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
        // Handle the data (e.g., display it on the page)
        console.log(data);  // Log it to the console to verify
        displayAlerts(data);  // Function to display data in HTML
    })
    .catch(error => {
        console.error('Error fetching alerts:', error);  // Handle errors
    });

// Function to display alerts on the webpage
function displayAlerts(alerts) {
    const alertContainer = document.getElementById('alert-container');
    alerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.classList.add('alert-card');
        
        alertCard.innerHTML = `
            <h3>Alert Type: ${alert.type}</h3>
            <p>Location: ${alert.location}</p>
            <p>Time: ${alert.time}</p>
        `;
        
        alertContainer.appendChild(alertCard);  // Append the new alert card
    });
}


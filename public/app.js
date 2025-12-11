// Logic: Fetches data and updates the HTML cards
const DASHBOARD_CONTAINER = document.getElementById('dashboard-container');
const LOCATIONS = ["DowsLake", "FifthAvenue", "NAC"];
const REFRESH_INTERVAL_MS = 30000; // Auto-refresh every 30 seconds (Requirement)

// Helper to get the correct color for the safety status badge
function getSafetyStyle(status) {
    switch (status) {
        case 'Safe':
            return { color: '#28a745' }; 
        case 'Caution':
            return { color: '#ffc107' }; 
        case 'Unsafe':
            return { color: '#dc3545' }; 
        default:
            return { color: '#6c757d' }; 
    }
}

// Function to draw the entire dashboard
async function updateDashboard() {
    try {
        // 1. Fetch data from the local server API
        const response = await fetch('/api/latest');
        const data = await response.json();

        DASHBOARD_CONTAINER.innerHTML = ''; // Clear old cards

        // 2. Create and update a card for each location (Requirement)
        LOCATIONS.forEach(location => {
            const sensorData = data[location];
            let cardHTML;

            if (sensorData) {
                const { color } = getSafetyStyle(sensorData.SafetyStatus);
                
                // Real-time data display (Requirement) & Safety status badges (Requirement)
                cardHTML = `
                    <div class="card">
                        <h2>${location.replace(/([A-Z])/g, ' $1').trim()}</h2>
                        <div class="status-badge" style="background-color: ${color};">${sensorData.SafetyStatus}</div>
                        <p>Ice Thickness (Max): <strong>${sensorData.MaxIceThickness_cm} cm</strong></p>
                        <p>Surface Temp (Max): <strong>${sensorData.MaxSurfaceTemperature_C} °C</strong></p>
                        <p class="timestamp">Window End: ${new Date(sensorData.WindowEndTime).toLocaleTimeString()}</p>
                    </div>
                `;
            } else {
                // Display message if data hasn't arrived yet
                cardHTML = `
                    <div class="card no-data">
                        <h2>${location.replace(/([A-Z])/g, ' $1').trim()}</h2>
                        <p>Status: Awaiting data...</p>
                    </div>
                `;
            }
            DASHBOARD_CONTAINER.innerHTML += cardHTML;
        });

        // 3. Update the overall system status time
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();

    } catch (error) {
        console.error('Could not fetch data:', error);
        DASHBOARD_CONTAINER.innerHTML = '<div class="error-message">ERROR: Failed to connect to backend server.</div>';
    }
}

// Start the auto-refresh loop (Requirement)
updateDashboard(); // Run once immediately
setInterval(updateDashboard, REFRESH_INTERVAL_MS);
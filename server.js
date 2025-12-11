// Server: Connects to Redis and serves data to the web page
const express = require('express');
const redis = require('redis');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// --- Redis Configuration ---
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;
const AGGREGATION_KEY_PREFIX = 'AGGREGATION:';
const LOCATIONS = ["DowsLake", "FifthAvenue", "NAC"];

// Create Redis Client
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
    process.exit(1); 
});

// Connect to Redis
(async () => {
    try {
        await client.connect();
        console.log('Connection successful to local Redis server.');
    } catch (e) {
        // Error handling is managed by the 'error' event listener
    }
})();


// --- API Endpoint (Core Requirement) ---
// This endpoint pulls the LATEST safety data from the Redis Hashes
app.get('/api/latest', async (req, res) => {
    const data = {};

    try {
        const fetchPromises = LOCATIONS.map(location => 
            client.hGetAll(AGGREGATION_KEY_PREFIX + location)
        );

        const results = await Promise.all(fetchPromises);

        // Map results back to location names
        results.forEach((result, index) => {
            if (Object.keys(result).length > 0) {
                data[LOCATIONS[index]] = result;
            }
        });
        
        // Send the compiled data
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Redis:', error);
        res.status(500).json({ error: 'Failed to retrieve real-time data.' });
    }
});


// --- Static File Hosting ---
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Dashboard server running at http://localhost:${PORT}`);
});
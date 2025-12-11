const express = require('express');
const cors = require('cors');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(cors());
app.use(express.json());

// ---- Cosmos Settings ----
const endpoint = "YOUR_COSMOS_ENDPOINT";
const key = "YOUR_COSMOS_KEY";

const client = new CosmosClient({ endpoint, key });

const databaseId = "RideauCanalDB";
const containerId = "SensorAggregations";

// ---- API ROUTES ----

// Get all items (last 50)
app.get('/api/data', async (req, res) => {
    try {
        const container = client.database(databaseId).container(containerId);

        const query = {
            query: "SELECT * FROM c ORDER BY c.window_end DESC OFFSET 0 LIMIT 50"
        };

        const { resources } = await container.items.query(query).fetchAll();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Get by location
app.get('/api/data/:location', async (req, res) => {
    try {
        const container = client.database(databaseId).container(containerId);

        const query = {
            query: "SELECT * FROM c WHERE c.location = @loc ORDER BY c.window_end DESC",
            parameters: [{ name: "@loc", value: req.params.location }]
        };

        const { resources } = await container.items.query(query).fetchAll();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
);

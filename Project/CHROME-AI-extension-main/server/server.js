const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let aiUsageData = {}; // Store the extension's data

// Endpoint to receive data from the Chrome extension
app.post('/update-data', (req, res) => {
    aiUsageData = req.body;
    res.json({ success: true });
});

// Endpoint to fetch stored data from the extension
app.get('/get-data', (req, res) => {
    res.json(aiUsageData);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

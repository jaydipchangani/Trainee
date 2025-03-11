const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const EXTENSION_ID = "ekcjghgfnphnbaiknfplkmjpnflbdban"; // Replace with your actual extension ID

async function fetchExtensionData() {
    return new Promise((resolve) => {
        exec(`curl -s --unix-socket /tmp/chrome-remote-debug.sock http://localhost:3000/json`, (error, stdout) => {
            if (error) {
                console.error("Error fetching extension data:", error);
                resolve({});
            } else {
                resolve(JSON.parse(stdout));
            }
        });
    });
}

app.get("/get-data", async (req, res) => {
    try {
        const extensionData = await fetchExtensionData();
        res.json(extensionData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch extension data" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

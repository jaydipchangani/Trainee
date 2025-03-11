document.addEventListener("DOMContentLoaded", function () {
    loadAIUsage();
    document.getElementById("refreshBtn").addEventListener("click", loadAIUsage);
});

function loadAIUsage() {
    let today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get([today], function (result) {
        let data = result[today] || {
            aiTime: 0,
            aiUsage: {},
            lastAIUsed: {},
            tabsClosed: 0,
            tabsOpened: 0,
            totalTime: 0
        };

        let output = `
            <h3>Today's AI Usage</h3>
            <p><strong>Total AI Time:</strong> ${formatTime(data.aiTime)}</p>
            <p><strong>Last AI Used:</strong> ${data.lastAIUsed.website || "None"} at ${new Date(data.lastAIUsed.timestamp || 0).toLocaleTimeString()}</p>
            <h3>AI Usage Breakdown:</h3>
            <ul>
        `;
        for (let site in data.aiUsage) {
            output += `<li>${site}: ${formatTime(data.aiUsage[site])}</li>`;
        }
        output += `</ul>`;

        document.getElementById("usageData").innerHTML = output;
    });
}

// Format time in HH:MM:SS
function formatTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

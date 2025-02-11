document.addEventListener("DOMContentLoaded", () => {
    const totalTimeEl = document.getElementById("total-time");
    const sessionTimeEl = document.getElementById("session-time");
    const visitedSitesEl = document.getElementById("visited-sites");
    const settingsBtn = document.getElementById("open-settings");

    let sessionStart = Date.now();

    function updateSessionTime() {
        let sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
        sessionTimeEl.textContent = formatTime(sessionDuration);
    }

    // Load stored AI usage time
    function loadTotalTime() {
        chrome.storage.local.get(["ai_usage_today", "visited_sites"], (data) => {
            totalTimeEl.textContent = formatTime(data.ai_usage_today || 0);
            visitedSitesEl.innerHTML = (data.visited_sites || []).map(site => `<li>${site}</li>`).join("");
        });
    }

    // Update total time every second
    setInterval(loadTotalTime, 1000);
    setInterval(updateSessionTime, 1000);

    settingsBtn.addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });
});

// Convert seconds to readable time format
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}

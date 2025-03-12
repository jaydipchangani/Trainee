document.addEventListener("DOMContentLoaded", () => {
    const totalTimeEl = document.getElementById("total-time");
    const aiTimeEl = document.getElementById("ai-time");
    const sessionsEl = document.getElementById("sessions");
    const resetBtn = document.getElementById("reset");
    const exportBtn = document.getElementById("export");

    function formatTime(ms) {
        let sec = Math.floor(ms / 1000);
        let min = Math.floor(sec / 60);
        let hr = Math.floor(min / 60);
        sec %= 60;
        min %= 60;
        return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    function updateUI() {
        let storedData = JSON.parse(localStorage.getItem("AITimeTracker")) || {};
        let today = new Date().toISOString().split("T")[0];
    
        let totalTracked = Object.values(storedData).reduce((sum, val) => sum + val, 0);
        let todayTracked = storedData[today] || 0;
    
        totalTimeEl.textContent = formatTime(totalTracked);
        aiTimeEl.textContent = formatTime(todayTracked);
    
        // ✅ Remove session history from UI
        sessionsEl.innerHTML = "";
    }
    

    setInterval(updateUI, 1000);

    resetBtn.addEventListener("click", () => {
        chrome.storage.local.clear(() => location.reload());
    });

    exportBtn.addEventListener("click", () => {
        chrome.storage.local.get("AITimeTracker", (data) => {
            const blob = new Blob([JSON.stringify(data.AITimeTracker, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            chrome.downloads.download({ url, filename: "AITimeTracker.json" });
        });
    });

    updateUI();

    // Auto-close popup when clicking outside
    document.addEventListener("click", (event) => {
        if (!document.body.contains(event.target)) {
            window.close();
        }
    });
});


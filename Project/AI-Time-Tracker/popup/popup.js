document.addEventListener("DOMContentLoaded", () => {
    const totalTimeEl = document.getElementById("total-time");
    const usageListEl = document.getElementById("usage-list");

    function loadTotalTime() {
        chrome.storage.local.get(["ai_usage"], (data) => {
            const aiUsage = data.ai_usage || {};
            let totalMinutes = 0;
            let usageHtml = "";

            for (let ai in aiUsage) {
                totalMinutes += aiUsage[ai];
                usageHtml += `<li>${ai}: ${aiUsage[ai]} minutes</li>`;
            }

            totalTimeEl.textContent = `Total AI Usage: ${totalMinutes} minutes`;
            usageListEl.innerHTML = usageHtml;
        });
    }

    setInterval(loadTotalTime, 1000);
    loadTotalTime();
});

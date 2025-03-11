document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup.js Loaded 🚀");
    
    updateStats();
    setInterval(updateStats, 1000); // Update UI every second

    // Ensure reset button exists before adding event listener
    const resetBtn = document.getElementById("resetData");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetTrackingData);
    } else {
        console.warn("⚠ Reset button not found!");
    }

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes) {
            console.log("🔄 Storage changed, updating UI...");
            updateStats();
        }
    });
});

function updateStats() {
    console.log("📦 Fetching stored data...");
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get(today, (result) => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error fetching storage:", chrome.runtime.lastError);
            return;
        }

        const data = result[today];
        if (!data) {
            console.log("⚠ No data found for today, initializing storage...");
            initializeStorage(today);
            return;
        }

        console.log("✅ Retrieved data:", data);

        // Update UI elements (ensure they exist before updating)
        setTextContent("totalTime", formatTimerTime(data.totalTime || 0));
        setTextContent("aiTime", formatTimerTime(data.aiTime || 0));
        setTextContent("tabsOpened", data.tabsOpened || 0);
        setTextContent("tabsClosed", data.tabsClosed || 0);

        // Update AI usage list
        updateAIUsageList(data.aiUsage || {});

        // Update last used AI tool
        const lastUsedElement = document.getElementById("lastUsedAI");
        if (lastUsedElement) {
            if (data.lastAIUsed && data.lastAIUsed.website) {
                const timeAgo = formatTimeAgo(new Date(data.lastAIUsed.timestamp));
                lastUsedElement.textContent = `${data.lastAIUsed.website} (${timeAgo})`;
            } else {
                lastUsedElement.textContent = "None";
            }
        } else {
            console.warn("⚠ lastUsedAI element not found!");
        }

        // Force UI refresh if needed
        // forceReflow();
    });
}

function initializeStorage(today) {
    console.log("🛠 Initializing storage for today...");
    const defaultData = {
        totalTime: 0,
        aiTime: 0,
        tabsOpened: 0,
        tabsClosed: 0,
        aiUsage: {},
        lastAIUsed: null
    };

    chrome.storage.local.set({ [today]: defaultData }, () => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error initializing storage:", chrome.runtime.lastError);
        } else {
            console.log("✅ Storage initialized:", today);
            updateStats();
        }
    });
}

function updateAIUsageList(aiUsage) {
    const aiUsageList = document.getElementById("aiUsageList");
    if (!aiUsageList) {
        console.warn("⚠ aiUsageList element not found!");
        return;
    }

    aiUsageList.innerHTML = "";

    Object.entries(aiUsage).forEach(([website, time]) => {
        if (website && time) {
            const div = document.createElement("div");
            div.className = "ai-usage-item";
            div.innerHTML = `
                <span class="website">${website}</span>
                <span class="time">${formatTimerTime(time)}</span>
            `;
            aiUsageList.appendChild(div);
        }
    });
}

function formatTimerTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
}

function padNumber(num) {
    return String(num).padStart(2, "0");
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Function to reset tracking data
function resetTrackingData() {
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.remove(today, () => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error resetting data:", chrome.runtime.lastError);
        } else {
            console.log("✅ Tracking data reset for today.");
            initializeStorage(today);
        }
    });
}

// Utility function to safely update text content
function setTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`⚠ Element '${elementId}' not found!`);
    }
}

// Force UI refresh to apply changes
function forceReflow() {
    document.body.style.display = "none";
    document.body.offsetHeight;  // Trigger reflow
    document.body.style.display = "";
}


// desktop app

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        const data = await new Promise((resolve) => {
            chrome.storage.local.get(null, (result) => {
                resolve(result);
            });
        });

        fetch("http://localhost:5000/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        sendResponse({ success: true });
    }
});



let activeTabId = null;
let startTime = null;
let totalTime = {};
const AI_SITES = {
    "openai.com": "ChatGPT",
    "gemini.google.com": "Gemini",
    "perplexity.ai": "Perplexity",
    "claude.ai": "Claude"
};

// Load stored AI usage time on startup
chrome.storage.local.get(["ai_usage"], (data) => {
    totalTime = data.ai_usage || {};
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        handleTabChange(tab);
    });
});

// Listen for tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        handleTabChange(tab);
    }
});

// Handle tab change logic
function handleTabChange(tab) {
    if (!tab || !tab.url) return;
    const url = new URL(tab.url);
    const domain = url.hostname;
    const aiName = AI_SITES[domain];

    if (aiName) {
        startTracking(tab.id, aiName);
    } else {
        stopTracking();
    }
}

// Start tracking time for an AI tool
function startTracking(tabId, aiName) {
    if (activeTabId !== tabId) {
        stopTracking();
        activeTabId = tabId;
        startTime = Date.now();
        console.log(`Tracking started for ${aiName}`);
    }
}

// Stop tracking and update storage
function stopTracking() {
    if (activeTabId && startTime) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60); // Convert to minutes
        let url = new URL(chrome.tabs.get(activeTabId).url);
        let aiName = AI_SITES[url.hostname];

        if (aiName) {
            totalTime[aiName] = (totalTime[aiName] || 0) + elapsedTime;

            // Save updated total time
            chrome.storage.local.set({ "ai_usage": totalTime }, () => {
                console.log("Total AI usage saved:", totalTime);
            });
        }
    }
    activeTabId = null;
    startTime = null;
}

// Auto-save every minute
setInterval(() => {
    if (activeTabId && startTime) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
        let url = new URL(chrome.tabs.get(activeTabId).url);
        let aiName = AI_SITES[url.hostname];

        if (aiName) {
            totalTime[aiName] = (totalTime[aiName] || 0) + elapsedTime;
            startTime = Date.now(); // Reset start time

            chrome.storage.local.set({ "ai_usage": totalTime }, () => {
                console.log("Auto-saving AI time:", totalTime);
            });
        }
    }
}, 60000);

let activeTabId = null;
let startTime = null;
let totalTime = {};
const AI_SITES = {
    "openai.com": "ChatGPT",
    "gemini.google.com": "Gemini",
    "perplexity.ai": "Perplexity",
    "claude.ai": "Claude"
};

// Load saved AI time on extension startup
chrome.storage.local.get(["ai_usage"], (data) => {
    totalTime = data.ai_usage || {};
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url) {
            handleTabChange(tab);
        }
    });
});

// Listen for tab URL updates (e.g., navigation inside a site)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        handleTabChange(tab);
    }
});

// Detect when Chrome starts and restore tracking
chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            handleTabChange(tabs[0]);
        }
    });
});

// Handle tab change
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

// Start tracking time
function startTracking(tabId, aiName) {
    if (activeTabId !== tabId) {
        stopTracking();
        activeTabId = tabId;
        startTime = Date.now();
        console.log(`Started tracking ${aiName}`);
    }
}

// Stop tracking and save elapsed time
function stopTracking() {
    if (activeTabId && startTime) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60); // Convert to minutes
        chrome.tabs.get(activeTabId, (tab) => {
            if (tab && tab.url) {
                let url = new URL(tab.url);
                let aiName = AI_SITES[url.hostname];

                if (aiName) {
                    totalTime[aiName] = (totalTime[aiName] || 0) + elapsedTime;

                    // Save updated time
                    chrome.storage.local.set({ "ai_usage": totalTime }, () => {
                        console.log("AI time saved:", totalTime);
                    });
                }
            }
        });
    }
    activeTabId = null;
    startTime = null;
}

// Auto-save time every minute
setInterval(() => {
    if (activeTabId && startTime) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
        chrome.tabs.get(activeTabId, (tab) => {
            if (tab && tab.url) {
                let url = new URL(tab.url);
                let aiName = AI_SITES[url.hostname];

                if (aiName) {
                    totalTime[aiName] = (totalTime[aiName] || 0) + elapsedTime;
                    startTime = Date.now(); // Reset start time

                    chrome.storage.local.set({ "ai_usage": totalTime }, () => {
                        console.log("Auto-saved AI time:", totalTime);
                    });
                }
            }
        });
    }
}, 60000);

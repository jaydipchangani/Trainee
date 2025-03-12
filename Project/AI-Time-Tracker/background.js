let activeTabId = null;
let startTime = null;
let isTabActive = false;
let aiWebsites = ["chatgpt.com", "gemini.google.com"];

// Detect tab activation
chrome.tabs.onActivated.addListener(({ tabId }) => checkTab(tabId));

// Detect tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        checkTab(tabId);
    }
});

// Detect tab closing
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) stopTracking();
});

// Detect window focus change (Inactive when switching apps)
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) pauseTracking();
    else checkTab(activeTabId);
});

// Check if current tab is an AI tab
function checkTab(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        if (tab && tab.url) {
            const url = new URL(tab.url);
            if (aiWebsites.includes(url.hostname)) {
                startTracking(tabId);
            } else {
                pauseTracking();
            }
        }
    });
}

// Start tracking AI time
function startTracking(tabId) {
    if (activeTabId !== tabId || !isTabActive) {
        stopTracking(); // Save previous session
        activeTabId = tabId;
        startTime = Date.now();
        isTabActive = true;
    }
}

// Pause tracking if user switches away
function pauseTracking() {
    if (isTabActive) {
        stopTracking();
        isTabActive = false;
    }
}

// Stop tracking & save session data
function stopTracking() {
    if (activeTabId && startTime) {
        const duration = Date.now() - startTime;
        saveTime(duration);
    }
    startTime = null;
}

// Save AI usage time to local storage
function saveTime(timeData) {
    chrome.storage.local.set({ AITimeTracker: timeData }, () => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error saving time:", chrome.runtime.lastError);
        } else {
            console.log("✅ Time data saved successfully.");
        }
    });
}

chrome.storage.local.get("AITimeTracker", (result) => {
    if (chrome.runtime.lastError) {
        console.error("❌ Error reading storage:", chrome.runtime.lastError);
    } else {
        const data = result.AITimeTracker || {};
        console.log("📦 Retrieved AI Tracker data:", data);
    }
});

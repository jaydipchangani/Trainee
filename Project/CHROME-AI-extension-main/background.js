let browsingStart = null;
const SERVER_URL = "http://localhost:3000/get-data";
const STORAGE_KEY = "AITimeTracker"; // Single key to store all AI tracking data

async function initializeBrowsingTime() {
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get([STORAGE_KEY], (result) => {
        const allData = result[STORAGE_KEY] || {};
        const todayData = allData[today] || {
            totalTime: 0,
            aiTime: 0,
            aiUsage: {},
            lastAIUsed: {
                website: null,
                timestamp: null
            },
            tabsOpened: 0,
            tabsClosed: 0
        };

        browsingStart = Date.now();

        // Save initial data if not already set
        chrome.storage.local.set({ [STORAGE_KEY]: { ...allData, [today]: todayData } });
    });
}

// Call on extension load
initializeBrowsingTime();

setInterval(async () => {
    if (!trackingStart) return; // Only update if tracking is active

    const today = new Date().toISOString().split("T")[0];
    const data = await getTodayData();
    const elapsed = Date.now() - trackingStart;
    const currentSite = data.lastAIUsed?.website;

    let updates = {
        totalTime: data.totalTime + 1000, // Increase total time by 1 second
    };

    if (currentSite && currentSite !== "unknown") {
        updates.aiTime = data.aiTime + 1000; // Increase AI time by 1 second
        updates.aiUsage = {
            ...data.aiUsage,
            [currentSite]: (data.aiUsage[currentSite] || 0) + 1000
        };
    }

    updateStorage(updates);
}, 1000); // Run every second

const AI_SITES = {
    "chatgpt.com": "ChatGPT",
    "claude.ai": "Claude",
    "gemini.google.com": "Gemini",
    "bard.google.com": "Bard"
};

let currentTabId = null;
let trackingStart = null;

function getCleanDomain(url) {
    try {
        const urlObj = new URL(url);
        return Object.keys(AI_SITES).find(domain => urlObj.hostname.includes(domain)) || "unknown";
    } catch {
        return "unknown";
    }
}

// Get today's data
async function getTodayData() {
    const today = new Date().toISOString().split("T")[0];
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            const allData = result[STORAGE_KEY] || {};
            resolve(allData[today] || {
                totalTime: 0,
                aiTime: 0,
                aiUsage: {},
                lastAIUsed: {
                    website: null,
                    timestamp: null
                },
                tabsOpened: 0,
                tabsClosed: 0
            });
        });
    });
}

async function sendDataToDesktopApp() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result[STORAGE_KEY] || {})
        }).catch(error => console.error("Failed to send data to desktop app:", error));
    });
}

// Send data to the desktop app every minute
setInterval(sendDataToDesktopApp, 60000);

async function updateStorage(updates) {
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get([STORAGE_KEY], (result) => {
        const allData = result[STORAGE_KEY] || {};
        const currentData = allData[today] || {
            totalTime: 0,
            aiTime: 0,
            aiUsage: {},
            lastAIUsed: {
                website: null,
                timestamp: null
            },
            tabsOpened: 0,
            tabsClosed: 0
        };

        const newData = {
            ...currentData,
            ...updates,
            aiUsage: {
                ...currentData.aiUsage,
                ...(updates.aiUsage || {})
            },
            tabsOpened: currentData.tabsOpened + (updates.tabsOpened || 0),
            tabsClosed: currentData.tabsClosed + (updates.tabsClosed || 0)
        };

        chrome.storage.local.set({ [STORAGE_KEY]: { ...allData, [today]: newData } }, () => {
            sendDataToDesktopApp();
        });
    });
}

// Track total tabs opened and closed
chrome.tabs.onCreated.addListener(() => updateStorage({ tabsOpened: 1 }));
chrome.tabs.onRemoved.addListener((tabId) => {
    if (currentTabId === tabId) stopTracking();
    updateStorage({ tabsClosed: 1 });
});

function startTracking(tabId, url) {
    if (currentTabId !== tabId) {
        stopTracking();
        currentTabId = tabId;
        trackingStart = Date.now();

        const domain = getCleanDomain(url);
        const siteName = AI_SITES[domain] || domain;

        updateStorage({
            lastAIUsed: {
                website: siteName,
                timestamp: Date.now()
            }
        });
    }
}

async function stopTracking() {
    if (currentTabId && trackingStart) {
        const elapsed = Date.now() - trackingStart;
        const data = await getTodayData();
        const currentSite = data.lastAIUsed?.website;

        const updates = {
            aiTime: data.aiTime + (currentSite && currentSite !== "unknown" ? elapsed : 0),
            aiUsage: {
                ...data.aiUsage,
                [currentSite]: (data.aiUsage[currentSite] || 0) + (currentSite && currentSite !== "unknown" ? elapsed : 0)
            }
        };

        await updateStorage(updates);
        trackingStart = null;
        currentTabId = null;
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.status === "complete") {
        if (!tab.url) return;

        const domain = getCleanDomain(tab.url);
        if (domain in AI_SITES) {
            startTracking(tabId, tab.url);
        } else if (currentTabId === tabId) {
            stopTracking();
        }
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        const domain = getCleanDomain(tab.url);

        if (domain in AI_SITES) {
            startTracking(activeInfo.tabId, tab.url);
        } else {
            stopTracking();
        }
    } catch (error) {
        console.error("Error in tab activation:", error);
    }
});

// Setup daily reset
chrome.alarms.create("dailyReset", { 
    when: getNextMidnight(),
    periodInMinutes: 1440
});

function getNextMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime();
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "dailyReset") {
        chrome.storage.local.set({ [STORAGE_KEY]: {} });
    }
});

// Desktop app data retrieval
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        chrome.storage.local.get([STORAGE_KEY], (result) => sendResponse(result[STORAGE_KEY] || {}));
    }
    return true;
});

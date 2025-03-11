console.log("AI Time Tracker background script running!");

let startTime = null;
let activeTabId = null;
let activeAI = null;
const AI_SITES = ["chat.openai.com", "bard.google.com", "gemini.google.com"];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabChange(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        handleTabChange(tab);
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
        stopTracking();
    }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        stopTracking();
    } else {
        const [tab] = await chrome.tabs.query({ active: true, windowId });
        if (tab) handleTabChange(tab);
    }
});

function handleTabChange(tab) {
    const url = new URL(tab.url);
    const domain = url.hostname;

    if (AI_SITES.includes(domain)) {
        if (activeTabId !== tab.id) {
            stopTracking();
            startTracking(tab.id, domain);
        }
    } else {
        stopTracking();
    }
}

function startTracking(tabId, aiName) {
    startTime = Date.now();
    activeTabId = tabId;
    activeAI = aiName;
}

function stopTracking() {
    if (startTime && activeAI) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        saveAIUsage(elapsedTime, activeAI);
    }
    startTime = null;
    activeTabId = null;
    activeAI = null;
}

function saveAIUsage(elapsedTime, aiName) {
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get([today], function (result) {
        let data = result[today] || {
            aiTime: 0,
            aiUsage: {},
            lastAIUsed: {},
            tabsClosed: 0,
            tabsOpened: 0,
            totalTime: 0
        };

        data.aiTime += elapsedTime;
        data.aiUsage[aiName] = (data.aiUsage[aiName] || 0) + elapsedTime;
        data.lastAIUsed = {
            timestamp: Date.now(),
            website: aiName
        };

        chrome.storage.local.set({ [today]: data });
    });
}

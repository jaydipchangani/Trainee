const AI_WEBSITES = {
    'chat.openai.com': 'ChatGPT',
    'www.deepseek.com': 'DeepSeek',
    'gemini.google.com': 'Gemini'
    // Add more domains as needed
  };


  let activeTabs = {}; // Format: { tabId: { domain: '...', startTime: 1234 } }

// When a tab is updated (e.g., URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleTabUpdate(tabId, changeInfo.url);
  }
});

// When a tab is activated (focused)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) handleTabUpdate(activeInfo.tabId, tab.url);
  });
});

// When a tab is closed or deactivated
chrome.tabs.onRemoved.addListener((tabId) => stopTracking(tabId));

function handleTabUpdate(tabId, url) {
    const domain = new URL(url).hostname;
    
    // Stop tracking if the tab is no longer on an AI site
    if (!AI_WEBSITES[domain]) {
      stopTracking(tabId);
      return;
    }
  
    // Start tracking if not already tracked
    if (!activeTabs[tabId]) {
      activeTabs[tabId] = {
        domain: domain,
        startTime: Date.now()
      };
    }
  }
  
  function stopTracking(tabId) {
    if (!activeTabs[tabId]) return;
  
    // Calculate time spent
    const { domain, startTime } = activeTabs[tabId];
    const elapsed = Date.now() - startTime;
    delete activeTabs[tabId];
  
    // Save to storage
    chrome.storage.local.get([domain], (result) => {
      const totalTime = (result[domain] || 0) + elapsed;
      chrome.storage.local.set({ [domain]: totalTime });
    });
  }


// Get current date key for storage
function getDateKey(domain) {
  return `${domain}_${getCurrentDate()}`;
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Existing tab tracking logic remains the same...

function stopTracking(tabId) {
  if (!activeTabs[tabId]) return;

  const { domain, startTime } = activeTabs[tabId];
  const elapsed = Date.now() - startTime;
  delete activeTabs[tabId];

  // Save with date-based key
  const storageKey = getDateKey(domain);
  
  chrome.storage.local.get([storageKey], (result) => {
    const totalTime = (result[storageKey] || 0) + elapsed;
    chrome.storage.local.set({ [storageKey]: totalTime });
  });
}

// background.js (critical fix for numeric storage)
function stopTracking(tabId) {
    if (!activeTabs[tabId]) return;
  
    const { domain, startTime } = activeTabs[tabId];
    const elapsed = Date.now() - startTime;
    delete activeTabs[tabId];
  
    const storageKey = `${domain}_${getCurrentDate()}`;
  
    chrome.storage.local.get([storageKey], (result) => {
      // Ensure numeric values
      const previousTime = Number(result[storageKey]) || 0;
      const totalTime = previousTime + elapsed;
      chrome.storage.local.set({ [storageKey]: totalTime });
    });
  }
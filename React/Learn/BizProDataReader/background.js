// background.js

// Your existing install log
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// New message listener for Angular communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_DATA") {
    chrome.storage.local.get([request.key], (result) => {
      if (chrome.runtime.lastError) {
        console.error("[Background] Storage error:", chrome.runtime.lastError);
        sendResponse({ data: null });
      } else {
        sendResponse({ data: result[request.key] || null });
      }
    });
    return true; // Keep sendResponse alive for async callback
  }
});

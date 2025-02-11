const aiSites = [
    { url: "chat.openai.com", category: "Research" },
    { url: "www.perplexity.ai", category: "Research" },
    { url: "claude.ai", category: "Research" },
    { url: "gemini.google.com", category: "Research" },
    { url: "www.midjourney.com", category: "Research" },
    { url: "chat.deepseek.com", category: "Research" },   
]
  let currentSession = { startTime: null, site: null, category: null, activeTime: 0, idleTime: 0 }
  let isTracking = false
  let lastActivityTime = Date.now()
  const IDLE_TIMEOUT = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["aiSites"], (result) => {
      if (!result.aiSites) {
        chrome.storage.sync.set({ aiSites: aiSites })
      }
    })
  })
  
  function updateIcon(isActive) {
    const iconPath = isActive ? "icon.png" : "icon.png"
    chrome.action.setIcon({ path: iconPath })
  }
  
  function isAISite(url) {
    return aiSites.some((site) => url.includes(site.url))
  }
  
  function getCategoryForSite(url) {
    const site = aiSites.find((site) => url.includes(site.url))
    return site ? site.category : "Uncategorized"
  }
  
  function startTracking(tab) {
    if (isAISite(tab.url)) {
      const category = getCategoryForSite(tab.url)
      currentSession = {
        startTime: Date.now(),
        site: new URL(tab.url).hostname,
        category: category,
        activeTime: 0,
        idleTime: 0,
      }
      isTracking = true
      updateIcon(true)
      lastActivityTime = Date.now()
    }
  }
  
  function stopTracking() {
    if (isTracking && currentSession.startTime) {
      const now = Date.now()
      const totalDuration = now - currentSession.startTime
      const idleTime = Math.min(now - lastActivityTime, IDLE_TIMEOUT)
      currentSession.activeTime += totalDuration - idleTime
      currentSession.idleTime += idleTime
  
      updateUsage(currentSession)
      currentSession = { startTime: null, site: null, category: null, activeTime: 0, idleTime: 0 }
      isTracking = false
      updateIcon(false)
    }
  }
  
  function updateUsage(session) {
    const today = new Date().toDateString()
    chrome.storage.local.get(["dailyUsage"], (result) => {
      const dailyUsage = result.dailyUsage || {}
      if (!dailyUsage[today]) {
        dailyUsage[today] = {}
      }
      if (!dailyUsage[today][session.site]) {
        dailyUsage[today][session.site] = { activeTime: 0, idleTime: 0, category: session.category, visits: 0 }
      }
      dailyUsage[today][session.site].activeTime += session.activeTime / 1000 // Convert to seconds
      dailyUsage[today][session.site].idleTime += session.idleTime / 1000 // Convert to seconds
      dailyUsage[today][session.site].visits += 1
      chrome.storage.local.set({ dailyUsage: dailyUsage })
    })
  }
  
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      stopTracking()
      startTracking(tab)
    })
  })
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      stopTracking()
      startTracking(tab)
    }
  })
  
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      stopTracking()
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          stopTracking()
          startTracking(tabs[0])
        }
      })
    }
  })
  
  // Check for user activity every minute
  setInterval(() => {
    if (isTracking) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && isAISite(tabs[0].url)) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "checkActivity" }, (response) => {
            if (response && response.active) {
              lastActivityTime = Date.now()
            } else {
              const now = Date.now()
              if (now - lastActivityTime > IDLE_TIMEOUT) {
                stopTracking()
              }
            }
          })
        }
      })
    }
  }, 60000)
  
  // Reset daily usage at midnight
  setInterval(() => {
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      chrome.storage.local.get(["dailyUsage"], (result) => {
        const dailyUsage = result.dailyUsage || {}
        const today = now.toDateString()
        if (!dailyUsage[today]) {
          dailyUsage[today] = {}
          chrome.storage.local.set({ dailyUsage: dailyUsage })
        }
      })
    }
  }, 60000)
  
  // Handle messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateActivity") {
      lastActivityTime = Date.now()
    }
  })
  
  
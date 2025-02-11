document.addEventListener("DOMContentLoaded", () => {
    updatePopup()
    setInterval(updatePopup, 1000)
  
    document.getElementById("optionsBtn").addEventListener("click", () => {
      chrome.runtime.openOptionsPage()
    })
  })
  
  function updatePopup() {
    chrome.storage.local.get(["dailyUsage"], (result) => {
      const today = new Date().toDateString()
      const todayUsage = result.dailyUsage && result.dailyUsage[today] ? result.dailyUsage[today] : {}
  
      updateCurrentSession()
      updateTodayUsage(todayUsage)
      updateTotalTime(todayUsage)
    })
  }
  
  function updateCurrentSession() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab && isAISite(currentTab.url)) {
        document.getElementById("currentSite").textContent = new URL(currentTab.url).hostname
        chrome.storage.local.get(["sessionStart"], (result) => {
          if (result.sessionStart) {
            const duration = (Date.now() - result.sessionStart) / 1000
            document.getElementById("currentTime").textContent = formatTime(duration)
          }
        })
      } else {
        document.getElementById("currentSite").textContent = "Not tracking"
        document.getElementById("currentTime").textContent = "00:00:00"
      }
    })
  }
  
  function updateTodayUsage(todayUsage) {
    const usageList = document.getElementById("usageList")
    usageList.innerHTML = ""
    for (const [site, duration] of Object.entries(todayUsage)) {
      const li = document.createElement("li")
      li.textContent = `${site}: ${formatTime(duration)}`
      usageList.appendChild(li)
    }
  }
  
  function updateTotalTime(todayUsage) {
    const totalTime = Object.values(todayUsage).reduce((a, b) => a + b, 0)
    document.getElementById("totalTime").textContent = formatTime(totalTime)
  }
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }
  
  function pad(num) {
    return num.toString().padStart(2, "0")
  }
  
  function isAISite(url) {
    // This should match the logic in background.js
    const aiSites = ["chat.openai.com", "www.perplexity.ai", "claude.ai", "gemini.google.com"]
    return aiSites.some((site) => url.includes(site))
  }
  
  
// Declare the chrome variable.  This is usually done implicitly in a chrome extension, but explicitly declaring it here avoids potential errors.
const chrome = chrome || {} //This line handles cases where chrome might not be defined in certain environments for testing purposes.

document.addEventListener("DOMContentLoaded", () => {
  loadAISites()
  loadWeeklyUsage()
  setupThemeToggle()

  document.getElementById("addSite").addEventListener("click", addNewSite)
})

function loadAISites() {
  chrome.storage.sync.get(["aiSites"], (result) => {
    const siteList = document.getElementById("siteList")
    siteList.innerHTML = ""
    result.aiSites.forEach((site) => {
      const li = document.createElement("li")
      li.textContent = site
      const removeBtn = document.createElement("button")
      removeBtn.textContent = "Remove"
      removeBtn.addEventListener("click", () => {
        removeSite(site)
      })
      li.appendChild(removeBtn)
      siteList.appendChild(li)
    })
  })
}

function addNewSite() {
  const newSite = document.getElementById("newSite").value.trim()
  if (newSite) {
    chrome.storage.sync.get(["aiSites"], (result) => {
      const aiSites = result.aiSites || []
      if (!aiSites.includes(newSite)) {
        aiSites.push(newSite)
        chrome.storage.sync.set({ aiSites: aiSites }, () => {
          loadAISites()
          document.getElementById("newSite").value = ""
        })
      }
    })
  }
}

function removeSite(site) {
  chrome.storage.sync.get(["aiSites"], (result) => {
    const aiSites = result.aiSites.filter((s) => s !== site)
    chrome.storage.sync.set({ aiSites: aiSites }, loadAISites)
  })
}

function loadWeeklyUsage() {
  chrome.storage.local.get(["dailyUsage"], (result) => {
    const weeklyUsageList = document.getElementById("weeklyUsageList")
    weeklyUsageList.innerHTML = ""

    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      const dayUsage = result.dailyUsage && result.dailyUsage[dateString] ? result.dailyUsage[dateString] : {}

      const li = document.createElement("li")
      li.textContent = `${dateString}: ${formatTotalTime(dayUsage)}`
      weeklyUsageList.appendChild(li)
    }
  })
}

function formatTotalTime(dayUsage) {
  const totalSeconds = Object.values(dayUsage).reduce((a, b) => a + b, 0)
  return formatTime(totalSeconds)
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById("toggleTheme")
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const isDarkMode = document.body.classList.contains("dark-mode")
    chrome.storage.sync.set({ darkMode: isDarkMode })
  })

  // Load saved theme preference
  chrome.storage.sync.get(["darkMode"], (result) => {
    if (result.darkMode) {
      document.body.classList.add("dark-mode")
    }
  })
}


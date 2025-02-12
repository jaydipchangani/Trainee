// Import the chrome namespace.  This is typically handled by a bundler or build process in a real-world application.
// For this example, we'll just declare it as a global variable.  In a production environment, you should use a proper module system.
const chrome = {} // Declare chrome as a global object.  This is a simplification for this example.

function checkDailyLimit() {
  chrome.storage.sync.get(["dailyLimit"], (result) => {
    if (result.dailyLimit) {
      chrome.storage.local.get(["dailyUsage"], (usageResult) => {
        const today = new Date().toDateString()
        const todayUsage = usageResult.dailyUsage[today]
        if (todayUsage) {
          const totalActiveTime = Object.values(todayUsage).reduce((sum, site) => sum + site.activeTime, 0)
          if (totalActiveTime >= result.dailyLimit * 60) {
            // Convert minutes to seconds
            showAlert(`You've reached your daily AI usage limit of ${result.dailyLimit} minutes!`)
          }
        }
      })
    }
  })
}

function showAlert(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "AI Time Tracker Alert",
    message: message,
  })
}

// Check daily limit every 5 minutes
setInterval(checkDailyLimit, 5 * 60 * 1000)


let lastActivity = Date.now()

function updateActivity() {
  lastActivity = Date.now()
  chrome.runtime.sendMessage({ action: "updateActivity" })
}

document.addEventListener("mousemove", updateActivity)
document.addEventListener("keydown", updateActivity)
document.addEventListener("scroll", updateActivity)

// Listen for activity check messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkActivity") {
    sendResponse({ active: Date.now() - lastActivity < 5 * 60 * 1000 })
  }
})

// Initial check
updateActivity()


let currentView = "daily"
let chartData = {}

document.addEventListener("DOMContentLoaded", () => {
  loadData()
  setupEventListeners()
})

function setupEventListeners() {
  document.getElementById("dailyBtn").addEventListener("click", () => changeView("daily"))
  document.getElementById("weeklyBtn").addEventListener("click", () => changeView("weekly"))
  document.getElementById("monthlyBtn").addEventListener("click", () => changeView("monthly"))
  document.getElementById("exportCSV").addEventListener("click", () => exportData("csv"))
  document.getElementById("exportJSON").addEventListener("click", () => exportData("json"))
}

function loadData() {
  chrome.storage.local.get(["dailyUsage"], (result) => {
    chartData = processData(result.dailyUsage)
    updateCharts()
    updateStats()
  })
}

function processData(dailyUsage) {
  // Process the data for different views (daily, weekly, monthly)
  // This is a placeholder and should be implemented based on your data structure
  return {
    daily: dailyUsage,
    weekly: aggregateData(dailyUsage, 7),
    monthly: aggregateData(dailyUsage, 30),
  }
}

function aggregateData(dailyUsage, days) {
  // Aggregate daily data into weekly or monthly
  // This is a placeholder and should be implemented based on your data structure
  return dailyUsage
}

function changeView(view) {
  currentView = view
  updateCharts()
  updateStats()
}

function updateCharts() {
  updateTimeChart()
  updateCategoryChart()
}

function updateTimeChart() {
  const ctx = document.getElementById("timeChart").getContext("2d")
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(chartData[currentView]),
      datasets: [
        {
          label: "Active Time (hours)",
          data: Object.values(chartData[currentView]).map((day) =>
            Object.values(day).reduce((sum, site) => sum + site.activeTime / 3600, 0),
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Hours",
          },
        },
      },
    },
  })
}

function updateCategoryChart() {
  const ctx = document.getElementById("categoryChart").getContext("2d")
  const categoryData = getCategoryData()
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryData),
      datasets: [
        {
          data: Object.values(categoryData),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Time Spent by Category",
        },
      },
    },
  })
}

function getCategoryData() {
  // Process the data to get time spent per category
  // This is a placeholder and should be implemented based on your data structure
  return {
    Productivity: 5,
    Research: 3,
    Creativity: 2,
    Entertainment: 1,
  }
}

function updateStats() {
  const statsList = document.getElementById("statsList")
  statsList.innerHTML = ""

  // Calculate and display various statistics
  const totalTime = calculateTotalTime()
  const avgSessionLength = calculateAverageSessionLength()
  const mostUsedSite = findMostUsedSite()

  statsList.innerHTML += `<li>Total Time: ${formatTime(totalTime)}</li>`
  statsList.innerHTML += `<li>Average Session Length: ${formatTime(avgSessionLength)}</li>`
  statsList.innerHTML += `<li>Most Used Site: ${mostUsedSite.site} (${formatTime(mostUsedSite.time)})</li>`
}

function calculateTotalTime() {
  // Calculate total time from chartData
  // This is a placeholder and should be implemented based on your data structure
  return 10 * 3600 // 10 hours in seconds
}

function calculateAverageSessionLength() {
  // Calculate average session length from chartData
  // This is a placeholder and should be implemented based on your data structure
  return 30 * 60 // 30 minutes in seconds
}

function findMostUsedSite() {
  // Find the most used site from chartData
  // This is a placeholder and should be implemented based on your data structure
  return { site: "chat.openai.com", time: 5 * 3600 } // 5 hours in seconds
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function exportData(format) {
  chrome.storage.local.get(["dailyUsage"], (result) => {
    let data
    if (format === "csv") {
      data = convertToCSV(result.dailyUsage)
      downloadFile(data, "ai_time_tracker_data.csv", "text/csv")
    } else if (format === "json") {
      data = JSON.stringify(result.dailyUsage, null, 2)
      downloadFile(data, "ai_time_tracker_data.json", "application/json")
    }
  })
}

function convertToCSV(data) {
  // Convert JSON data to CSV format
  // This is a placeholder and should be implemented based on your data structure
  let csv = "Date,Site,Category,Active Time,Idle Time,Visits\n"
  for (const [date, sites] of Object.entries(data)) {
    for (const [site, usage] of Object.entries(sites)) {
      csv += `${date},${site},${usage.category},${usage.activeTime},${usage.idleTime},${usage.visits}\n`
    }
  }
  return csv
}

function downloadFile(content, fileName, contentType) {
  const a = document.createElement("a")
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
}

// Initial load
loadData()

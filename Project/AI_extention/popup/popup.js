// popup/popup.js
const AI_WEBSITES = {
  'chat.openai.com': 'ChatGPT',
  'www.deepseek.com': 'DeepSeek',
  'gemini.google.com': 'Gemini'
};

function formatTime(ms) {
  // Ensure we're working with numbers
  const milliseconds = Number(ms) || 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function updateUI() {
  chrome.storage.local.get(null, (data) => {
    const timeList = document.getElementById('timeList');
    timeList.innerHTML = '';

    const dailyData = {};

    // Process stored data
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('_')) {
        const [domain, date] = key.split('_');
        if (AI_WEBSITES[domain]) {
          dailyData[date] = dailyData[date] || {};
          dailyData[date][domain] = (dailyData[date][domain] || 0) + (Number(value) || 0);
        }
      }
    });

    // Display data
    Object.entries(dailyData).forEach(([date, domains]) => {
      const dateHeader = document.createElement('div');
      dateHeader.className = 'time-item';
      dateHeader.innerHTML = `<span>📅 ${date}</span>`;
      timeList.appendChild(dateHeader);

      Object.entries(domains).forEach(([domain, time]) => {
        const div = document.createElement('div');
        div.className = 'time-item';
        div.innerHTML = `
          <span>${AI_WEBSITES[domain]}</span>
          <span>${formatTime(time)}</span>
        `;
        timeList.appendChild(div);
      });
    });
  });
}

// Rest of the popup.js remains the same
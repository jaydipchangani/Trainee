document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");

    chrome.storage.local.get("darkMode", (data) => {
        document.body.classList.toggle("light-mode", data.darkMode);
        themeToggle.checked = data.darkMode;
    });

    themeToggle.addEventListener("change", () => {
        chrome.storage.local.set({ darkMode: themeToggle.checked });
        document.body.classList.toggle("light-mode", themeToggle.checked);
    });
});

window.addEventListener("beforeunload", () => {
    chrome.runtime.sendMessage({ type: "tabClosed" });
});

chrome.runtime.sendMessage({ type: "tabOpened" });

console.log("AI Time Tracker content script loaded!");

let messageCount = 0;
let observer = new MutationObserver(() => {
    let chatMessages = document.querySelectorAll(".message"); // Change selector based on AI website
    if (chatMessages.length > messageCount) {
        messageCount = chatMessages.length;
        chrome.runtime.sendMessage({ type: "AI_INTERACTION", messageCount });
    }
});

observer.observe(document.body, { childList: true, subtree: true });

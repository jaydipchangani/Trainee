// Injected into DOM by extension, so Angular can talk to it
window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.type !== "FROM_WEB_APP") return;
  
    const key = event.data.key;
  
    chrome.runtime.sendMessage({ type: "FETCH_DATA", key }, (response) => {
      window.postMessage({
        type: "FROM_EXTENSION",
        data: response.data
      }, "*");
    });
  });
  
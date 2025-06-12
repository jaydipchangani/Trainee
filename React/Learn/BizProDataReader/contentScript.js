(async function () {
  try {
    console.log("[Scraper] Scraping initiated...");

    const unwantedTags = [
      "style", "script", "link", "meta", "noscript",
      "iframe", "footer", "header", "nav", "aside", "form",
      "input", "button", "svg", "canvas"
    ];

    function cleanHTMLString(htmlString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      unwantedTags.forEach(tag => {
        doc.querySelectorAll(tag).forEach(el => el.remove());
      });

      const popupSelectors = [
        '[role="dialog"]',
        '[aria-modal="true"]',
        '[aria-modal="false"]',
        '[class*="pum"]',
        '[class*="overlay"]',
        '[class*="popup"]',
        '[class*="modal"]',
        '[class*="popmake"]',
        '[class*="click_open"]',
        '[id*="pum"]',
        '[id*="popup"]',
        '[id*="overlay"]',
        '[id*="modal"]'
      ];
      popupSelectors.forEach(sel => {
        doc.querySelectorAll(sel).forEach(el => el.remove());
      });

      const removeComments = (node) => {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          const child = node.childNodes[i];
          if (child.nodeType === 8) node.removeChild(child);
          else if (child.nodeType === 1) removeComments(child);
        }
      };
      removeComments(doc);

      const removeStylingAttrs = (node) => {
        if (node.nodeType === 1) {
          node.removeAttribute("style");
          node.removeAttribute("class");
          node.removeAttribute("id");
          Array.from(node.children).forEach(removeStylingAttrs);
        }
      };
      removeStylingAttrs(doc);

      const removeEmptyElements = (node) => {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          const child = node.childNodes[i];
          if (child.nodeType === 1) {
            removeEmptyElements(child);
            if (!child.textContent.trim() && child.children.length === 0) {
              node.removeChild(child);
            }
          }
        }
      };
      removeEmptyElements(doc);

      const getVisibleText = (element) => {
        let text = "";
        element.childNodes.forEach(node => {
          if (node.nodeType === 3) {
            text += node.textContent.trim() + " ";
          } else if (node.nodeType === 1) {
            const tagName = node.tagName.toLowerCase();
            if (["br", "p", "div", "section", "article", "header", "footer", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
              text += "\n" + getVisibleText(node) + "\n";
            } else {
              text += getVisibleText(node);
            }
          }
        });
        return text.replace(/\n\s*\n/g, "\n\n").trim();
      };

      return getVisibleText(doc.body);
    }

    const currentPageText = cleanHTMLString(document.documentElement.outerHTML);

    const currentEntry = {
      url: window.location.href,
      content: currentPageText,
      timestamp: new Date().toISOString()
    };

    const storageKey = "websiteData";

    chrome.storage.local.get([storageKey], (result) => {
      if (chrome.runtime.lastError) {
        console.error("[Scraper] Failed to read storage:", chrome.runtime.lastError);
        alert("❌ Failed to read extension storage.");
        return;
      }

      let existingData = [];

      try {
        if (result[storageKey]) {
          existingData = JSON.parse(result[storageKey]);
        }
      } catch (e) {
        console.warn("[Scraper] Malformed existing data. Resetting...");
        existingData = [];
      }

      // Check for duplicate by URL and update if found
      const index = existingData.findIndex(entry => entry.url === currentEntry.url);

      if (index >= 0) {
        existingData[index] = currentEntry; // Update existing entry
        console.log("[Scraper] Existing URL found. Updated entry.");
      } else {
        existingData.push(currentEntry); // Append new entry
        console.log("[Scraper] New URL scraped. Entry added.");
      }

      chrome.storage.local.set({
        [storageKey]: JSON.stringify(existingData)
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to reading data:", chrome.runtime.lastError);
          alert("❌ Failed to reading Data.");
        } else {
          alert("✅ Data Reading successfully saved.");
        }
      });
    });

  } catch (error) {
    console.error("[Scraper] Error during reading:", error);
    alert("❌ Reading failed. Check console.");
  }
})();


window.addEventListener("message", function (event) {
  if (event.source !== window) return;
  if (event.data?.type === "FROM_WEB_APP" && event.data?.key) {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_DATA",
        key: event.data.key
      },
      function (response) {
        window.postMessage(
          {
            type: "FROM_EXTENSION",
            data: response.data
          },
          "*"
        );
      }
    );
  }
});
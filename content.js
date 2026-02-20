//Automated scraper
const autoScrape = () => {
  const name = document.querySelector('h1.text-heading-xlarge')?.innerText.trim();
  const company = document.querySelector('.inline-show-more-text')?.innerText.trim().split('\n')[0];
  
  if (name && name !== "Unknown") {
    chrome.runtime.sendMessage({ type: "SCAN", data: { name, company } });
  }
};

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    if (location.href.includes("/in/")) setTimeout(autoScrape, 2000);
  }
}).observe(document, {subtree: true, childList: true});

if (location.href.includes("/in/")) setTimeout(autoScrape, 2000);
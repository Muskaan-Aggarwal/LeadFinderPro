// logic hub
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SCAN") {
    chrome.storage.local.set({ lead: msg.data });
    chrome.runtime.sendMessage({ type: "UI_UPDATE", data: msg.data });
  }
});
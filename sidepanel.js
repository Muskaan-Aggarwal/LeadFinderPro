//automation and daily lock

const LIMIT = 10;
const emailBox = document.getElementById('email-box');
const nameEl = document.getElementById('name');
const companyEl = document.getElementById('company');
const countEl = document.getElementById('count-remaining');

async function checkUsage() {
  const today = new Date().toLocaleDateString();
  let { usage } = await chrome.storage.local.get('usage');
  if (!usage || usage.date !== today) {
    usage = { date: today, count: 0 };
    await chrome.storage.local.set({ usage });
  }
  countEl.innerText = LIMIT - usage.count;
  return usage;
}

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "UI_UPDATE") {
    const { name, company } = msg.data;
    nameEl.innerText = name;
    companyEl.innerText = company;

    let usage = await checkUsage();

    if (usage.count >= LIMIT) {
      emailBox.innerText = "Daily Limit Reached (10/10)";
      emailBox.className = "error";
      return;
    }

    emailBox.innerText = "Searching...";
    emailBox.className = "";

    try {
      const res = await fetch('http://localhost:3000/get-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, company })
      });
      const data = await res.json();
      
      usage.count++;
      await chrome.storage.local.set({ usage });
      
      emailBox.innerText = data.email;
      countEl.innerText = LIMIT - usage.count;
    } catch (e) {
      emailBox.innerText = "Server Offline";
    }
  }
});

checkUsage(); // Initial check
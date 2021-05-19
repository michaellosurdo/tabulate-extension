// On install, initialize an array in storage to maintain list
// of domains to track in Tabulate popup chart... eventually,
// can add theme defaults, dark vs light, etc.

const savedDomains = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ savedDomains });
  console.log('Set default domain list');
});

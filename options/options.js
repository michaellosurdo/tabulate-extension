// Helper functions
const getUniqueDomains = (tabs) => {
  let domains = tabs.map((tab) =>
    new URL(tab.url).hostname.replace(/^www./, '')
  );
  return [...new Set(domains)];
};

const buildDomainList = (domains, listId, className, cb) => {
  const list = document.getElementById(listId);

  for (domain of domains) {
    const item = document.createElement('li');
    const img = document.createElement('img');
    const text = document.createTextNode(domain);

    item.classList.add(className);
    item.addEventListener('click', cb, { once: true });

    item.appendChild(img);
    item.appendChild(text);

    list.appendChild(item);
  }
};

// Click handlers for saving and removing tracked domains
const saveItem = (e) => {
  // Move item to Saved list in UI
  e.currentTarget.className = 'remove-item';
  document.getElementById('saved').append(e.currentTarget);

  // Add item to storage
  const domain = e.currentTarget.textContent;
  savedDomains.push(domain);
  chrome.storage.sync.set({ savedDomains });

  // Log results
  console.log(`Saved ${e.currentTarget.textContent}`);

  // Add removeItem event listener
  e.currentTarget.addEventListener('click', removeItem, { once: true });
};

const removeItem = (e) => {
  // Remove item from Saved list in UI
  const domain = e.currentTarget.textContent;
  e.currentTarget.remove();

  // Remove item from storage
  const idx = savedDomains.indexOf(domain);
  savedDomains.splice(idx, 1);
  chrome.storage.sync.set({ savedDomains });

  // Log results
  console.log(`Removed ${domain}`);
};

// Get current configuration and populate Saved list
let savedDomains = null;
chrome.storage.sync.get('savedDomains', (data) => {
  savedDomains = data.savedDomains;
  buildDomainList(savedDomains, 'saved', 'remove-item', removeItem);

  // Build Unsaved list from open tabs
  chrome.tabs.query({}, (tabs) => {
    let domains = getUniqueDomains(tabs);

    // Filter out domains already saved for tracking
    domains = domains.filter((domain) => !savedDomains.includes(domain));
    buildDomainList(domains, 'unsaved', 'save-item', saveItem);
  });
});

// Add event listener to Input
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const input = document.getElementById('textInput');
  const domain = input.value;

  if (domain === '') {
    return;
  }

  // Reset form input value
  input.value = '';

  const list = document.getElementById('saved');
  const item = document.createElement('li');
  const img = document.createElement('img');
  const text = document.createTextNode(domain);

  item.classList.add('remove-item');
  item.addEventListener('click', removeItem, { once: true });

  item.appendChild(img);
  item.appendChild(text);

  list.appendChild(item);
});

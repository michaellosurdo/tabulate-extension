// Helper functions
const getUniqueDomains = (tabs) => {
  let domains = tabs.map((tab) =>
    new URL(tab.url).hostname.replace(/^www./, '')
  );
  return [...new Set(domains)];
};

const buildChartData = (tabs) => {
  const domains = getUniqueDomains(tabs);

  // Create list of objects, one for each domain
  // { domain: str, tabs: [ tabObject, ... ] }
  const data = [];
  for (domain of domains) {
    data.push({
      domain,
      tabs: tabs.filter(
        (tab) => domain === new URL(tab.url).hostname.replace(/^www./, '')
      ),
    });
  }

  // Sort descending
  data.sort((a, b) => (a.tabs.length < b.tabs.length ? 1 : -1));
  return data;
};

buildChart = (data) => {
  const ctx = document.getElementById('chart').getContext('2d');
  const config = {
    type: 'bar',
    data: {
      datasets: [
        {
          data,
          label: 'Open Tabs',
          backgroundColor: 'hsla(206, 92%, 46%, 0.4)',
          borderColor: '#0984e3',
          borderWidth: 1,
          maxBarThickness: 100,
        },
      ],
    },
    options: {
      parsing: {
        xAxisKey: 'domain',
        yAxisKey: 'tabs.length',
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
};

// Build chart
// Get configured domain list from storage
chrome.storage.sync.get('savedDomains', ({ savedDomains }) => {
  // Get all open tabs across windows
  chrome.tabs.query({}, (tabs) => {
    // If domain list configured, filter tabs for configured domains
    if (savedDomains.length > 0) {
      tabs = tabs.filter((tab) => {
        const domain = new URL(tab.url).hostname.replace(/^www./, '');
        if (savedDomains.includes(domain)) return tab;
      });
    }

    const data = buildChartData(tabs);
    buildChart(data);
  });
});

// Open Options page on icon click
document.getElementById('options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

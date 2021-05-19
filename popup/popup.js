// Helper functions
const buildChartData = (tabs) => {
  const data = {};

  for (const tab of tabs) {
    const hostname = new URL(tab.url).hostname;
    console.log(hostname);

    if (hostname in data) {
      data[hostname].count += 1;
      data[hostname].tabs.push(tab);
    } else {
      data[hostname] = {};
      data[hostname].count = 1;
      data[hostname].tabs = [tab];
    }
  }

  return data;
};

const getCounts = (data) => {
  const counts = [];
  for (const hostname in data) {
    counts.push(data[hostname].count);
  }
  return counts;
};

const buildChart = (data) => {
  const ctx = document.getElementById('chart').getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Open Tabs',
          data: getCounts(data),
          // backgroundColor: 'rgba(255, 0, 191, 0.2)',
          backgroundColor: 'hsla(206, 92%, 46%, 0.4)',
          // borderColor: 'rgba(255, 0, 191, 1)',
          borderColor: '#0984e3',
          borderWidth: 1,
        },
      ],
    },
    options: {
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
  });
};

// Build Tabulate chart
// Get configured domain list from storage
chrome.storage.sync.get('savedDomains', ({ savedDomains }) => {
  // Get all open tabs across windows
  chrome.tabs.query({}, (tabs) => {
    // If domain list configured, filter tabs for configured domains
    if (savedDomains.length > 0) {
      tabs = tabs.filter((tab) => {
        const domain = new URL(tab.url).hostname.replace(/^www./, '');
        if (savedDomains.includes(domain)) return domain;
      });
    }

    const data = buildChartData(tabs);
    buildChart(data);
  });
});

// Add Options page event listener
document.getElementById('options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  // chrome.tabs.create({
  //   url: 'chrome://extensions/?options=' + chrome.runtime.id,
  // });
  console.log('hi');
});

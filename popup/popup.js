const getTabData = async () => {
  const tabs = await chrome.tabs.query({});

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

const getDataset = (tabData) => {
  const dataset = [];
  for (const hostname in tabData) {
    dataset.push(tabData[hostname].count);
  }
  return dataset;
};

const buildChart = async () => {
  const tabData = await getTabData();
  const dataset = getDataset(tabData);
  console.log(dataset.length);

  const ctx = document.getElementById('chart').getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(tabData),
      datasets: [
        {
          label: 'Open Tabs',
          data: dataset,
          backgroundColor: 'rgba(255, 0, 191, 0.2)',
          borderColor: 'rgba(255, 0, 191, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
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

buildChart();

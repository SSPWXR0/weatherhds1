export let data;
export let ldlData
export let imageIndex;
export let locationsList;
export let units;
let onlineBg;
let allData;


import { getInitialData, backgroundCycle } from "./weather.js";
import { runInitialLDL } from "./ldl.js";
import { everythingConfigLmao } from "./main.js";
import { config } from "./config.js";

async function fetchData() {
  data = null;
  ldlData = null;
  allData = null;
  units = null;

  const [response] = await Promise.all([
    fetch('/data'),
  ]);

  allData = await response.json();
  data = allData.mainPresentation;
  ldlData = allData.ldlPresentation;
  units = allData.units;
}


async function indexLists() {
  const [locationsResponse, imageIndexResponse] = await Promise.all([
    fetch('/locations'),
    fetch('./imageIndex.json')
  ]);

  locationsList = await locationsResponse.json();
  imageIndex = await imageIndexResponse.json();
}

indexLists()

async function fetchOnlineBackground() {
  try {
    const response = await fetch('/bing-background');
    onlineBg = await response.json();

    if (!onlineBg || !onlineBg.images || !onlineBg.images[0] || !onlineBg.images[0].url) {
      console.error("Invalid response from /bing-background:", onlineBg);
      return;
    }

    document.querySelector('.wallpaper').style.backgroundImage = `url(https://bing.com${onlineBg.images[0].url})`;

  } catch (error) {
    console.error("Error fetching online background:", error);
  }
}

async function runBackground() {
  if (!config.enableBackgrounds) return;

  if (config.backgroundSource === "local") {
    backgroundCycle();
    setInterval(backgroundCycle, 300000);
  }

  if (config.backgroundSource === "online") {
    await fetchOnlineBackground();
    setInterval(async () => {
      await fetchOnlineBackground();
    }, 72000000);
  }
}



async function runInitialProcesses() {
  await indexLists();
  await fetchData();

  if (config.presentationType != 1) {
    getInitialData();
  }
  if (config.presentationType != 2) {
    runInitialLDL();
  }
  everythingConfigLmao();
  runBackground();
}


setInterval(fetchData, 1500000)

runInitialProcesses()
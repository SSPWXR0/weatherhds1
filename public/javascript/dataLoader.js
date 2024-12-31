export let data;
export let ldlData
export let config;
export let weatherIcons;
export let imageIndex;

import { getInitialData } from "./weather.js";
import { runInitialLDL } from "./ldl.js";
import { everythingConfigLmao } from "./main.js";

async function fetchData() {
  const [response, ldlResponse, configResponse, iconsResponse, imageIndexResponse] = await Promise.all([
    fetch('./wxData.json'),
    fetch('./ldlData.json'),
    fetch('./config.json'),
    fetch('./images/icons.json'),
    fetch('./imageIndex.json')
  ]);

  data = await response.json();
  ldlData = await ldlResponse.json();
  config = await configResponse.json();
  weatherIcons = await iconsResponse.json();
  imageIndex = await imageIndexResponse.json();

  console.log(`[dataLoader.js] Loaded the following data files:`, data, ldlData)
  console.log(`[dataLoader.js] Loaded the background image index:`, imageIndex)
  console.log(`[dataLoader.js] Loaded the following config files:`, config, weatherIcons)
}

fetchData()

async function runInitialProcesses() {
  await fetchData()

  if (config.presentationType != 1) {
    getInitialData()
  }
  if (config.presentationType != 2) {
    runInitialLDL()
  }
  everythingConfigLmao()
}

setInterval(fetchData, 60000)

runInitialProcesses()
export let data;
export let ldlData
export let imageIndex;
export let locationsList;

import { getInitialData } from "./weather.js";
import { runInitialLDL } from "./ldl.js";
import { everythingConfigLmao } from "./main.js";
import { config } from "./config.js";

async function fetchData() {
  data = null;
  ldlData = null;
  imageIndex = null;

  const [response, ldlResponse] = await Promise.all([
    fetch('./wxData.json'),
    fetch('./ldlData.json'),
  ]);

  data = await response.json();
  ldlData = await ldlResponse.json();

  console.log(`[dataLoader.js] Loaded the following data files:`, data, ldlData)
  console.log(`[dataLoader.js] Loaded the background image index:`, imageIndex)
}

fetchData()

async function fetchLocationsList() {
  locationsList = null;

  const [locationsResponse] = await Promise.all([
    fetch('/locations')
  ])

  locationsList = await locationsResponse.json();
}

async function fetchBackgroundsIndex() {
  imageIndex = null;

  const [imageIndexResponse] = await Promise.all([
    fetch('./imageIndex.json')
  ])

  imageIndex = await imageIndexResponse.json();
}

fetchLocationsList()
fetchBackgroundsIndex()

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

setInterval(fetchData, 1500000)

runInitialProcesses()
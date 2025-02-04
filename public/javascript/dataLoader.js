export let data;
export let ldlData
export let imageIndex;
export let locationsList;
export let units;
let allData;

import { getInitialData } from "./weather.js";
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


  console.log(`[dataLoader.js] Loaded the following data files:`, data, ldlData)
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

  console.log(`[dataLoader.js] Loaded the background image index:`, imageIndex)
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
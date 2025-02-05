export let data;
export let ldlData
export let imageIndex;
export let locationsList;
export let units;
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
  ])

  locationsList = await locationsResponse.json();
  imageIndex = await imageIndexResponse.json();
}

indexLists()


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

  switch (config.enableBackgrounds) {
    case false:
      break;
    default:
      backgroundCycle();
      setInterval(() => {
        backgroundCycle();
      }, 300000);
      break;
  }
}


setInterval(fetchData, 1500000)

runInitialProcesses()
export let imageIndex;
export let locationsList;
export let units;



let onlineBg;
const logTheFrickinTime = `[dataLoader.js] | ${new Date().toLocaleString()} |`;

import { runInitialLDL } from "./ldl.js";
import { everythingConfigLmao } from "./main.js";
import { config, locationConfig } from "../config.js";

export async function requestWxData(location, locType) { // we request the fine shyts from tha backend
  const wxResponse = await fetch(`/data/${encodeURIComponent(location)}?locType=${locType}`);
  let wxData = await wxResponse.json();
  console.log(wxData)
  return wxData;
}

async function fetchBackgroundIndex() {
  const imageIndexResponse = await fetch('./imageIndex.json')
  imageIndex = await imageIndexResponse.json();
}


async function fetchOnlineBackground() {
  try {
    const response = await fetch('/bing-background');
    onlineBg = await response.json();

    if (!onlineBg || !onlineBg.images || !onlineBg.images[0] || !onlineBg.images[0].url) {
      console.error(logTheFrickinTime, "Invalid response from /bing-background:", onlineBg);
      return;
    }

    document.querySelector('.wallpaper').style.backgroundImage = `url(https://bing.com${onlineBg.images[0].url})`;

  } catch (error) {
    console.error(logTheFrickinTime, "Error fetching online background:", error);
  }
}

async function runBackground() {
  if (!config.presentationConfig.backgrounds) return;

  if (config.backgroundSource === "local") {
    //backgroundCycle();
    //setInterval(backgroundCycle, 300000);
  }

  if (config.backgroundSource === "online") {
    await fetchOnlineBackground();
    setInterval(async () => {
      await fetchOnlineBackground();
    }, 72000000);
  }
}

async function runInitialProcesses() {
  await fetchBackgroundIndex();

  if (config.presentationConfig.main) {
    //getInitialData();
  }
  if (config.presentationConfig.ldl) {
    runInitialLDL();
  }
  everythingConfigLmao();
  runBackground();
}

runInitialProcesses()
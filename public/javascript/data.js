export let imageIndex;
export let locationsList;
export let units;



let onlineBg;
let bgUrl;
const logTheFrickinTime = `[data.js] | ${new Date().toLocaleString()} |`;

import { runInitialLDL } from "./ldl.js";
import { config } from "../config.js";

export async function requestWxData(location, locType) { // we request the fine shyts from tha backend
  const wxResponse = await fetch(`/data/${encodeURIComponent(location)}?locType=${locType}`);
  let wxData = await wxResponse.json();
  console.log(wxData)
  return wxData;
}

export async function fetchOnlineBackground() {
  try {
    const response = await fetch('/bing-background');
    onlineBg = await response.json();

    bgUrl = `https://www.bing.com${onlineBg.images[0].url}`;

    console.log(bgUrl)

    return bgUrl;

  } catch (error) {
    console.error(logTheFrickinTime, "Error fetching online background:", error);
  }
}


if (config.presentationConfig.ldl) {
  runInitialLDL();
}


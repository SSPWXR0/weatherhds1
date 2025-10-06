export let imageIndex;
export let locationsList;
export let units;

export let serverHealth = 0; // if set to one then that means the heartbeat failed and the client SHOULD fallback to client-side slides. keyword 'SHOULD' because im a horrible coder.

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

    return bgUrl;

  } catch (error) {
    console.error(logTheFrickinTime, "Error fetching online background:", error);
  }
}

function areWeDead() {
  fetch('/heartbeat')
    .then(response => response.json())
    .then(data => {
      if (config.verboseLogging === true) {
        console.log(logTheFrickinTime, 'Server heartbeat response:', data);
        serverHealth = 0; // server is healthy
      }
    })
    .catch(error => {
      console.error(logTheFrickinTime, 'Error fetching heartbeat:', error);
      serverHealth = 1; // server is unresponsive
      
      


    });
}

setInterval(areWeDead, 30000);

if (config.presentationConfig.ldl) {
  runInitialLDL();
}


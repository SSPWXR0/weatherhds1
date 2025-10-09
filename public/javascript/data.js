export let imageIndex;
export let locationsList;
export let units;
export let serverHealth = 0; // if set to one then that means the heartbeat failed and the client SHOULD fallback to client-side slides. keyword 'SHOULD' because im a horrible coder.

let onlineBg;
let bgUrl;
const logTheFrickinTime = `[data.js] | ${new Date().toLocaleString()} |`;

import { runInitialLDL } from "./ldl.js";
import { config, serverConfig } from "../config.js";

export async function requestWxData(location, locType) {
  let wxData = {
    metadata: null,
    weather: null
  };

  try {
    const wxResponse = await fetch(`/data/${encodeURIComponent(location)}?locType=${locType}`);
    wxData = await wxResponse.json();
    console.log(logTheFrickinTime, "Fetched wxData from backend:", wxData);
  } catch (error) {
    console.error(logTheFrickinTime, "Error fetching weather data from backend:", error);

    try {
      const wxResponseLocData = await fetch(
        `https://api.weather.com/v3/location/search?query=${location}&locationType=city&language=en-CA&format=json&apiKey=${serverConfig.twcApiKey}`
      );

      const wxDataLoc = await wxResponseLocData.json();

      wxData = {
        metadata: {
          localeData: {
            localeName: wxDataLoc.location.city[0],
            adminDistrict: wxDataLoc.location.adminDistrict[0],
            country: wxDataLoc.location.country[0],
            countryCode: wxDataLoc.location.countryCode[0],
            lat: wxDataLoc.location.latitude[0],
            lon: wxDataLoc.location.longitude[0],
            postalKey: wxDataLoc.location.postalKey[0],
          },
          units: serverConfig.units,
          hdsLocType: "regional",
        },
        weather: null,
      };
      console.warn(logTheFrickinTime, "Using fallback wxData:", wxData);
    } catch (fallbackError) {
      console.error(logTheFrickinTime, "Fallback weather fetch also failed:", fallbackError);
    }
  }

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

export async function areWeDead() {
  try {
    const response = await fetch('/heartbeat');
    const data = await response.json();

    if (config.verboseLogging === true) {
      console.log(logTheFrickinTime, 'Server heartbeat response:', data);
    }

    serverHealth = 0; // server is healthy
    return serverHealth;
  } catch (error) {
    console.error(logTheFrickinTime, 'Error fetching heartbeat:', error);
    serverHealth = 1; // server is unresponsive
    console.warn(logTheFrickinTime, "Server is unresponsive. Client-side slides will be used where applicable.");
    return serverHealth;
  }
}


areWeDead()
setInterval(areWeDead, 30000);

if (config.presentationConfig.ldl) {
  runInitialLDL();
}


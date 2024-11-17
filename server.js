const express = require('express');
const path = require('path');
const fs = require('fs').promises
const config = require('./public/config.json')
const app = express();
const indexBackgrounds = require('./indexBackgrounds.js')

let allWeather = {};
let ldlWeather = {};

indexBackgrounds();

async function getWeather(lat, lon, countryCode) { // credit to Dalk
  // theres definitely a better approach to this
  // its like 1 am and im way too lazy to think of that better approach
  const currentUrl = await fetch(`https://api.weather.com/v3/wx/observations/current?geocode=${lat},${lon}&units=${config.units}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const weeklyUrl = await fetch(`https://api.weather.com/v3/wx/forecast/daily/7day?geocode=${lat},${lon}&format=json&units=${config.units}&language=en-US&apiKey=${config.twcApiKey}`);
  const alertsUrl = await fetch(`https://api.weather.com/v3/alerts/headlines?geocode=${lat},${lon}&format=json&language=en-US&apiKey=${config.twcApiKey}`);
  const radarUrl = await fetch(`https://api.weather.com/v2/maps/dynamic?geocode=${Math.round(lat)}.0,${Math.round(lon)}.0&h=320&h=320&w=568&lod=7&product=satrad&map=dark&language=en-US&format=png&apiKey=${config.twcApiKey}&a=0`)
  const aqiUrl = await fetch(`https://api.weather.com/v3/wx/globalAirQuality?geocode=${lat},${lon}&language=en-US&scale=EPA&format=json&apiKey=${config.twcApiKey}`);
  const pollenUrl = await fetch(`https://api.weather.com/v2/indices/pollen/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
/*   const runningUrl = await fetch(`https://api.weather.com/v2/indices/runWeather/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const frostUrl = await fetch(`https://api.weather.com/v2/indices/frost/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const skiUrl = await fetch(`https://api.weather.com/v2/indices/ski/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const mosquitoUrl = await fetch(`https://api.weather.com/v2/indices/mosquito/daily/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const golfUrl = await fetch(`https://api.weather.com/v2/indices/golf/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const heatingUrl = await fetch(`https://api.weather.com/v2/indices/heatCool/daypart/3day?geocode=${lat},${lon}&language=en-US&format=json&apiKey=${config.twcApiKey}`); */
  const current = await currentUrl.json();
  const weekly = await weeklyUrl.json();

  let alerts = []
  let alertDetails = []

  try {
    if (alertsUrl.status === 204) {
      console.info(`No alerts in effect for ${lat}, ${lon}`);
      alerts = [];
    } else {
      alerts = await alertsUrl.json();
      console.info(`Fetched alerts for ${lat}, ${lon}:`);

      if (alerts.alerts && alerts.alerts.length > 0) {
        const alertId = alerts.alerts[0].detailKey;
        const alertDetailsUrl = await fetch(`https://api.weather.com/v3/alerts/detail?alertId=${alertId}&format=json&language=en-US&apiKey=${config.twcApiKey}`);
        
        if (alertDetailsUrl.ok) {
          alertDetails = await alertDetailsUrl.json();
        } else {
          console.error(`Failed to fetch alert details: ${alertDetailsUrl.status} ${alertDetailsUrl.statusText}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
  }
  const radar = radarUrl.url;
  const aqi = await aqiUrl.json();
  const pollen = await pollenUrl.json();
  /* const running = await runningUrl.json();
  const frost = await frostUrl.json();
  const ski = await skiUrl.json();
  const mosquito = await mosquitoUrl.json();
  const golf = await golfUrl.json();
  const heating = await heatingUrl.json(); */

  if(config.debugger) { console.log(`[server.js] | ${new Date().toLocaleString()} | Successfully saved current weather conditions`) }

  const weatherData = {
    current: current,
    weekly: weekly,
    alerts: alerts,
    alertDetails: alertDetails,
    radar: radar,
    special: { aqi: aqi, pollen: pollen },
/*     indices: { 
      spring: { running: running, mosquito: mosquito, golf: golf },
      winter: { heating: heating, frost: frost, ski: ski }
    } */
  };

  return weatherData;
}

async function getWeatherCoordinates(location) {
  const coordinatesUrl = await fetch(`https://api.weather.com/v3/location/search?query=${location}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const coordinates = await coordinatesUrl.json();
  const locationData = coordinates.location;
  
  if (!locationData) {
    throw new Error(`Location data not found for ${location}`);
  }

  if(config.debugger) {
    console.log(`[server.js] | ${new Date().toLocaleString()} | Successfully retrieved weather coordinates for ${location}`);
  }

  return {
    lat: locationData.latitude[0], 
    lon: locationData.longitude[0], 
    country: locationData.countryCode[0], 
    adminDistrictCode: locationData.adminDistrictCode[0],
    postalKey: locationData.postalKey[0],
    ianaTimeZone: locationData.ianaTimeZone[0]
  };
}

let currentCity = 0

async function loadAllCities() {
  // hope this workies
  for (const location of config.locations) {
    try {
      const coordinates = await getWeatherCoordinates(location)

      allWeather[location] = {};
      allWeather[location][currentCity] = {};
      allWeather[location][currentCity].coordinates = coordinates;

      const weather = await getWeather(
        allWeather[location][currentCity].coordinates.lat,
        allWeather[location][currentCity].coordinates.lon,
        allWeather[location][currentCity].country
      );

      allWeather[location][currentCity].current = weather.current
      allWeather[location][currentCity].weekly = weather.weekly
      allWeather[location][currentCity].alerts = weather.alerts
      allWeather[location][currentCity].alertDetails = weather.alertDetails
      allWeather[location][currentCity].radar = weather.radar
      allWeather[location][currentCity].special = weather.special
      allWeather[location][currentCity].indices = weather.indices

      console.log(`Processed ${location} (${currentCity})`)

      currentCity++

    } catch (error) {
      console.error(`Error processing ${location}: ${error.message}`);
    }
     
  }
}

async function getLDLWeather(lat, lon, countryCode) { // credit to Dalk for the twc api stuff
  const ldlCurrentUrl = await fetch(`https://api.weather.com/v3/wx/observations/current?geocode=${lat},${lon}&units=${config.units}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
  const ldlWeeklyUrl = await fetch(`https://api.weather.com/v3/wx/forecast/daily/7day?geocode=${lat},${lon}&format=json&units=${config.units}&language=en-US&apiKey=${config.twcApiKey}`);
  const ldlAlertsUrl = await fetch(`https://api.weather.com/v3/alerts/headlines?countryCode=${countryCode}&format=json&language=en-US&apiKey=${config.twcApiKey}`);
  const ldlAqiUrl = await fetch(`https://api.weather.com/v3/wx/globalAirQuality?geocode=${lat},${lon}&language=en-US&scale=EPA&format=json&apiKey=${config.twcApiKey}`);
  const ldlAlmanacUrl = await fetch(`https://api.weather.com/v3/wx/almanac/monthly/1month?geocode=${lat},${lon}&format=json&units=${config.units}&month=1&apiKey=${config.twcApiKey}`)
  const ldlCurrent = await ldlCurrentUrl.json();
  const ldlWeekly = await ldlWeeklyUrl.json();
  const ldlAlerts = await ldlAlertsUrl.json();
  const ldlAqi = await ldlAqiUrl.json();
  const ldlAlmanac = await ldlAlmanacUrl.json();
  if(config.debugger) { console.log(`[server.js] | ${new Date().toLocaleString()} | Saved data for display on LDL`) }

  return {
      ldlCurrent: ldlCurrent,
      ldlWeekly: ldlWeekly,
      ldlAlerts: ldlAlerts,
      ldlAqi: ldlAqi,
      ldlAlmanac: ldlAlmanac,
      }
}

async function getLDLWeatherCoordinates(location) {
const coordinatesUrl = await fetch(`https://api.weather.com/v3/location/search?query=${location}&language=en-US&format=json&apiKey=${config.twcApiKey}`);
const coordinates = await coordinatesUrl.json();
const locationData = coordinates.location;

if (!locationData) {
  throw new Error(`Location data not found for ${location}`);
}

if(config.debugger) {
  console.log(`[server.js] | ${new Date().toLocaleString()} | Successfully retrieved weather coordinates for ${location}`);
}

return {
  lat: locationData.latitude[0], 
  lon: locationData.longitude[0], 
  country: locationData.countryCode[0], 
  adminDistrictCode: locationData.adminDistrictCode[0]
};
}

let currentLDLCity = 0

async function loadAllLDLCities() {
// hope this workies
for (const location of config.ldlLocations) {
  try {
    const coordinates = await getLDLWeatherCoordinates(location)

    ldlWeather[location] = {};
    ldlWeather[location][currentLDLCity] = {};
    ldlWeather[location][currentLDLCity].coordinates = coordinates;

    const weather = await getLDLWeather(
      ldlWeather[location][currentLDLCity].coordinates.lat,
      ldlWeather[location][currentLDLCity].coordinates.lon,
      ldlWeather[location][currentLDLCity].country
    );

    ldlWeather[location][currentLDLCity].current = weather.ldlCurrent
    ldlWeather[location][currentLDLCity].alerts = weather.ldlAlerts
    ldlWeather[location][currentLDLCity].forecast = weather.ldlWeekly
    ldlWeather[location][currentLDLCity].aqi = weather.ldlAqi
    ldlWeather[location][currentLDLCity].almanac = weather.ldlAlmanac

    console.log(`Processed ${location} (${currentLDLCity})`)

    currentLDLCity++

  } catch (error) {
    console.error(`Error processing ${location}: ${error.message}`);
  }
   
}
}

async function saveDataToJson() {
  const jsonFile = path.join(__dirname, 'public/wxData.json')
  const ldlFile = path.join(__dirname, 'public/ldlData.json')

  await fs.writeFile(jsonFile, JSON.stringify(allWeather, null, 2))
  await fs.writeFile(ldlFile, JSON.stringify(ldlWeather, null, 2))

}

async function runDataInterval() {
  await loadAllCities()
  await loadAllLDLCities()
  saveDataToJson()
  console.log("Ran data and text generation intervals.")
  console.log("============================================")
  console.log(`### WEATHER HTML DISPLAY SYSTEM ###`);
  console.log(`Created by SSPWXR and ScentedOrange`);
  console.log(`Server is running on http://localhost:${config.webPort}`);
}

runDataInterval()
setInterval(runDataInterval, 480000)

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.webPort, () => {});

process.on('SIGINT', () => {console.log("Exiting WeatherHDS daemon"); process.exit();});
process.on('SIGUSR2', () => {console.log("Exiting WeatherHDS daemon"); process.exit();});
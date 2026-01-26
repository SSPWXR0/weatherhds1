const express = require('express');
const path = require('path');
const app = express();
const { serverConfig, versionID } = require("./public/config.js");
const nodecache = require('node-cache');
const fs = require('fs');
const dotenv = require('dotenv');

const cache = new nodecache({stdTTL: serverConfig.cacheValidTime})

process.stdout.write('\x1Bc');
console.log(Buffer.from("ICAgICAgICAgICAgICAgICAgICDilojilogKICAgICAgICAgICDilojiloggICAgICAg4paI4paIICAgICDilojilogKICAgICAgICAgICAg4paI4paI4paIICAgICAgICAgIOKWiOKWiOKWiCAgICAgICAgICAgICAgICAgIOKWiOKWiOKWiOKWiCAgICAgICAg4paI4paI4paIICDilojilojilojilojilojilojilojilojilojiloggICAgICAgICDilojilojilojilojilojilojilojilogKICAgICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICAgICAgICAgICAgIOKWiOKWiCAgICDilojilojilojiloggICAgICAgIOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paIICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICDilojilojilogKICAgICAgICDilojilojilojilojilogg4paI4paI4paI4paI4paIICAgIOKWiOKWiCAgICAgICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiCAgICAgICAg4paI4paI4paIICDilojilojilojiloggICAgIOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICAg4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paICiAgICAg4paI4paI4paI4paI4paIICAgICAg4paI4paI4paI4paI4paI4paI4paI4paI4paIICAg4paI4paI4paIICAg4paI4paI4paI4paI4paI4paI4paIICAgICDilojilojilojilojilojilojilojilojilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojilojilojilojiloggICAgICAgICDilojilojilojilojilojilojilogKICAg4paI4paI4paI4paI4paI4paI4paIICAgICAgICDilojilojilojilojilojilojiloggICAgICAgIOKWiOKWiOKWiOKWiOKWiCAgICAgICAg4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paIICDilojilojilojiloggICAgICAg4paI4paI4paI4paI4paIICDilojilojilojilojilojilojilojilojilojilojilojiloggICAgICAg4paI4paI4paI4paI4paI4paICiAgIOKWiOKWiCAg4paIICAgICAgICAgICAgICAg4paI4paIICAgICAgICAg4paI4paI4paI4paI4paI4paIICAgICAg4paI4paI4paI4paIICAgICAgICDilojilojiloggIOKWiOKWiOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiCAgICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICDilojilojilojilojilojilojilogKICDilojiloggICAg4paI4paIICAgICAgICAgICAgIOKWiOKWiCAgICAgICAgICAg4paI4paI4paI4paI4paI4paIICAgIOKWiOKWiOKWiOKWiCAgICAgICAg4paI4paI4paIICDilojilojilojiloggICAgICDilojilojilojilojilogg4paI4paI4paI4paI4paIICAgICAg4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paICiDilojilojiloggICAg4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICAgICAgICAgICAg4paI4paI4paI4paIICAg4paI4paI4paI4paIICAgICAgICDilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paICiAgIOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paIICAgICAgICAgICAgICAgICAgICAgICDilojilojilojiloggICAgICAgIOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICAgICDilojilojilojilojilojilojilojilojilojilojilog=", "base64").toString());
let twcApiKey
const logTheFrickinTime = `[server.js] | ${new Date().toLocaleString()} |`;
const mainAggCommon = "v3-wx-observations-current;v3-wx-forecast-daily-7day;v3-wx-globalAirQuality";
const mainv1AggCommon = "v3alertsHeadlines;v2fcstintraday3;v2fcstwwir"
const minorAggCommon = "v3-wx-observations-current;v3-wx-forecast-daily-3day";

const dotenvResult = dotenv.config({quiet: true});

if (dotenvResult.error) {
  console.error('\x1b[31m' + '.env is NOT found. Please make the file in project root and add your TWC API key under TWC_API_KEY=.' + '\x1b[0m');
  process.exit(1);
}

if (!process.env.TWC_API_KEY) {
  console.error('\x1b[31m' + 'No TWC API key present in .env. Please add your TWC API key under TWC_API_KEY=.' + '\x1b[0m');
  process.exit(1);
}

twcApiKey = process.env.TWC_API_KEY;

const headers = {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'User-Agent': `WeatherHDS${versionID}/NodeJS`,
      'Connection': 'keep-alive'
    }

async function loadLocaleData(location) {

  const cacheKey = `locale-${location}`

  if (cache.get(cacheKey)) {
    console.log(logTheFrickinTime, `Cache hit for client query "${location}"`)
    return cache.get(cacheKey)
  } else {

  try {

    const response = await fetch(`https://api.weather.com/v3/location/search?query=${location}&language=en-US&format=json&apiKey=${twcApiKey}`, {
      method: 'GET',
      headers: headers
    });
    console.log(logTheFrickinTime, `Searching up client query "${location}"`)
    const data = await response.json();

    console.log(logTheFrickinTime, `Fetched locale ${data.location.city[0]}, ${data.location.adminDistrict[0]}, ${data.location.countryCode[0]}`)

    const result = {
      localeName: data.location.city[0],
      adminDistrict: data.location.adminDistrict[0],
      country: data.location.country[0],
      countryCode: data.location.countryCode[0],
      lat: data.location.latitude[0],
      lon: data.location.longitude[0],
      postalKey: data.location.postalKey[0],
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error(logTheFrickinTime, error)
    if (cache.get(cacheKey)) {
      return cache.get(cacheKey);
    }
  }

  }
}

function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    if ((month === 12 && day >= 21) || (month <= 3 && day < 20) || (month < 3)) {
        return "bg_winter";
    } else if ((month === 3 && day >= 20) || (month < 6) || (month === 6 && day < 21)) {
        return "bg_spring";
    } else if ((month === 6 && day >= 21) || (month < 9) || (month === 9 && day < 23)) {
        return "bg_summer";
    } else {
        return "bg_autumn";
    }
}

async function loadWxData(postalKey, geocode, locType) {
  let data = null;

  const cacheKey = `wxData-${postalKey}:${geocode}`

  if (cache.get(cacheKey)) {
    console.log(logTheFrickinTime, 'Returned cachekey:', cacheKey)
    return cache.get(cacheKey)
  } else {

  try {
    if (locType === "primary" || locType === "ldl") {
      const [aggRes, aggResTwo, pollenRes] = await Promise.all([
        fetch(
          `https://api.weather.com/v3/aggcommon/${mainAggCommon}?postalKey=${postalKey}&language=en-US&scale=EPA&units=${serverConfig.units}&format=json&apiKey=${twcApiKey}`,
          {
            method: 'GET',
            headers: headers
          }
        ),
        fetch(
          `https://api.weather.com/v2/aggcommon/${mainv1AggCommon}?geocode=${geocode}&language=en-US&units=${serverConfig.units}&format=json&apiKey=${twcApiKey}`,
          {
            method: 'GET',
            headers: headers
          }
        ),
        fetch(
          `https://api.weather.com/v2/indices/pollen/daypart/15day?geocode=${geocode}&language=en-US&format=json&apiKey=${twcApiKey}`,
          {
            method: 'GET',
            headers: headers
          }
        )
      ]);

      console.log(logTheFrickinTime, 'FETCHED AND CACHED -', cacheKey)

      
      const [aggData, aggDataTwo, pollenData] = await Promise.all([
        aggRes.json(),
        aggResTwo.json(),
        pollenRes.json(),
      ]);

     if (aggDataTwo.v3alertsHeadlines) {
      const detailKey = aggDataTwo.v3alertsHeadlines.alerts[0].detailKey
      console.log(logTheFrickinTime, 'Alert detected! Fetching detail key', detailKey)


      const detailFetch = await fetch(`https://api.weather.com/v3/alerts/detail?alertId=${detailKey}&format=json&language=en-US&apiKey=${twcApiKey}`)
      const detailResponse = await detailFetch.json()

      data = await { ...aggData, ...aggDataTwo, pollenData, ...detailResponse };
     } else {
      data = { ...aggData, ...aggDataTwo, pollenData };
     }

      
    }

    if (locType === "secondary" || locType === "regional") {

      let secondaryLocationFetch = null;

      secondaryLocationFetch = await fetch([
        `https://api.weather.com/v3/aggcommon/${minorAggCommon}?postalKey=${postalKey}&language=en-US&units=${serverConfig.units}&format=json&apiKey=${twcApiKey}`,
      ]);

      data = secondaryLocationFetch.json()
    }

    cache.set(cacheKey, data);
    return data;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    if (cache.get(cacheKey)) {
      return cache.get(cacheKey);
      console.log(logTheFrickinTime, 'Returned cachekey after error:', cacheKey)
    }
  }
    
  }
}





async function runDataInterval() {
  console.log(`==========================================================================================================`);
  console.log(`WeatherHDS daemon v${versionID}`);
  console.log(`Created by raiii. (c) SSPWXR/raii 2025`);
  console.log(`User contributors: ScentedOrangeDev, LeWolfYt,`);
}

runDataInterval()

app.use(express.static(path.join(__dirname, 'public')));

let preferredPort = process.env.PORT || serverConfig.webPort;

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`HTTP server listening on http://localhost:${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.warn(`Port ${port} is already in use, trying port ${port + 1}`);
            startServer(port + 1);
        } else {
            console.error('Server error:', error);
        }
    });
}

startServer(preferredPort);

setInterval(() => {
    getCurrentSeason();
}, 24 / 60 * 60 * 1000);
getCurrentSeason();

let selectedImage;
let backgroundsInitialized = false;

function randomLocalBackground(wxCond) {
    const season = getCurrentSeason();
    const imageList = require('./imageIndex.json');
 
    if (!imageList[season]) {
        console.error(logTheFrickinTime, `Season "${season}" not found in imageIndex.json`);
        return false;
    }
    
    let selectedList = imageList[season][wxCond];
    
    if (!selectedList || selectedList.length === 0) {
        console.error(logTheFrickinTime, `No images found for season "${season}" and weather condition "${wxCond}"`);
        return false;
    }
    
    const randomizedIndex = Math.floor(Math.random() * selectedList.length);
    selectedImage = selectedList[randomizedIndex];
    console.log(logTheFrickinTime, `Selected background for ${wxCond}:`, selectedImage);
    return true;
}

function initLocalBackgrounds(wxCond) {
    if (randomLocalBackground(wxCond)) {
        console.log(logTheFrickinTime, "Selected initial local background:", selectedImage);
        setInterval(() => {
            randomLocalBackground(wxCond);
            console.log(logTheFrickinTime, "Selected new local background:", selectedImage);
        }, 24 / 60 * 60 * 1000);
        backgroundsInitialized = wxCond;
        console.log(logTheFrickinTime, "Local backgrounds initialized successfully for:", wxCond);
    } else {
        console.error(logTheFrickinTime, "Failed to initialize local backgrounds for:", wxCond);
    }
}

app.use(express.text({ type: 'text/plain' }));


app.post('/backgrounds/init', (req, res) => {
  let wxCond = "wxgood";
  if (typeof req.body === 'string' && req.body.startsWith('[') && req.body.endsWith(']')) {
    wxCond = req.body.slice(1, -1);
  }
  if (backgroundsInitialized && wxCond === backgroundsInitialized) {
    res.send(`Backgrounds are already initialized with weather condition: ${backgroundsInitialized}`);
    console.log(logTheFrickinTime, "Backgrounds are already initialized with weather condition:", backgroundsInitialized);
    return;
  } else {
    initLocalBackgrounds(wxCond);
    res.send(`Initialized/re-initialized local backgrounds with weather condition: ${wxCond}`);
    console.log(logTheFrickinTime, "Initialized/re-initialized local backgrounds with weather condition:", wxCond);
  }
});

app.get('/backgrounds/image', (req, res) => {
    if (selectedImage) {
        res.send(selectedImage);
        console.log(logTheFrickinTime, "Served local background image:", selectedImage);
    } else {
        res.status(204).send("Background image not initialized.");
        console.warn(logTheFrickinTime, "Background image requested before initialization.");
    }
});


app.get('/data', (req, res) => {
  res.send("ARE YOU HAVE STUPID??? YOU ARE SUPOSED TO AD PARAMTER LIKE /data/MEMPHOS?loctype=primary!!!!!")

})

app.get('/data/:location', async (req, res) => {
  try {
    const location = req.params.location;
          let geocode;
          const locType = req.query.locType;
          console.log(logTheFrickinTime, `GET request from the client:`, req.path, `and fetching for location type as ${locType}`)

          const localeData = await loadLocaleData(location)

          geocode = `${localeData.lat},${localeData.lon}`

          if (locType === null) {
            res.status(400).json({
              error: true,
              comment: "Please add a locType query",
            })
          } else {
            const wxData = await loadWxData(localeData.postalKey, geocode, locType)
          
            res.json({
              metadata: {
                localeData,
                units: serverConfig.units,
                hdsLocType: locType,
              },
              weather: wxData,
            })

          }
  } catch (error) {
    res.send(error)
    console.error(logTheFrickinTime, error)
  }
})

      



app.get('/bing-background', async (req, res) => {
  try {
      const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US');
      const data = await response.json();
      res.json(data);
      console.log(logTheFrickinTime, "Client requested Bing background image.")


      const random = Math.floor(Math.random() * 9000);
      if (random === 1) {
          console.error(logTheFrickinTime, "IF YOU ARE SEEING THIS ERROR, PLEASE SAY HI TO MARI FOR ME :3. ~raii")
          process.exit(1);
      }
  } catch (error) {
      res.status(500).json(`${logTheFrickinTime} Error fetching Bing background image: ${error}`);
  }
});

app.get('/heartbeat', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
  console.log(logTheFrickinTime, "Heartbeat check received from client.");
});

process.on('SIGINT', () => {console.log("Exiting WeatherHDS daemon"); process.exit();});
process.on('SIGUSR2', () => {console.log("Exiting WeatherHDS daemon"); process.exit();});
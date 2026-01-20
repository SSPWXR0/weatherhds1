import { requestWxData } from './data.js'
import { config, locationConfig, serverConfig, weatherIcons } from "../config.js";

const ldlPresentationSlides = {
    "0": { htmlID: "ldl-current", durationMS: 20000 },
    "1": { htmlID: "ldl-forecast", durationMS: 20000 },
    "2": { htmlID: "ldl-aqi", durationMS: 5000 },
}

let totalDuration = 0;
let totalDurationSec = 0;

for (let key in ldlPresentationSlides) {
    totalDuration += Number(ldlPresentationSlides[key].durationMS);
    totalDurationSec += Number(ldlPresentationSlides[key].durationMS) / 1000;
}

const logTheFrickinTime = () => `[ldl.js] | ${new Date().toLocaleString()} |`;

let ldlLocationIndex = 0;
let ldlSlideIndex = 0;
let iconDir = "animated"

const units = serverConfig.units;

let endingTemp, endingWind, endingDistance, endingMeasurement, endingCeiling, endingPressure, endingSnow, endingRain;

if (units === "e") {
    endingTemp = "°F"
    endingWind = "mph"
    endingDistance = "mi"
    endingMeasurement = "in"
    endingCeiling = "ft"
    endingPressure = "hg"
    endingSnow = "in"
    endingRain = "in"
} else if (units === "m") {
    endingTemp = "°C"
    endingWind = "km/h"
    endingDistance = "km"
    endingMeasurement = "mm"
    endingCeiling = "m"
    endingPressure = "mb"
    endingSnow = "cm"
    endingRain = "mm"
}

const bulletinCrawlContainer = document.getElementsByClassName('ldl-bulletin-crawl')[0]

bulletinCrawlContainer.style.display = `none`

const ldlDomCache = Object.freeze({
    locationLabel: document.getElementById('ldl-location-label'),
    progressBar: document.getElementById('ldl-location-progressbar'),
    currentTemp: document.getElementById('ldl-current-temp'),
    currentIcon: document.getElementById('ldl-current-icon'),
    currentCondition: document.getElementById('ldl-current-condition'),
    currentWind: document.getElementById('ldl-current-wind-value'),
    currentHumidity: document.getElementById('ldl-current-humidity-value'),
    currentDewpoint: document.getElementById('ldl-current-dewpoint-value'),
    currentPressure: document.getElementById('ldl-current-pressure-value'),
    currentVisib: document.getElementById('ldl-current-visibility-value'),
    currentCeiling: document.getElementById('ldl-current-ceiling-value'),
    currentFeelsLike: document.getElementById('ldl-current-feelslike-value'),
    currentModule1: document.getElementById('ldl-current-module1'),
    currentModule2: document.getElementById('ldl-current-module2'),
    forecast0Name: document.getElementById('ldl-forecast-day0-name'),
    forecast0Cond: document.getElementById('ldl-forecast-day0-condition'),
    forecast0Icon: document.getElementById('ldl-day0-icon'),
    forecast0Temp: document.getElementById('ldl-forecast-day0-temp'),
    forecast0Precip: document.getElementById('ldl-forecast-day0-pop-value'),
    forecast1Name: document.getElementById('ldl-forecast-day1-name'),
    forecast1Cond: document.getElementById('ldl-forecast-day1-condition'),
    forecast1Icon: document.getElementById('ldl-day1-icon'),
    forecast1Temp: document.getElementById('ldl-forecast-day1-temp'),
    forecast1Precip: document.getElementById('ldl-forecast-day1-pop-value'),
    forecast0Container: document.getElementById('ldl-forecast-day0-container'),
    forecast1Container: document.getElementById('ldl-forecast-day1-container'),
    aqiStatus: document.getElementById('ldl-aqi-status'),
    aqiIndex: document.getElementById('ldl-aqi-index'),
    aqiPrimaryPollutant: document.getElementById('ldl-aqi-primarypollutant'),
    ldlCurrent: document.getElementById('ldl-current'),
    ldlForecast: document.getElementById('ldl-forecast'),
    ldlAqi: document.getElementById('ldl-aqi'),
});



export function requestBulletinCrawl(text, alertCategory, headlineText, country, colorCode) {
  bulletinCrawlContainer.style.display = `block`
  const beep = new Audio('../audio/beep.ogg');
  document.getElementById('ldl-bulletin-text').innerText = text
  document.getElementById('ldl-bulletin-metadata-text').innerText = headlineText

  if (country === "US") {
    switch (alertCategory) {
      case "W":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(188, 57, 33, 1) 4%, rgba(56, 8, 0, 1) 100%)`
        break;
      case "A":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(247, 231, 136, 1) 4%, rgba(56, 35, 0, 1) 100%)`
        break;
      case "S":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(87, 170, 87, 1) 4%, rgba(0, 56, 53, 1) 100%)`
        break;
      case "Y":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(87, 170, 87, 1) 4%, rgba(0, 56, 53, 1) 100%)`
        break;
    }
  } else if (country === "CA") {
    switch (colorCode) {
      case "Orange":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(221, 115, 34, 1) 4%, rgba(56, 8, 0, 1) 100%)`
        break;
      case "Yellow":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(247, 231, 136, 1) 4%, rgba(56, 35, 0, 1) 100%)`
        break;
      case "Red":
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(189, 59, 29, 1) 4%, rgba(0, 56, 53, 1) 100%)`
        break;
      default:
        bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(87, 170, 87, 1) 4%, rgba(0, 56, 53, 1) 100%)`
        break;
    }
  } else {
    bulletinCrawlContainer.style.background = `radial-gradient(circle,rgba(189, 59, 29, 1) 4%, rgba(0, 56, 53, 1) 100%)`
  }



  bulletinCrawlContainer.animate(
    [
      { backgroundPosition: '10% 60%' },
      { backgroundPosition: '10% 500%' },
      { backgroundPosition: '10% 60%' },
    ],
    {
      duration: 3000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out'
    }
  )


  $(document).ready(function(){
            $('#ldl-bulletin-text').marquee({
                duration: 20000,
                gap: 1024,
                direction: 'left',
                duplicated: true, 
                pauseOnHover: true,
            })
        })
  beep.play();
}

let currentLDLData = null;

async function fetchLDLData(locationName) {
    try {
        if (config.verboseLogging === true) {
            console.log(`${logTheFrickinTime()} Fetching LDL data for: ${locationName}`)
        }
        
        const wxData = await requestWxData(locationName, "ldl");
        
        if (wxData && wxData.weather) {
            currentLDLData = {
                current: wxData.weather["v3-wx-observations-current"] ?? null,
                forecast: wxData.weather["v3-wx-forecast-daily-7day"] ?? wxData.weather["v3-wx-forecast-daily-3day"] ?? null,
                aqi: wxData.weather["v3-wx-globalAirQuality"] ?? null,
            };
            
            if (config.verboseLogging === true) {
                console.log(`${logTheFrickinTime()} Successfully fetched LDL data for ${locationName}`, currentLDLData)
            }
            
            return true;
        } else {
            console.warn(`${logTheFrickinTime()} No weather data returned for ${locationName}`);
            return false;
        }
    } catch (error) {
        console.error(`${logTheFrickinTime()} Error fetching LDL data for ${locationName}:`, error);
        return false;
    }
}

async function LDLData() {
    try {
        if (config.staticIcons === true) {
            iconDir = "static"
        } else {
            iconDir = "animated"
        }

        const ldlLocations = locationConfig.ldlLocations;
        
        if (!ldlLocations || ldlLocations.length === 0) {
            console.warn(`${logTheFrickinTime()} No LDL locations configured!`);
            return;
        }

        if (ldlLocationIndex >= ldlLocations.length) {
            ldlLocationIndex = 0;
        }

        const locationName = ldlLocations[ldlLocationIndex];
        
        if (ldlDomCache.locationLabel) {
            ldlDomCache.locationLabel.textContent = `Weather for ${locationName}`
        }

        const success = await fetchLDLData(locationName);
        
        if (!success || !currentLDLData || !currentLDLData.current) {
            console.warn(`${logTheFrickinTime()} No valid data for ${locationName}, skipping...`);
            return;
        }

        if (config.verboseLogging === true) {
            console.log(`${logTheFrickinTime()} Current LDL location: ${locationName}`)
        }

        appendLDLCurrent();
        appendLDLForecast();
        appendLDLAirQuality();

    } catch (error) {
        console.error(`${logTheFrickinTime()} Error in LDLData:`, error);
    }
}

function appendLDLCurrent() {
    if (!currentLDLData || !currentLDLData.current) return;
    
    const current = currentLDLData.current;
    const c = ldlDomCache;

    if (c.currentTemp) c.currentTemp.textContent = `${current.temperature}${endingTemp}`
    if (c.currentCondition) c.currentCondition.textContent = current.wxPhraseMedium ?? current.wxPhraseLong ?? "N/A"
    if (c.currentWind) c.currentWind.textContent = `${current.windDirectionCardinal ?? "N/A"}, ${current.windSpeed ?? 0}${endingWind}`
    if (c.currentHumidity) c.currentHumidity.textContent = `${current.relativeHumidity ?? 0}%`
    if (c.currentDewpoint) c.currentDewpoint.textContent = `${current.temperatureDewPoint ?? 0}${endingTemp}`
    if (c.currentPressure) c.currentPressure.textContent = `${current.pressureAltimeter ?? 0}${endingPressure}`
    if (c.currentVisib) c.currentVisib.textContent = `${Math.round(current.visibility ?? 0)}${endingDistance}`
    if (c.currentFeelsLike) c.currentFeelsLike.textContent = `${current.temperatureFeelsLike ?? current.temperature}${endingTemp}`

    if (c.currentIcon) {
        const iconCode = current.iconCode;
        const dayOrNight = current.dayOrNight;
        const iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
        c.currentIcon.src = `/graphics/${iconDir}/${iconPath}`
    }
    
    if (c.currentCeiling) {
        const ceiling = current.cloudCeiling;
        c.currentCeiling.textContent = (ceiling === null || ceiling === undefined) 
            ? "Unlimited" 
            : `${ceiling}${endingCeiling}`
    }
}

function appendLDLForecast() {
    if (!currentLDLData || !currentLDLData.forecast) return;
    
    const forecast = currentLDLData.forecast;
    const c = ldlDomCache;

    if (!forecast.daypart || !forecast.daypart[0]) return;
    
    const daypart = forecast.daypart[0];
    
    if (c.forecast0Name) c.forecast0Name.textContent = daypart.daypartName[0] ?? daypart.daypartName[1] ?? "Today"
    if (c.forecast0Cond) c.forecast0Cond.textContent = daypart.wxPhraseShort[0] ?? daypart.wxPhraseShort[1] ?? "N/A"
    if (c.forecast0Temp) c.forecast0Temp.textContent = `${daypart.temperature[0] ?? daypart.temperature[1] ?? "--"}°`
    if (c.forecast0Precip) c.forecast0Precip.textContent = `${daypart.precipChance[0] ?? daypart.precipChance[1] ?? 0}%`

    if (c.forecast0Icon) {
        const dayOneIconCode = daypart.iconCode[0] ?? daypart.iconCode[1];
        const dayOrNight = daypart.dayOrNight[0] ?? daypart.dayOrNight[1];
        const iconPath = weatherIcons[dayOneIconCode] ? weatherIcons[dayOneIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
        c.forecast0Icon.src = `/graphics/${iconDir}/${iconPath}`
    }

    if (daypart.daypartName[0] === null) {
        if (c.forecast1Name) c.forecast1Name.textContent = daypart.daypartName[2] ?? "Tomorrow"
        if (c.forecast1Cond) c.forecast1Cond.textContent = daypart.wxPhraseShort[2] ?? "N/A"
        if (c.forecast1Temp) c.forecast1Temp.textContent = `${daypart.temperature[2] ?? "--"}°`
        if (c.forecast1Precip) c.forecast1Precip.textContent = `${daypart.precipChance[2] ?? 0}%`

        if (c.forecast1Icon) {
            const dayTwoIconCode = daypart.iconCode[2]
            const dayOrNight = daypart.dayOrNight[2]
            const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
            c.forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
        }
    } else {
        if (c.forecast1Name) c.forecast1Name.textContent = daypart.daypartName[1] ?? "Tonight"
        if (c.forecast1Cond) c.forecast1Cond.textContent = daypart.wxPhraseShort[1] ?? "N/A"
        if (c.forecast1Temp) c.forecast1Temp.textContent = `${daypart.temperature[1] ?? "--"}°`
        if (c.forecast1Precip) c.forecast1Precip.textContent = `${daypart.precipChance[1] ?? 0}%`

        if (c.forecast1Icon) {
            const dayTwoIconCode = daypart.iconCode[1]
            const dayOrNight = daypart.dayOrNight[1]
            const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
            c.forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
        }
    }
}

function appendLDLAirQuality() {
    const c = ldlDomCache;
    
    if (!currentLDLData || !currentLDLData.aqi || !currentLDLData.aqi.globalairquality) {
        if (c.aqiStatus) c.aqiStatus.textContent = "N/A"
        if (c.aqiIndex) c.aqiIndex.textContent = "--"
        if (c.aqiPrimaryPollutant) c.aqiPrimaryPollutant.textContent = "N/A"
        return;
    }
    
    const aqi = currentLDLData.aqi.globalairquality;

    if (c.aqiStatus) {
        c.aqiStatus.style.color = `#${aqi.airQualityCategoryIndexColor ?? 'FFFFFF'}`
        c.aqiStatus.textContent = aqi.airQualityCategory ?? "N/A"
    }
    if (c.aqiIndex) c.aqiIndex.textContent = aqi.airQualityCategoryIndex ?? "--"
    if (c.aqiPrimaryPollutant) c.aqiPrimaryPollutant.textContent = aqi.primaryPollutant ?? "N/A"
}
  
function showLocationLabel() {
    const label = ldlDomCache.locationLabel;
    if (!label) return;
    label.style.display = 'block';
    label.style.animation = 'slideIn 1s ease-out';
}

function hideLocationLabel() {
    const label = ldlDomCache.locationLabel;
    if (!label) return;
    label.style.animation = 'slideOut 1s ease-out';

    setTimeout(() => {
        label.style.display = 'none';
    }, 300);
}

function runCurrentSlide() {
    const module1 = ldlDomCache.currentModule1;
    const module2 = ldlDomCache.currentModule2;

    if (!module1 || !module2) return;

    module1.style.display = 'flex';
    module2.style.display = 'none';

    const currentSlide = ldlPresentationSlides[0];
    const halfDuration = currentSlide.durationMS / 2;

    setTimeout(() => {
        module1.style.animation = 'fadeModule 0.2s ease-out';

        setTimeout(() => {
            module1.style.display = 'none';
            module1.style.animation = '';
            module2.style.display = 'flex';
            module2.style.animation = 'switchModules 0.5s ease-out';
        }, 200);

    }, halfDuration - 300);
}

function runForecastSlide() {
    const day0 = ldlDomCache.forecast0Container;
    const day1 = ldlDomCache.forecast1Container;

    if (!day0 || !day1) return;

    day0.style.display = 'flex';
    day1.style.display = 'none';

    const forecastSlide = ldlPresentationSlides[1];
    const halfDuration = forecastSlide.durationMS / 2;

    setTimeout(() => {
        day0.style.animation = 'fadeModule 0.2s ease-out';

        setTimeout(() => {
            day0.style.display = 'none';
            day0.style.animation = '';
            day1.style.display = 'flex';
            day1.style.animation = 'switchModules 0.5s ease-out';
        }, 100);

    }, halfDuration - 300);
}

function triggerExitAnimation(slideID) {
    const slideElement = document.getElementById(slideID);
    if (!slideElement) return;

    slideElement.style.animation = 'slideOut 1s ease-out';

    setTimeout(() => {
        slideElement.style.display = 'none';
    }, 200);
}

// Map slide IDs to cached elements for O(1) lookup
const slideElementMap = {
    'ldl-current': () => ldlDomCache.ldlCurrent,
    'ldl-forecast': () => ldlDomCache.ldlForecast,
    'ldl-aqi': () => ldlDomCache.ldlAqi,
};

function showLDLSlide() {
    const slide = ldlPresentationSlides[ldlSlideIndex];
    const duration = slide.durationMS;

    if (config.verboseLogging === true) {
        console.log(`${logTheFrickinTime()} Showing LDL slide: ${slide.htmlID} for ${duration}ms`)             
    }
    
    const slideElement = slideElementMap[slide.htmlID]?.() || document.getElementById(slide.htmlID);
    if (!slideElement) {
        console.warn(`${logTheFrickinTime()} LDL slide element not found: ${slide.htmlID}`);
        setTimeout(nextLDLSlide, 2000);
        return;
    }

    slideElement.style.cssText = 'display:block;animation:slideIn 1s ease-out';

    if (slide.htmlID === 'ldl-current') {
        runCurrentSlide();
    }

    if (slide.htmlID === 'ldl-forecast') {
        runForecastSlide();
    }

    if (ldlSlideIndex === Object.keys(ldlPresentationSlides).length - 1) {
        setTimeout(() => hideLocationLabel(), duration - 1000);
    }

    setTimeout(() => triggerExitAnimation(slide.htmlID), duration - 1000);

    setTimeout(() => {
        nextLDLSlide();
    }, duration)
}

function nextLDLSlide() {
    ldlSlideIndex = (ldlSlideIndex + 1) % Object.keys(ldlPresentationSlides).length;
    
    if (ldlSlideIndex === 0) {
        nextLDLLocation();
    } else {
        showLDLSlide();
    }
}

async function nextLDLLocation() {
    const ldlLocations = locationConfig.ldlLocations;
    
    if (!ldlLocations || ldlLocations.length === 0) {
        console.warn(`${logTheFrickinTime()} No LDL locations configured!`);
        return;
    }

    ldlLocationIndex = (ldlLocationIndex + 1) % ldlLocations.length;

    showLocationLabel();
    runProgressBar();

    ldlSlideIndex = 0;

    await LDLData();
    showLDLSlide();
}

let progressBarTimeout = null;

function runProgressBar() {
    const progressBar = ldlDomCache.progressBar;
    if (!progressBar) return;

    if (progressBarTimeout) {
        clearTimeout(progressBarTimeout);
        progressBarTimeout = null;
    }

    progressBar.style.animation = 'none';
    progressBar.style.display = 'block';
    void progressBar.offsetWidth;
    progressBar.style.animation = `ldlProgressBar ${totalDurationSec}s linear`;

    progressBarTimeout = setTimeout(() => {
        progressBar.style.display = 'none';
        progressBar.style.animation = 'none';
        progressBarTimeout = null;
    }, totalDuration);
}

export async function runInitialLDL() {
    const ldlLocations = locationConfig.ldlLocations;
    
    if (!ldlLocations || ldlLocations.length === 0) {
        console.warn(`${logTheFrickinTime()} No LDL locations configured! LDL will not run.`);
        return;
    }

    if (config.verboseLogging === true) {
        console.log(`${logTheFrickinTime()} Starting LDL presentation`);
        console.log(`${logTheFrickinTime()} Total Duration (ms): ${totalDuration}`);
        console.log(`${logTheFrickinTime()} Total Duration (sec): ${totalDurationSec}`);
        console.log(`${logTheFrickinTime()} LDL Locations:`, ldlLocations);
    }

    ldlLocationIndex = 0;
    ldlSlideIndex = 0;

    showLocationLabel();
    runProgressBar();
    
    await LDLData();
    showLDLSlide();
}
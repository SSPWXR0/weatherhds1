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

const locationLabel = document.getElementById('ldl-location-label')

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



export function requestBulletinCrawl(text, alertCategory, headlineText, country, colorCode) {
  bulletinCrawlContainer.style.display = `block`
  const beep = new Audio('../audio/beep.flac');
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
        
        if (locationLabel) {
            locationLabel.innerHTML = `Weather for ${locationName}`
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
    
    const currentTemp = document.getElementById('ldl-current-temp');
    const currentIcon = document.getElementById('ldl-current-icon');
    const currentCondition = document.getElementById('ldl-current-condition');
    const currentWind = document.getElementById('ldl-current-wind-value');
    const currentHumidity = document.getElementById('ldl-current-humidity-value');
    const currentDewpoint = document.getElementById('ldl-current-dewpoint-value');
    const currentPressure = document.getElementById('ldl-current-pressure-value');
    const currentVisib = document.getElementById('ldl-current-visibility-value');
    const currentCeiling = document.getElementById('ldl-current-ceiling-value');
    const currentFeelsLike = document.getElementById('ldl-current-feelslike-value');

    if (currentTemp) currentTemp.innerHTML = `${current.temperature}${endingTemp}`
    if (currentCondition) currentCondition.innerHTML = current.wxPhraseMedium ?? current.wxPhraseLong ?? "N/A"
    if (currentWind) currentWind.innerHTML = `${current.windDirectionCardinal ?? "N/A"}, ${current.windSpeed ?? 0}${endingWind}`
    if (currentHumidity) currentHumidity.innerHTML = `${current.relativeHumidity ?? 0}%`
    if (currentDewpoint) currentDewpoint.innerHTML = `${current.temperatureDewPoint ?? 0}${endingTemp}`
    if (currentPressure) currentPressure.innerHTML = `${current.pressureAltimeter ?? 0}${endingPressure}`
    if (currentVisib) currentVisib.innerHTML = `${Math.round(current.visibility ?? 0)}${endingDistance}`
    if (currentFeelsLike) currentFeelsLike.innerHTML = `${current.temperatureFeelsLike ?? current.temperature}${endingTemp}`

    if (currentIcon) {
        const iconCode = current.iconCode;
        const dayOrNight = current.dayOrNight;
        const iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
        currentIcon.src = `/graphics/${iconDir}/${iconPath}`
    }
    
    if (currentCeiling) {
        let ceilingFormatted;
        if (current.cloudCeiling === null || current.cloudCeiling === undefined) {
            ceilingFormatted = "Unlimited"
        } else {
            ceilingFormatted = `${current.cloudCeiling}${endingCeiling}`
        }
        currentCeiling.innerHTML = ceilingFormatted
    }
}

function appendLDLForecast() {
    if (!currentLDLData || !currentLDLData.forecast) return;
    
    const forecast = currentLDLData.forecast;
    
    const forecast0Name = document.getElementById('ldl-forecast-day0-name');
    const forecast0Cond = document.getElementById('ldl-forecast-day0-condition');
    const forecast0Icon = document.getElementById('ldl-day0-icon');
    const forecast0Temp = document.getElementById('ldl-forecast-day0-temp');
    const forecast0Precip = document.getElementById('ldl-forecast-day0-pop-value');
    const forecast1Name = document.getElementById('ldl-forecast-day1-name');
    const forecast1Cond = document.getElementById('ldl-forecast-day1-condition');
    const forecast1Icon = document.getElementById('ldl-day1-icon');
    const forecast1Temp = document.getElementById('ldl-forecast-day1-temp');
    const forecast1Precip = document.getElementById('ldl-forecast-day1-pop-value');

    if (!forecast.daypart || !forecast.daypart[0]) return;
    
    const daypart = forecast.daypart[0];
    
    if (forecast0Name) forecast0Name.innerHTML = daypart.daypartName[0] ?? daypart.daypartName[1] ?? "Today"
    if (forecast0Cond) forecast0Cond.innerHTML = daypart.wxPhraseShort[0] ?? daypart.wxPhraseShort[1] ?? "N/A"
    if (forecast0Temp) forecast0Temp.innerHTML = `${daypart.temperature[0] ?? daypart.temperature[1] ?? "--"}°`
    if (forecast0Precip) forecast0Precip.innerHTML = `${daypart.precipChance[0] ?? daypart.precipChance[1] ?? 0}%`

    if (forecast0Icon) {
        const dayOneIconCode = daypart.iconCode[0] ?? daypart.iconCode[1];
        const dayOrNight = daypart.dayOrNight[0] ?? daypart.dayOrNight[1];
        const iconPath = weatherIcons[dayOneIconCode] ? weatherIcons[dayOneIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
        forecast0Icon.src = `/graphics/${iconDir}/${iconPath}`
    }

    if (daypart.daypartName[0] === null) {
        if (forecast1Name) forecast1Name.innerHTML = daypart.daypartName[2] ?? "Tomorrow"
        if (forecast1Cond) forecast1Cond.innerHTML = daypart.wxPhraseShort[2] ?? "N/A"
        if (forecast1Temp) forecast1Temp.innerHTML = `${daypart.temperature[2] ?? "--"}°`
        if (forecast1Precip) forecast1Precip.innerHTML = `${daypart.precipChance[2] ?? 0}%`

        if (forecast1Icon) {
            const dayTwoIconCode = daypart.iconCode[2]
            const dayOrNight = daypart.dayOrNight[2]
            const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
            forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
        }
    } else {
        if (forecast1Name) forecast1Name.innerHTML = daypart.daypartName[1] ?? "Tonight"
        if (forecast1Cond) forecast1Cond.innerHTML = daypart.wxPhraseShort[1] ?? "N/A"
        if (forecast1Temp) forecast1Temp.innerHTML = `${daypart.temperature[1] ?? "--"}°`
        if (forecast1Precip) forecast1Precip.innerHTML = `${daypart.precipChance[1] ?? 0}%`

        if (forecast1Icon) {
            const dayTwoIconCode = daypart.iconCode[1]
            const dayOrNight = daypart.dayOrNight[1]
            const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
            forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
        }
    }
}

function appendLDLAirQuality() {
    if (!currentLDLData || !currentLDLData.aqi || !currentLDLData.aqi.globalairquality) {
        const aqiStatus = document.getElementById('ldl-aqi-status');
        const aqiIndex = document.getElementById('ldl-aqi-index');
        const aqiPrimaryPollutant = document.getElementById('ldl-aqi-primarypollutant');
        
        if (aqiStatus) aqiStatus.innerHTML = "N/A"
        if (aqiIndex) aqiIndex.innerHTML = "--"
        if (aqiPrimaryPollutant) aqiPrimaryPollutant.innerHTML = "N/A"
        return;
    }
    
    const aqi = currentLDLData.aqi.globalairquality;
    
    const aqiStatus = document.getElementById('ldl-aqi-status');
    const aqiIndex = document.getElementById('ldl-aqi-index');
    const aqiPrimaryPollutant = document.getElementById('ldl-aqi-primarypollutant');

    if (aqiStatus) {
        aqiStatus.style.color = `#${aqi.airQualityCategoryIndexColor ?? 'FFFFFF'}`
        aqiStatus.innerHTML = aqi.airQualityCategory ?? "N/A"
    }
    if (aqiIndex) aqiIndex.innerHTML = aqi.airQualityCategoryIndex ?? "--"
    if (aqiPrimaryPollutant) aqiPrimaryPollutant.innerHTML = aqi.primaryPollutant ?? "N/A"
}
  
function showLocationLabel() {
    if (!locationLabel) return;
    locationLabel.style.display = 'block';
    locationLabel.style.animation = 'slideIn 1s ease-out';
}

function hideLocationLabel() {
    if (!locationLabel) return;
    locationLabel.style.animation = 'slideOut 1s ease-out';

    setTimeout(() => {
        locationLabel.style.display = 'none';
    }, 300);
}

function runCurrentSlide() {
    const module1 = document.getElementById('ldl-current-module1');
    const module2 = document.getElementById('ldl-current-module2');

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
    const day0 = document.getElementById('ldl-forecast-day0-container');
    const day1 = document.getElementById('ldl-forecast-day1-container');

    if (!day0 || !day1) return;

    day0.style.display = 'flex';
    day1.style.display = 'none';

    const forecastSlide = ldlPresentationSlides[1];
    const halfDuration = forecastSlide.durationMS / 2;

    setTimeout(() => {
        day0.style.display = 'none';
        day1.style.display = 'flex';
    }, halfDuration);

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

function showLDLSlide() {
    const slide = ldlPresentationSlides[ldlSlideIndex]
    const duration = slide.durationMS;

    if (config.verboseLogging === true) {
        console.log(`${logTheFrickinTime()} Showing LDL slide: ${slide.htmlID} for ${duration}ms`)             
    }
    
    const slideElement = document.getElementById(slide.htmlID)
    if (!slideElement) {
        console.warn(`${logTheFrickinTime()} LDL slide element not found: ${slide.htmlID}`);
        setTimeout(() => {
            nextLDLSlide();
        }, 2000);
        return;
    }

    slideElement.style.display = 'block';
    slideElement.style.animation = 'slideIn 1s ease-out';

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
    const progressBar = document.getElementById('ldl-location-progressbar')
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
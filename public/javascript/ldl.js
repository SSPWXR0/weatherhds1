import { locationsList, units } from './data.js'
import { config, weatherIcons } from "../config.js";

const ldlPresentationSlides = {
    "0": { htmlID: "ldl-current", durationMS: "20000" },
    "1": { htmlID: "ldl-forecast", durationMS: "20000" },
    "2": { htmlID: "ldl-aqi", durationMS: "5000" },
}

let totalDuration = 0;
let totalDurationSec = 0;

for (let key in ldlPresentationSlides) {
    totalDuration += Number(ldlPresentationSlides[key].durationMS);
    totalDurationSec += Number(ldlPresentationSlides[key].durationMS) / 1000;
}

const locationLabel = document.getElementById('ldl-location-label')

let ldlLocationIndex = 0;
let ldlSlideIndex = 0;
let iconDir

let endingTemp, endingWind, endingDistance, endingMeasurement, endingCeiling, endingPressure, endingSnow, endingRain;

const bulletinCrawlContainer = document.getElementsByClassName('ldl-bulletin-crawl')[0]

bulletinCrawlContainer.style.display = `none`

export function showBulletinCrawl(text, alertCategory, headlineText) {

  /*
    W = warning
    S = advisory
    A = watch
  */

  bulletinCrawlContainer.style.display = `block`
  const beep = new Audio('../audio/beep.flac');
  document.getElementById('ldl-bulletin-text').innerText = text
  document.getElementById('ldl-bulletin-metadata-text').innerText = headlineText

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

async function LDLData() {
    try {
  
      function processnextLDLLocation() {

        if (config.staticIcons === true) {
            iconDir = "static"
        } else {
            iconDir = "animated"
        }
  
        if (units == "e") {
          endingTemp = "°F"
          endingWind = "mph"
          endingDistance = "mi"
          endingMeasurement = "in"
          endingCeiling= "ft"
          endingPressure = "hg"
          endingSnow = "in"
          endingRain = "in"
        } else if (units == "m") {
            endingTemp = "°C"
            endingWind = "km/h"
            endingDistance = "km"
            endingMeasurement = "mm"
            endingCeiling = "m"
            endingPressure = "mb"
            endingSnow = "cm"
            endingRain = "mm"
        }

        if (ldlLocationIndex < locationsList.locationIndex.ldlLocations.length) {
          
          const locationName = locationsList.locationIndex.ldlLocations[ldlLocationIndex];
          const locationData = ldlData[locationName];

          locationLabel.innerHTML = `Weather for ${locationName}`
  
          if (locationData) {
            const latestKey = Object.keys(locationData)
              .map(Number)
              .sort((a, b) => b - a)[0];
  
            const latestData = locationData[latestKey];
  
          if (latestData && latestData.current) {

              function appendCurrent() {
                if (config.verboseLogging === true) {
                  console.log(`Current LDL location: ${locationName}`)
                }

                // Temp and Condition
                const currentTemp = document.getElementById('ldl-current-temp');
                const currentIcon = document.getElementById('ldl-current-icon');
                const currentCondition = document.getElementById('ldl-current-condition');
                // Wind
                const currentWind = document.getElementById('ldl-current-wind-value');
                // Extra Products
                const currentHumidity = document.getElementById('ldl-current-humidity-value');
                const currentDewpoint = document.getElementById('ldl-current-dewpoint-value');
                const currentPressure = document.getElementById('ldl-current-pressure-value');
                const currentVisib = document.getElementById('ldl-current-visibility-value');
                const currentCeiling = document.getElementById('ldl-current-ceiling-value');
                const currentFeelsLike = document.getElementById('ldl-current-feelslike-value');

        
                currentTemp.innerHTML = `${latestData.current.temperature}${endingTemp}`
                currentCondition.innerHTML = latestData.current.wxPhraseMedium
                currentWind.innerHTML = `${latestData.current.windDirectionCardinal}, ${latestData.current.windSpeed}${endingWind}`
                currentHumidity.innerHTML = `${latestData.current.relativeHumidity}%`
                currentDewpoint.innerHTML = `${latestData.current.temperatureDewPoint}${endingTemp}`
                currentPressure.innerHTML = `${latestData.current.pressureAltimeter}${endingPressure}`
                currentVisib.innerHTML = `${Math.round(latestData.current.visibility)}${endingDistance}`
                currentFeelsLike.innerHTML = `${latestData.current.temperatureFeelsLike}${endingTemp}`

                const iconCode = latestData.current.iconCode;
                const dayOrNight = latestData.current.dayOrNight;
                const iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                currentIcon.src = `/graphics/${iconDir}/${iconPath}`
                
                let ceilingFormatted;
    
                if (latestData.current.cloudCeiling === null) {
                    ceilingFormatted = "Unlimited"
                } else {
                    ceilingFormatted = `${latestData.current.cloudCeiling}${endingCeiling}`
                }
    
                currentCeiling.innerHTML = ceilingFormatted
              }
    
              function appendForecast() {
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
    
                forecast0Name.innerHTML = latestData.forecast.daypart[0].daypartName[0] ?? latestData.forecast.daypart[0].daypartName[1]
                forecast0Cond.innerHTML = latestData.forecast.daypart[0].wxPhraseShort[0] ?? latestData.forecast.daypart[0].wxPhraseShort[1]
                forecast0Temp.innerHTML = `${latestData.forecast.daypart[0].temperature[0] ?? latestData.forecast.daypart[0].temperature[1]}°`
                forecast0Precip.innerHTML = `${latestData.forecast.daypart[0].precipChance[0] ?? latestData.forecast.daypart[0].precipChance[1]}%`
    
                const dayOneIconCode = latestData.forecast.daypart[0].iconCode[0] ?? latestData.forecast.daypart[0].iconCode[1];
                const dayOrNight = latestData.forecast.daypart[0].dayOrNight[0] ?? latestData.forecast.daypart[0]?.dayOrNight[1];
                const iconPath = weatherIcons[dayOneIconCode] ? weatherIcons[dayOneIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                forecast0Icon.src = `/graphics/${iconDir}/${iconPath}`

                if (latestData.forecast.daypart[0].daypartName[0] === null) {
                    forecast1Name.innerHTML = latestData.forecast.daypart[0].daypartName[2]
                    forecast1Cond.innerHTML = latestData.forecast.daypart[0].wxPhraseShort[2]
                    forecast1Temp.innerHTML = `${latestData.forecast.daypart[0].temperature[2]}°`
                    forecast1Precip.innerHTML = `${latestData.forecast.daypart[0].precipChance[2]}%`    
    
                    const dayTwoIconCode = latestData.forecast.daypart[0].iconCode[2]
                    const dayOrNight = latestData.forecast.daypart[0].dayOrNight[2]
                    const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                    forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
                } else {
                    forecast1Name.innerHTML = latestData.forecast.daypart[0].daypartName[1]
                    forecast1Cond.innerHTML = latestData.forecast.daypart[0].wxPhraseShort[1]
                    forecast1Temp.innerHTML = `${latestData.forecast.daypart[0].temperature[1]}°`
                    forecast1Precip.innerHTML = `${latestData.forecast.daypart[0].precipChance[1]}%`    
    
                    const dayTwoIconCode = latestData.forecast.daypart[0].iconCode[1]
                    const dayOrNight = latestData.forecast.daypart[0].dayOrNight[1]
                    const iconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                    forecast1Icon.src = `/graphics/${iconDir}/${iconPath}`
                }
    
    
              }
    
              function appendAirQuality() {
                const aqiStatus = document.getElementById('ldl-aqi-status');
                const aqiIndex = document.getElementById('ldl-aqi-index');
                const aqiPrimaryPollutant = document.getElementById('ldl-aqi-primarypollutant');
    
                aqiStatus.style.color = `#${latestData.aqi.globalairquality.airQualityCategoryIndexColor}`
                aqiStatus.innerHTML = latestData.aqi.globalairquality.airQualityCategory
                aqiIndex.innerHTML = latestData.aqi.globalairquality.airQualityCategoryIndex
                aqiPrimaryPollutant.innerHTML = latestData.aqi.globalairquality.primaryPollutant
              }
        
            appendCurrent()
            appendForecast()
            appendAirQuality()
            
            } else {
              console.warn(`No valid current data found for ${locationName}`);
              ldlLocationIndex++;
              processnextLDLLocation();
            }
          } else {
            console.warn(`No data found for ${locationName}`);
            ldlLocationIndex++;
            processnextLDLLocation();
          }
        } else {
          setTimeout(() => {
            ldlLocationIndex = 0;
            processnextLDLLocation();
          }, 1);
        }
      }
  
      setTimeout(processnextLDLLocation, 500)
      
    } catch (error) {
      console.error('erm what the', error);
    }
  }
  
function showLocationLabel() {
    locationLabel.style.display = 'block';
    locationLabel.style.animation = 'slideIn 1s ease-out';
}

function hideLocationLabel() {
    locationLabel.style.animation = 'slideOut 1s ease-out';

    setTimeout(() => {
        locationLabel.style.display = 'none';
        document.getElementsByClassName('loading-screen')
    }, 300);
}

function runCurrentSlide() {
    const module1 = document.getElementById('ldl-current-module1');
    const module2 = document.getElementById('ldl-current-module2');

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

    slideElement.style.animation = 'slideOut 1s ease-out';

    setTimeout(() => {
        slideElement.style.display = 'none';

    }, 200);

}

function showLDLSlide() {
    
    const slide = ldlPresentationSlides[ldlSlideIndex]
    const duration = slide.durationMS;

    if (config.verboseLogging === true) {
      console.log(`Showing LDL slides: ${slide.htmlID} for a duration of ${duration}`)             
    }
    
    const slideElement = document.getElementById(slide.htmlID)
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

function nextLDLLocation() {
    ldlLocationIndex = (ldlLocationIndex + 1) % locationsList.locationIndex.locations.length;

    showLocationLabel();

    runProgressBar()

    ldlSlideIndex = 0;

    LDLData();

    showLDLSlide();
}

function runProgressBar() {
  const progressBar = document.getElementById('ldl-location-progressbar')

  progressBar.style.animation = `ldlProgressBar ${totalDurationSec}s linear`
  progressBar.offsetHeight
  progressBar.style.display = `block`

  setTimeout(() => {
    progressBar.style.display = `none`
    progressBar.style.animation = ``
  }, totalDuration);
}

export function runInitialLDL() {
  //runProgressBar()
  //LDLData()
  //showLDLSlide()

  if (config.verboseLogging === true) {
    console.log("Total Duration (ms):", totalDuration);
    console.log("Total Duration (sec):", totalDurationSec);             
  }
}
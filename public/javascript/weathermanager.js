// This parses the weather information from the weather API and appends them to each of the divs.
// It also parses the radar images from Environment Canada's datamart that was parsed by the Node.js server.
// If the loading splash is stuck on, then that means that the weather parse has failed.

//***YOU WILL NEED TO COMMENT OUT OR CHANGE SOME PRODUCTS DEPENDING ON YOUR WEATHER API SUBSCRIPTION***

const locations = [
  { code: 's0000797', province: 'SK', language: 'e', name:'Saskatoon, SK' },
  { code: 's0000624', province: 'SK', language: 'e', name:'Prince Albert, SK' },
  { code: 's0000788', province: 'SK', language: 'e', name:'Regina, SK' },
  { code: 's0000510', province: 'AB', language: 'e', name:'Edmonton, AB Int. Airprt' },
  { code: 's0000047', province: 'AB', language: 'e', name:'Calgary, AB' },
  { code: 's0000141', province: 'BC', language: 'e', name:'Vancouver, BC' },
  // Add more location objects as needed
];
let currentLocationIndex = 0; // Start with the first location
const currentDiv = document.getElementById('current');
const almanacDiv = document.getElementById('almanac');
const forecastDiv = document.getElementById('forecast');
const forecast2Div = document.getElementById('forecast2');
const forecast3Div = document.getElementById('forecast3');
//const aqiDiv = document.getElementById('aqi');
const daypartDiv = document.getElementById('daypart')
const upNextDiv = document.getElementById('upNext');
const loadingDiv = document.getElementById('loading');
//const daypartDiv2 = document.getElementById('daypart2');

if (!currentDiv) {
console.error('Could not find weather div element');
}

// Function to fetch weather data for a specific location
function fetchWeatherData(location) {
  const { province, code, language } = location;
  const url = `http://localhost:3000/api/eccc/${province}/${code}/${language}`;  
return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
    throw error;
  });
}

function updateWeatherData(location) {
 // loadingDiv.style.display = 'block'; // Show loading screen
  return fetchWeatherData(location)
    .then(data => {
    console.log('Received weather data:', data);

    // current conditions slide
    const currentTitle = document.getElementById("current-title-container");
    const currentIconContainer = document.getElementById("current-icon-container");
    const currentContainer2 = document.getElementById("current-2-container");
    const current1Textbox = document.getElementById("current-1-textbox");
    const iconRelativeUrl = `//developer.valvesoftware.com/w/images/8/8b/Debugempty.png`
    const iconUrl = `https:${iconRelativeUrl}`;
    const iconImage = document.createElement("img");
    iconImage.src = iconUrl;
    const conditionDiv = document.createElement("div");
    const temperatureDiv = document.createElement("h1");
    const feelslikeDiv = document.createElement("div");
    const currentWind = document.createElement("h1");
    const currentPressure = document.createElement("h1");
    const currentHumidity = document.createElement("h1");
    const currentTendancy = document.createElement("h1");
    const currentVisibility = document.createElement("h1");
    const currentUV = document.createElement("h1");
    const currentDewpoint = document.createElement("h1");
    
    current1Textbox.innerHTML = ``;
    currentIconContainer.innerHTML = ``;
    currentContainer2.innerHTML = ``;

    currentTitle.textContent = `Conditions at ${data.siteData.location[0].name[0]._}`;
    currentIconContainer.appendChild(iconImage);
    conditionDiv.textContent = `${data.siteData.currentConditions[0].condition[0]}`;
    temperatureDiv.textContent = `${data.siteData.currentConditions[0].temperature[0]._}°C`;
    feelslikeDiv.textContent = ` `;
    currentWind.textContent = `Wind: ${data.siteData.currentConditions[0].wind[0].direction[0]} ${data.siteData.currentConditions[0].wind[0].speed[0]._} km/h.`;
    currentPressure.textContent = `Pressure: ${data.siteData.currentConditions[0].pressure[0]._}kPa`;
    currentHumidity.textContent = `Humidity: ${data.siteData.currentConditions[0].relativeHumidity[0]._}%`;
    currentTendancy.textContent =  `Tendancy: ${data.siteData.currentConditions[0].pressure[0].$.tendency}`;
    currentVisibility.textContent = `Visibility: ${data.siteData.currentConditions[0].visibility[0]._}KM`;;
    currentDewpoint.textContent = `Dewpoint: ${data.siteData.currentConditions[0].dewpoint[0]._}°C`;
    //currentUV.textContent = `UV Index: ${data.current.uv}`;
    current1Textbox.appendChild(conditionDiv);
    current1Textbox.appendChild(temperatureDiv);
    current1Textbox.appendChild(feelslikeDiv);
    current1Textbox.appendChild(currentWind);
    currentContainer2.appendChild(currentPressure);
    currentContainer2.appendChild(currentTendancy);
    currentContainer2.appendChild(currentHumidity);
    currentContainer2.appendChild(currentVisibility);
    currentContainer2.appendChild(currentUV);
    currentContainer2.appendChild(currentDewpoint)

    //almanac slide
    const almanacTitle = document.getElementById("almanac-title-container")
    const almanacMainText = document.getElementById("the-stupid-thing-that-tells-you-about-the-sun")
    const sunrise1 = document.createElement("h1");
    const sunset1 = document.createElement("h1");
    const pop = document.createElement("h1");
    const normalhigh = document.createElement("h1");
    const normallow = document.createElement("h1");

    almanacMainText.innerHTML = ``;
    
    almanacTitle.textContent = `Almanac for the ${data.siteData.location[0].name[0]._} region`;
    sunrise1.textContent = `SUNRISE: ${data.siteData.riseSet[0].dateTime[1].hour[0]}:${data.siteData.riseSet[0].dateTime[1].minute[0]} ${data.siteData.riseSet[0].dateTime[1].$.zone}`;
    sunset1.textContent = `SUNSET: ${data.siteData.riseSet[0].dateTime[3].hour[0]}:${data.siteData.riseSet[0].dateTime[3].minute[0]} ${data.siteData.riseSet[0].dateTime[3].$.zone}`;
    pop.textContent = `Monthly frequency of precipitation... ${data.siteData.almanac[0].pop[0]._}%`
    normalhigh.textContent = `NORMAL HIGH: ${data.siteData.almanac[0].temperature[2]._}°C`
    normallow.textContent = `NORMAL LOW: ${data.siteData.almanac[0].temperature[3]._}°C`

    almanacMainText.appendChild(sunrise1);
    almanacMainText.appendChild(sunset1);
    almanacMainText.appendChild(pop);
    almanacMainText.appendChild(normalhigh);
    almanacMainText.appendChild(normallow);

    //forecast slide
    const forecastTitle = document.getElementById("forecast-cityname")
    const forecastTopbarDay = document.getElementById("forecast-dayname")
    const forecastTopbarCondition = document.getElementById("forecast-conditionname")
    const forecastTopbarPoP = document.getElementById("forecast-pop-value")
    const forecastTopbarWind = document.getElementById("forecast-wind-value")
    const forecastA = document.getElementById("forecastA")

    forecastTitle.innerHTML = ``
    forecastTopbarDay.innerHTML = ``
    forecastTopbarCondition.innerHTML = ``
    forecastTopbarPoP.innerHTML = ``
    forecastTopbarWind.innerHTML = ``

    forecastTitle.textContent = `LOCAL FORECAST FOR ${data.siteData.location[0].name[0]._}`;
    forecastTopbarDay.textContent = `${data.siteData.forecastGroup[0].forecast[0].period[0].$.textForecastName}`
    forecastTopbarCondition.textContent = `${data.siteData.forecastGroup[0].forecast[0].abbreviatedForecast[0].textSummary[0]}`
    forecastTopbarPoP.textContent = `${data.siteData.forecastGroup[0].forecast[0].abbreviatedForecast[0].pop[0]._}%`
    forecastTopbarWind.textContent = `${data.siteData.forecastGroup[0].forecast[0].winds[0].wind[0].direction[0]}, ${data.siteData.forecastGroup[0].forecast[0].winds[0].wind[0].speed[0]._}km/h`
    forecastA.textContent = `${data.siteData.forecastGroup[0].forecast[0].textSummary[0]}`;

    //forecast slide (2/3)

    const forecastTitle2 = document.getElementById("forecast2-cityname")
    const forecastTopbarDay2 = document.getElementById("forecast2-dayname")
    const forecastTopbarCondition2 = document.getElementById("forecast2-conditionname")
    const forecastTopbarPoP2 = document.getElementById("forecast2-pop-value")
    const forecastTopbarWind2 = document.getElementById("forecast2-wind-value")
    const forecastB = document.getElementById("forecastB")

    forecastTitle2.innerHTML = ``
    forecastTopbarDay2.innerHTML = ``
    forecastTopbarCondition2.innerHTML = ``
    forecastTopbarPoP2.innerHTML = ``
    forecastTopbarWind2.innerHTML = ``

    forecastTitle2.textContent = `LOCAL FORECAST FOR ${data.siteData.location[0].name[0]._}`;
    forecastTopbarDay2.textContent = `${data.siteData.forecastGroup[0].forecast[1].period[0].$.textForecastName}`
    forecastTopbarCondition2.textContent = `${data.siteData.forecastGroup[0].forecast[1].abbreviatedForecast[0].textSummary[0]}`
    forecastTopbarPoP2.textContent = `${data.siteData.forecastGroup[0].forecast[1].abbreviatedForecast[0].pop[0]._}%`
    forecastTopbarWind2.textContent = `${data.siteData.forecastGroup[0].forecast[1].winds[0].wind[0].direction[0]}, ${data.siteData.forecastGroup[0].forecast[0].winds[0].wind[0].speed[0]._}km/h`
    forecastB.textContent = `${data.siteData.forecastGroup[0].forecast[1].textSummary[0]}`;

    //forecast slide (3/3)
    const forecastTitle3 = document.getElementById("forecast3-cityname")
    const forecastTopbarDay3 = document.getElementById("forecast3-dayname")
    const forecastTopbarCondition3 = document.getElementById("forecast3-conditionname")
    const forecastTopbarPoP3 = document.getElementById("forecast3-pop-value")
    const forecastTopbarWind3 = document.getElementById("forecast3-wind-value")
    const forecastC = document.getElementById("forecastC")

    forecastTitle3.innerHTML = ``
    forecastTopbarDay3.innerHTML = ``
    forecastTopbarCondition3.innerHTML = ``
    forecastTopbarPoP3.innerHTML = ``
    forecastTopbarWind3.innerHTML = ``

    forecastTitle3.textContent = `LOCAL FORECAST FOR ${data.siteData.location[0].name[0]._}`;
    forecastTopbarDay3.textContent = `${data.siteData.forecastGroup[0].forecast[2].period[0].$.textForecastName}`
    forecastTopbarCondition3.textContent = `${data.siteData.forecastGroup[0].forecast[2].abbreviatedForecast[0].textSummary[0]}`
    forecastTopbarPoP3.textContent = `${data.siteData.forecastGroup[0].forecast[2].abbreviatedForecast[0].pop[0]._}%`
    forecastTopbarWind3.textContent = `${data.siteData.forecastGroup[0].forecast[2].winds[0].wind[0].direction[0]}, ${data.siteData.forecastGroup[0].forecast[0].winds[0].wind[0].speed[0]._}km/h`
    forecastC.textContent = `${data.siteData.forecastGroup[0].forecast[2].textSummary[0]}`;

    //daypart slide

    daypartDiv.innerHTML = ``;

    const dayparttitle = document.createElement("h3")
    dayparttitle.textContent = `DAYPART FORECAST FOR ${data.siteData.location[0].name[0]._}`
    daypartDiv.appendChild(dayparttitle)

    const hour0 = document.createElement("h1")
    hour0.textContent = `${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].$.dateTimeUTC} UTC... ${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].condition[0]}... 
    TEMP ${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].temperature[0]._}°C... WINDS ${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].wind[0].direction[0].$.windDirFull}, 
    ${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].wind[0].speed[0]._} KM/H... CHANCE OF PRECIPITATION ${data.siteData.hourlyForecastGroup[0].hourlyForecast[0].lop[0]._}%.`
    daypartDiv.appendChild(hour0)

    const hour1 = document.createElement("h1")
    hour1.textContent = `${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].$.dateTimeUTC} UTC... ${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].condition[0]}... 
    TEMP ${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].temperature[0]._}°C... WINDS ${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].wind[0].direction[0].$.windDirFull}, 
    ${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].wind[0].speed[0]._} KM/H... CHANCE OF PRECIPITATION ${data.siteData.hourlyForecastGroup[0].hourlyForecast[2].lop[0]._}%.`
    daypartDiv.appendChild(hour1)

    const hour2 = document.createElement("h1")
    hour2.textContent = `${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].$.dateTimeUTC} UTC... ${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].condition[0]}... 
    TEMP ${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].temperature[0]._}°C... WINDS ${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].wind[0].direction[0].$.windDirFull}, 
    ${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].wind[0].speed[0]._} KM/H... CHANCE OF PRECIPITATION ${data.siteData.hourlyForecastGroup[0].hourlyForecast[4].lop[0]._}%.`
    daypartDiv.appendChild(hour2)

    const hour3 = document.createElement("h1")
    hour3.textContent = `${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].$.dateTimeUTC} UTC... ${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].condition[0]}... 
    TEMP ${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].temperature[0]._}°C... WINDS ${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].wind[0].direction[0].$.windDirFull}, 
    ${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].wind[0].speed[0]._} KM/H... CHANCE OF PRECIPITATION ${data.siteData.hourlyForecastGroup[0].hourlyForecast[6].lop[0]._}%.`
    daypartDiv.appendChild(hour3)

    //radar slide
          function fetchRadarImage() {
        fetch('http://localhost:3000/api/eccc/radar')
          .then((response) => response.json())
          .then((data) => {
            // Assuming the JSON data has an 'imageUrl' property with the image URL
            const imageUrl = data[5].imageUrl; // Replace 'imageUrl' with the actual property name from your JSON data
      
            // Create an img element and set its src attribute to the image URL
            const radar = document.createElement("img");
            radar.classList.add('radar'); // Add a CSS class to the image
            radar.src = imageUrl;
      
            // Append the image element to the desired container in your HTML
            const radarDiv = document.getElementById('radarDiv'); // Replace 'daypartDiv2' with the ID of the container where you want to display the image
            radarDiv.innerHTML = ''; // Clear the container before appending the new image to avoid duplicate images
            radarDiv.appendChild(radar);
          })
          .catch((error) => {
            console.error('Error fetching JSON data:', error);
          });
      }
      // Fetch radar image initially
      fetchRadarImage();
      
      // Fetch radar image every 5 minutes (300,000 milliseconds)
      setInterval(fetchRadarImage, 300000);

      // Return the next location for the "Up Next" text
      const nextLocationIndex = (currentLocationIndex + 1) % locations.length;
            return locations[nextLocationIndex].name;
          });
}

function rotateLocations() {
  const location = locations[currentLocationIndex];
  updateWeatherData(location)
    .then(nextLocation => {
      // Update "Up Next" text
      upNextDiv.textContent = `Up Next: ${nextLocation}`;

      // Increment the location index for the next rotation
      currentLocationIndex = (currentLocationIndex + 1) % locations.length;
    });
}

// Fetch weather data initially
rotateLocations();

// Rotate locations every 10 minutes (600,000 milliseconds)
setInterval(rotateLocations, 600000);
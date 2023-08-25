// This parses the weather information from the weather API and appends them to each of the divs.
// It also parses the radar images from Environment Canada's datamart that was parsed by the Node.js server.
// If the loading splash is stuck on, then that means that the weather parse has failed.

//***YOU WILL NEED TO COMMENT OUT OR CHANGE SOME PRODUCTS DEPENDING ON YOUR WEATHER API SUBSCRIPTION***

const locations = ['Saskatoon_SK', 'Regina_SK', 'Prince_Albert_SK','Calgary_AB','Edmonton_AB','Vancouver_BC']; // Add more locations as needed
let currentLocationIndex = 0; // Start with the first location
const weatherDiv = document.getElementById('weather');
const almanacDiv = document.getElementById('almanac');
const forecastDiv = document.getElementById('forecast');
const forecast2Div = document.getElementById('forecast2');
const aqiDiv = document.getElementById('aqi');
const daypartDiv = document.getElementById('daypart')
const upNextDiv = document.getElementById('upNext');
//const loadingDiv = document.getElementById('loading');
const daypartDiv2 = document.getElementById('daypart2');

function isSummer() {
    const now = new Date();
    const summerStart = new Date(now.getFullYear(), 5, 1); // June 1st
    const summerEnd = new Date(now.getFullYear(), 8, 1); // September 1st
  
    return now >= summerStart && now < summerEnd;
  }

if (!weatherDiv) {
  console.error('Could not find weather div element');
}

function fetchWeatherData(location) {
  const url = `api/forecast/${location}/`; // Add weather API here
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
    // Clear previous weather data
    weatherDiv.innerHTML = '';
    almanacDiv.innerHTML = '';
    forecastDiv.innerHTML = '';
    forecast2Div.innerHTML = '';
    aqiDiv.innerHTML = '';
    daypartDiv.innerHTML = '';
    daypartDiv2.innerHTML = '';

    // current conditions slide
    const cityName = document.createElement("h3");
    cityName.textContent = `Conditions at ${data.location.name}`;
    weatherDiv.appendChild(cityName);

    const condition = document.createElement("h1");
    condition.textContent = `${data.current.condition.text}`;
    weatherDiv.appendChild(condition);

    const temperature = document.createElement("h1");
    temperature.textContent = `Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F`;
    weatherDiv.appendChild(temperature);

    const feelslike = document.createElement("h1")
    feelslike.textContent = `i think it feels like ${data.current.feelslike_c}°C`;
    weatherDiv.appendChild(feelslike)

    const wind = document.createElement("h1");
    wind.textContent = `Wind: ${data.current.wind_kph} km/h / ${data.current.wind_kph} kph, ${data.current.wind_dir}`;
    weatherDiv.appendChild(wind);

    const pressure = document.createElement("h1");
    pressure.textContent = `Pressure: ${data.current.pressure_mb} mb / ${data.current.pressure_in} in`;
    weatherDiv.appendChild(pressure);

    const humidity = document.createElement("h1");
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    weatherDiv.appendChild(humidity);

    const visibility = document.createElement("h1");
    humidity.textContent = `Visibility: ${data.current.vis_km}KM`;
    weatherDiv.appendChild(visibility);
  
    const uv = document.createElement("h1");
    uv.textContent = `UV Index: ${data.current.uv}`;
    weatherDiv.appendChild(uv);
    
    //almanac slide
    const almanactitle = document.createElement("h3");
    almanactitle.textContent = `Almanac for ${data.location.name} area`;
    almanacDiv.appendChild(almanactitle);

    const sunrise1 = document.createElement("h1");
    sunrise1.textContent = `Sunrise Today: ${data.forecast.forecastday[0].astro.sunrise}`;
    almanacDiv.appendChild(sunrise1);

    const sunset1 = document.createElement("h1");
    sunset1.textContent = `Sunset Today: ${data.forecast.forecastday[0].astro.sunset}`;
    almanacDiv.appendChild(sunset1);

    const moon1 = document.createElement("h1");
    moon1.textContent = `Moon Phase: ${data.forecast.forecastday[0].astro.moon_phase}`;
    almanacDiv.appendChild(moon1);

    const sunrise2 = document.createElement("h1");
    sunrise2.textContent = `Sunset Tomorrow ${data.forecast.forecastday[1].astro.sunrise}`;
    almanacDiv.appendChild(sunrise2);

    const sunset2 = document.createElement("h1");
    sunset2.textContent = `Sunset Tommorow: ${data.forecast.forecastday[1].astro.sunset}`;
    almanacDiv.appendChild(sunset2);
      
    const moon2 = document.createElement("h1");
    moon2.textContent = `Tommorow's Moonphase: ${data.forecast.forecastday[2].astro.moon_phase}`;
    almanacDiv.appendChild(moon2);

    //forecast slide
    const forecasttitle = document.createElement("h3");
    forecasttitle.textContent = `Extended Outlook for ${data.location.name}`;
    forecastDiv.appendChild(forecasttitle);

    const day0 = document.createElement("h1");
    day0.textContent = `Today... ${data.forecast.forecastday[0].day.condition.text}. With a high of ${data.forecast.forecastday[0].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day0);

    const day0a = document.createElement("h1");
    day0a.textContent = `Winds up to... ${data.forecast.forecastday[0].day.maxwind_kph}KM/H. The UV index will be ${data.forecast.forecastday[0].day.uv}.`;
    forecastDiv.appendChild(day0a);

    const day0b = document.createElement("h1");
    day0b.textContent = `Lows ${data.forecast.forecastday[0].day.mintemp_c}°C.`;
    forecastDiv.appendChild(day0b);

    const day1 = document.createElement("h1");
    day1.textContent = `Tomorrow... ${data.forecast.forecastday[1].day.condition.text}. With a high of ${data.forecast.forecastday[1].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day1);

    const day1a = document.createElement("h1");
    day1a.textContent = `Winds up to... ${data.forecast.forecastday[1].day.maxwind_kph}KM/H. The UV index will be ${data.forecast.forecastday[1].day.uv}.`;
    forecastDiv.appendChild(day1a);

    const day2 = document.createElement("h1");
    day2.textContent = `Day two... ${data.forecast.forecastday[2].day.condition.text}. With a high of ${data.forecast.forecastday[2].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day2);

    const day3 = document.createElement("h1");
    day3.textContent = `Day three... ${data.forecast.forecastday[3].day.condition.text}. With a high of ${data.forecast.forecastday[3].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day3);

    //forecast slide (continued)
    const forecast2title = document.createElement("h3");
    forecast2title.textContent = `Extended Outlook (Continued)`;
    forecast2Div.appendChild(forecast2title);

    const day4 = document.createElement("h1");
    day4.textContent = `Day four... ${data.forecast.forecastday[4].day.condition.text}. With a high of ${data.forecast.forecastday[4].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day4);

    const day4a = document.createElement("h1");
    day4a.textContent = `Lows ${data.forecast.forecastday[4].day.mintemp_c}°C.`;
    forecast2Div.appendChild(day4a);

    const day5 = document.createElement("h1");
    day5.textContent = `Day five... ${data.forecast.forecastday[5].day.condition.text}. With a high of ${data.forecast.forecastday[5].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day5);
    
    const day5a = document.createElement("h1");
    day5a.textContent = `Lows ${data.forecast.forecastday[5].day.mintemp_c}°C.`;
    forecast2Div.appendChild(day5a);

    const day6 = document.createElement("h1");
    day6.textContent = `Day six... ${data.forecast.forecastday[6].day.condition.text}. With a high of ${data.forecast.forecastday[6].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day6);

    const day6a = document.createElement("h1");
    day6a.textContent = `Lows ${data.forecast.forecastday[6].day.mintemp_c}°C.`;
    forecast2Div.appendChild(day6a);

    //air quality slide
    const aqititle = document.createElement("h3")
    aqititle.textContent = `Air Quality for ${data.location.name}`
    aqiDiv.appendChild(aqititle)

    const pm25 = document.createElement("h1")
    pm25.textContent = `PM 2.5 (Particulate Matter Less Than 10 Microns): ${data.current.air_quality.pm2_5}`
    aqiDiv.appendChild(pm25)

    const pm10 = document.createElement("h1")
    pm10.textContent = `PM 2.5 (Particulate Matter Less Than 10 Microns): ${data.current.air_quality.pm10}`
    aqiDiv.appendChild(pm10)

    const co = document.createElement("h1")
    co.textContent = `Carbon Monoxide: ${data.current.air_quality.co}`
    aqiDiv.appendChild(co)

    const no2 = document.createElement("h1")
    no2.textContent = `Nitrogen Dioxide: ${data.current.air_quality.no2}`
    aqiDiv.appendChild(no2)

    const so2 = document.createElement("h1")
    so2.textContent = `Nitrogen Dioxide: ${data.current.air_quality.so2}`
    aqiDiv.appendChild(so2)
    
    //daypart slide
    const dayparttitle = document.createElement("h3")
    dayparttitle.textContent = `Daypart Forecast for ${data.location.name}`
    daypartDiv.appendChild(dayparttitle)

    const MORNING = document.createElement("h1")
    MORNING.textContent = `This morning at 6 AM... ${data.forecast.forecastday[0].hour[6].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[6].temp_c}°C or ${data.forecast.forecastday[0].hour[6].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[6].wind_dir} @ ${data.forecast.forecastday[0].hour[6].wind_kph}KM/H.`
    daypartDiv.appendChild(MORNING)

    const lateMORNING = document.createElement("h1")
    lateMORNING.textContent = `Later this morning at 9 AM... ${data.forecast.forecastday[0].hour[9].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[9].temp_c}°C or ${data.forecast.forecastday[0].hour[9].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[9].wind_dir} at ${data.forecast.forecastday[0].hour[9].wind_kph}KM/H.`
    daypartDiv.appendChild(lateMORNING)

    const noon = document.createElement("h1")
    noon.textContent = `At noon... ${data.forecast.forecastday[0].hour[12].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[12].temp_c}°C or ${data.forecast.forecastday[0].hour[12].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[12].wind_dir} at ${data.forecast.forecastday[0].hour[12].wind_kph}KM/H.`
    daypartDiv.appendChild(noon)

    //daypart slide (continued)
    const daypart2title = document.createElement("h3")
    daypart2title.textContent = `Daypart Forecast (CONTINUED)`
    daypartDiv2.appendChild(daypart2title)

    const afternoon = document.createElement("h1")
    afternoon.textContent = `In the afternoon at 3 PM... ${data.forecast.forecastday[0].hour[15].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[15].temp_c}°C or ${data.forecast.forecastday[0].hour[15].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[15].wind_dir} at ${data.forecast.forecastday[0].hour[15].wind_kph}KM/H.`
    daypartDiv2.appendChild(afternoon)

    const evening = document.createElement("h1")
    afternoon.textContent = `In the evening AT 7 PM... ${data.forecast.forecastday[0].hour[19].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[19].temp_c}°C or ${data.forecast.forecastday[0].hour[19].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[19].wind_dir} @ ${data.forecast.forecastday[0].hour[19].wind_kph}KM/H.`
    daypartDiv2.appendChild(evening)

    const night = document.createElement("h1")
    night.textContent = `At 10 PM tonight... ${data.forecast.forecastday[0].hour[22].condition.text}.
    The temperature will be ${data.forecast.forecastday[0].hour[22].temp_c}°C or ${data.forecast.forecastday[0].hour[22].temp_f}°F.
    Winds... ${data.forecast.forecastday[0].hour[22].wind_dir} @ ${data.forecast.forecastday[0].hour[22].wind_kph}KM/H. Overnight lows are expected to be ${data.forecast.forecastday[0].day.mintemp_c}°C.`
    daypartDiv2.appendChild(night)

    const lastupdate = document.createElement("p")
    lastupdate.textContent = `INFORMATION LAST UPDATED: ${data.current.last_updated} (if this is old then there is probably something wrong)`
    daypartDiv2.appendChild(lastupdate)

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

          //  loadingDiv.style.display = 'none'; // Hide loading screen

      // Return the next location for the "Up Next" text
      const nextLocationIndex = (currentLocationIndex + 1) % locations.length;
            return locations[nextLocationIndex];
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

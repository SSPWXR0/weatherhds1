// This parses the weather information from the weather API and appends them to each of the divs.
// It also parses the radar images from Environment Canada's datamart that was parsed by the Node.js server.
// If the loading splash is stuck on, then that means that the weather parse has failed.

const locations = ['Saskatoon_SK', 'Regina_SK', 'Prince_Albert_SK','Calgary_AB','Edmonton_AB','Vancouver_BC']; // Add more locations as needed
let currentLocationIndex = 0; // Start with the first location
const weatherDiv = document.getElementById('weather');
const almanacDiv = document.getElementById('almanac');
const forecastDiv = document.getElementById('forecast');
const forecast2Div = document.getElementById('forecast2');
const aqiDiv = document.getElementById('aqi');
const daypartDiv = document.getElementById('daypart')
const upNextDiv = document.getElementById('upNext');
const loadingDiv = document.getElementById('loading');
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
  const url = `https://api.examplething:6969/forecast/${location}/`; // Add weather API here
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
  loadingDiv.style.display = 'block'; // Show loading screen
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
    cityName.textContent = `CONDITIONS AT ${data.location.name}`;
    weatherDiv.appendChild(cityName);

    const condition = document.createElement("h1");
    condition.textContent = `${data.current.condition.text}`;
    weatherDiv.appendChild(condition);

    const temperature = document.createElement("h1");
    temperature.textContent = `TEMPERATURE: ${data.current.temp_c}°C / ${data.current.temp_f}°F`;
    weatherDiv.appendChild(temperature);

    const feelslike = document.createElement("h1")
    feelslike.textContent = `i think it feels like ${data.current.feelslike_c}°C`;
    weatherDiv.appendChild(feelslike)

    const wind = document.createElement("h1");
    wind.textContent = `WIND: ${data.current.wind_kph} km/h / ${data.current.wind_kph} kph, ${data.current.wind_dir}`;
    weatherDiv.appendChild(wind);

    const pressure = document.createElement("h1");
    pressure.textContent = `PRESSURE: ${data.current.pressure_mb} mb / ${data.current.pressure_in} in`;
    weatherDiv.appendChild(pressure);

    const humidity = document.createElement("h1");
    humidity.textContent = `HUMIDITY: ${data.current.humidity}%`;
    weatherDiv.appendChild(humidity);

    const visibility = document.createElement("h1");
    humidity.textContent = `VISIBILITY: ${data.current.vis_km}KM`;
    weatherDiv.appendChild(visibility);
  
    const uv = document.createElement("h1");
    uv.textContent = `UV INDEX: ${data.current.uv}`;
    weatherDiv.appendChild(uv);
    
    //almanac slide
    const almanactitle = document.createElement("h3");
    almanactitle.textContent = `ALMANAC FOR ${data.location.name} AREA`;
    almanacDiv.appendChild(almanactitle);

    const sunrise1 = document.createElement("h1");
    sunrise1.textContent = `SUNRISE TODAY: ${data.forecast.forecastday[0].astro.sunrise}`;
    almanacDiv.appendChild(sunrise1);

    const sunset1 = document.createElement("h1");
    sunset1.textContent = `SUNSET TODAY: ${data.forecast.forecastday[0].astro.sunset}`;
    almanacDiv.appendChild(sunset1);

    const moon1 = document.createElement("h1");
    moon1.textContent = `MOON PHASE: ${data.forecast.forecastday[0].astro.moon_phase}`;
    almanacDiv.appendChild(moon1);

    const sunrise2 = document.createElement("h1");
    sunrise2.textContent = `SUNRISE TOMORROW: ${data.forecast.forecastday[1].astro.sunrise}`;
    almanacDiv.appendChild(sunrise2);

    const sunset2 = document.createElement("h1");
    sunset2.textContent = `SUNSET TOMORROW: ${data.forecast.forecastday[1].astro.sunset}`;
    almanacDiv.appendChild(sunset2);
      
    const moon2 = document.createElement("h1");
    moon2.textContent = `MOON PHASE: ${data.forecast.forecastday[2].astro.moon_phase}`;
    almanacDiv.appendChild(moon2);

    //forecast slide
    const forecasttitle = document.createElement("h3");
    forecasttitle.textContent = `EXTENDED OUTLOOK FOR ${data.location.name}`;
    forecastDiv.appendChild(forecasttitle);

    const day0 = document.createElement("h1");
    day0.textContent = `TODAY... ${data.forecast.forecastday[0].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[0].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day0);

    const day1 = document.createElement("h1");
    day1.textContent = `TOMORROW... ${data.forecast.forecastday[1].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[1].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day1);

    const day2 = document.createElement("h1");
    day2.textContent = `DAY TWO... ${data.forecast.forecastday[2].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[2].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day2);

    const day3 = document.createElement("h1");
    day3.textContent = `DAY THREE... ${data.forecast.forecastday[3].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[3].day.maxtemp_c}°C.`;
    forecastDiv.appendChild(day3);

    //forecast slide (continued)
    const forecast2title = document.createElement("h3");
    forecast2title.textContent = `EXTENDED OUTLOOK (CONTINUED)`;
    forecast2Div.appendChild(forecast2title);

    const day4 = document.createElement("h1");
    day4.textContent = `DAY FOUR... ${data.forecast.forecastday[4].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[4].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day4);

    const day5 = document.createElement("h1");
    day5.textContent = `DAY FIVE... ${data.forecast.forecastday[5].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[5].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day5);

    const day6 = document.createElement("h1");
    day6.textContent = `DAY SIX... ${data.forecast.forecastday[6].day.condition.text}. WITH A HIGH OF ${data.forecast.forecastday[6].day.maxtemp_c}°C.`;
    forecast2Div.appendChild(day6);

    //air quality slide
    const aqititle = document.createElement("h3")
    aqititle.textContent = `AIR QUALITY INDEX (U.S. EPA STANDARD)`
    aqiDiv.appendChild(aqititle)

    const epa = document.createElement("h1")
    epa.textContent = `${data.location.name}: CATEGORY ${data.current.air_quality['us-epa-index']}`
    aqiDiv.appendChild(epa)

    const lastupdate = document.createElement("p")
    lastupdate.textContent = `INFORMATION LAST UPDATED: ${data.current.last_updated} (if this is old then there is probably something wrong)`
    aqiDiv.appendChild(lastupdate)

    //daypart slide
    const dayparttitle = document.createElement("h3")
    dayparttitle.textContent = `DAYPART FORECAST FOR ${data.location.name}`
    daypartDiv.appendChild(dayparttitle)

    const MORNING = document.createElement("h1")
    MORNING.textContent = `THIS MORNING AT 6 AM... ${data.forecast.forecastday[0].hour[6].condition.text}.`
    daypartDiv.appendChild(MORNING)

    const MORNINGa = document.createElement("h1")
    MORNINGa.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[6].temp_c}°C OR ${data.forecast.forecastday[0].hour[6].temp_f}°F.`
    daypartDiv.appendChild(MORNINGa)

    const MORNINGb = document.createElement("h1")
    MORNINGb.textContent=`WINDS... ${data.forecast.forecastday[0].hour[6].wind_dir} @ ${data.forecast.forecastday[0].hour[6].wind_kph}KM/H.`
    daypartDiv.appendChild(MORNINGb)

    const daybreak = document.createElement("br")
    daypartDiv.appendChild(daybreak)

    const lateMORNING = document.createElement("h1")
    lateMORNING.textContent = `LATER THIS MORNING AT 9 AM... ${data.forecast.forecastday[0].hour[9].condition.text}.`
    daypartDiv.appendChild(lateMORNING)

    const lateMORNINGa = document.createElement("h1")
    lateMORNINGa.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[9].temp_c}°C OR ${data.forecast.forecastday[0].hour[9].temp_f}°F.`
    daypartDiv.appendChild(lateMORNINGa)

    const lateMORNINGb = document.createElement("h1")
    lateMORNINGb.textContent=`WINDS... ${data.forecast.forecastday[0].hour[9].wind_dir} @ ${data.forecast.forecastday[0].hour[9].wind_kph}KM/H.`
    daypartDiv.appendChild(lateMORNINGb)

    const daybreak2 = document.createElement("br")
    daypartDiv.appendChild(daybreak2)

    const noon = document.createElement("h1")
    noon.textContent = `AT NOON... ${data.forecast.forecastday[0].hour[12].condition.text}.`
    daypartDiv.appendChild(noon)

    const noona = document.createElement("h1")
    noona.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[12].temp_c}°C OR ${data.forecast.forecastday[0].hour[12].temp_f}°F.`
    daypartDiv.appendChild(noona)

    const noonb = document.createElement("h1")
    noonb.textContent=`WINDS... ${data.forecast.forecastday[0].hour[12].wind_dir} @ ${data.forecast.forecastday[0].hour[12].wind_kph}KM/H.`
    daypartDiv.appendChild(noonb)

    //daypart slide (continued)
    const daypart2title = document.createElement("h3")
    daypart2title.textContent = `DAYPART FORECAST (CONTINUED)`
    daypartDiv2.appendChild(daypart2title)

    const afternoon = document.createElement("h1")
    afternoon.textContent = `IN THE AFTERNOON AT 3 PM... ${data.forecast.forecastday[0].hour[15].condition.text}.`
    daypartDiv2.appendChild(afternoon)

    const afternoonA = document.createElement("h1")
    afternoonA.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[15].temp_c}°C OR ${data.forecast.forecastday[0].hour[15].temp_f}°F.`
    daypartDiv2.appendChild(afternoonA)

    const afternoonB = document.createElement("h1")
    afternoonB.textContent=`WINDS... ${data.forecast.forecastday[0].hour[15].wind_dir} @ ${data.forecast.forecastday[0].hour[15].wind_kph}KM/H.`
    daypartDiv2.appendChild(afternoonB)

    const daybreak3 = document.createElement("br")
    daypartDiv2.appendChild(daybreak3)

    const evening = document.createElement("h1")
    afternoon.textContent = `IN THE EVENING AT 7 PM... ${data.forecast.forecastday[0].hour[19].condition.text}.`
    daypartDiv2.appendChild(evening)

    const eveningA = document.createElement("h1")
    afternoonA.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[19].temp_c}°C OR ${data.forecast.forecastday[0].hour[19].temp_f}°F.`
    daypartDiv2.appendChild(eveningA)

    const eveningB = document.createElement("h1")
    afternoonB.textContent=`WINDS... ${data.forecast.forecastday[0].hour[19].wind_dir} @ ${data.forecast.forecastday[0].hour[19].wind_kph}KM/H.`
    daypartDiv2.appendChild(eveningB)

    const daybreak4 = document.createElement("br")
    daypartDiv2.appendChild(daybreak4)

    const night = document.createElement("h1")
    night.textContent = `NIGHT TIME AT 10 PM... ${data.forecast.forecastday[0].hour[22].condition.text}.`
    daypartDiv2.appendChild(night)

    const nightA = document.createElement("h1")
    nightA.textContent = `THE TEMPERATURE WILL BE ${data.forecast.forecastday[0].hour[22].temp_c}°C OR ${data.forecast.forecastday[0].hour[22].temp_f}°F.`
    daypartDiv2.appendChild(nightA)

    const nightB = document.createElement("h1")
    nightB.textContent=`WINDS... ${data.forecast.forecastday[0].hour[22].wind_dir} @ ${data.forecast.forecastday[0].hour[22].wind_kph}KM/H. OVERNIGHT LOWS ARE ${data.forecast.forecastday[0].day.mintemp_c}°C.`
    daypartDiv2.appendChild(nightB)

    const daybreak5 = document.createElement("br")
    daypartDiv2.appendChild(daybreak5)

    //radar slide
          function fetchRadarImage() {
        fetch('http://localhost:3000/api/radar/latest')
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

            loadingDiv.style.display = 'none'; // Hide loading screen

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

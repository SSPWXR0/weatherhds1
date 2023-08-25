const LDLlocations = [
  'Saskatoon_SK',
  'Regina_SK',
  'Swift_Current_SK',
  'Moose_Jaw_SK',
  'Winnipeg_MB',
  'Brandon_MB',
  'Steinbach_MB',
  'Calgary_AB',
  'Edmonton_AB',
  'Red_Deer_AB',
  'Vancouver_BC',
  'Victoria_BC',
  'Kelowna_BC',
  'Surrey_BC',
  'Richmond_BC',
  'Ottawa_ON',
  'Toronto_ON',
  'Mississauga_ON',
  'Brampton_ON',
  'Hamilton_ON',
  'London_ON',
  'Halifax_NS',
  'Saint John_NB',
  'New_York_NY',
];
let LDLLocationIndex = 0; // Start with the first location
const LDLcurrent = document.getElementById('LDL-current');

if (!LDLcurrent) {
  console.error('Could not find weather div element');
}

function fetchLDLData(location) {
  const url = `api/weather/${location}/`; // Add weather API here
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

function updateLDLData(location) {
    return fetchLDLData(location)
      .then(data => {
        console.log('Received (LDL) weather data:', data);
        
        // Get references to the elements you want to update
        const cityName = document.getElementById("LDL-slide-current-title");
        const tempTitle = document.getElementById("LDL-current-title-temp");
        const tempValue = document.getElementById("LDL-current-temp");
        const conditionTitle = document.getElementById("LDL-current-title-condition");
        const conditionValue = document.getElementById("LDL-current-condition");
        const windTitle = document.getElementById("LDL-current-title-wind");
        const windValue = document.getElementById("LDL-current-wind");
        const humidityTitle = document.getElementById("LDL-current-title-humidity");
        const humidityValue = document.getElementById("LDL-current-humidity");
  
        // Update the elements with weather information
        cityName.textContent = `Conditions at ${data.location.name}`;
        tempTitle.textContent = "Temperature";
        tempValue.textContent = `${data.current.temp_c}°C`;
        conditionTitle.textContent = "Condition";
        conditionValue.textContent = data.current.condition.text;
        windTitle.textContent = "Wind";
        windValue.textContent = `${data.current.wind_kph} km/h, ${data.current.wind_dir}`;
        humidityTitle.textContent = "Relative Humidity";
        humidityValue.textContent = `${data.current.humidity}%`;
      });
  }
  

function rotateLDL() {
  const location = LDLlocations[LDLLocationIndex]; // Use LDLlocations instead of locations
  updateLDLData(location)
    .then(() => {
      LDLLocationIndex = (LDLLocationIndex + 1) % LDLlocations.length; // Use LDLlocations.length
    });
}

rotateLDL();

setInterval(rotateLDL, 60000);

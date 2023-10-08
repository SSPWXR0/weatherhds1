const LDLlocations = [
  { code: 's0000797', province: 'SK', language: 'e', name:'Saskatoon, SK' },
  { code: 's0000788', province: 'SK', language: 'e', name:'Regina, SK' },
  { code: 's0000355', province: 'SK', language: 'e', name:'Swift Current, SK' },
  { code: 's0000822', province: 'SK', language: 'e', name:'Moose Jaw, SK' },
  { code: 's0000193', province: 'MB', language: 'e', name:'Winnipeg, MB' },
  { code: 's0000492', province: 'MB', language: 'e', name:'Brandon, MB' },
  { code: 's0000151', province: 'MB', language: 'e', name:'Steinbach, MB' },
  { code: 's0000047', province: 'AB', language: 'e', name:'Calgary, AB' },
  { code: 's0000045', province: 'AB', language: 'e', name:'Edmonton, AB' },
  { code: 's0000645', province: 'AB', language: 'e', name:'Red Deer, AB' },
  { code: 's0000141', province: 'BC', language: 'e', name:'Vancouver, BC' },
  { code: 's0000775', province: 'BC', language: 'e', name:'Victoria, BC' },
  { code: 's0000592', province: 'BC', language: 'e', name:'Kelowna, BC' },
  { code: 's0000862', province: 'BC', language: 'e', name:'Richmond, BC' },
  { code: 's0000430', province: 'ON', language: 'e', name:'Ottawa, ON' },
  { code: 's0000458', province: 'ON', language: 'e', name:'Toronto, ON' },
  { code: 's0000786', province: 'ON', language: 'e', name:'Mississauga, ON' },
  { code: 's0000658', province: 'ON', language: 'e', name:'Brampton, ON' },
  { code: 's0000549', province: 'ON', language: 'e', name:'Hamilton, ON' },
  { code: 's0000326', province: 'ON', language: 'e', name:'London, ON' },
  { code: 's0000318', province: 'NS', language: 'e', name:'Halifax, NS' },
  { code: 's0000687', province: 'NB', language: 'e', name:'Saint John, NB' },
];
let LDLLocationIndex = 0;
const LDLcurrent = document.getElementById('LDL-current');

if (!LDLcurrent) {
  console.error('Could not find weather div element');
}

function fetchLDLData(location) {
  const { province, code, language } = location;
  const url = `http://localhost:3000/api/eccc/${province}/${code}/${language}`; // api
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
        
        const cityName = document.getElementById("LDL-slide-current-title");
        const tempTitle = document.getElementById("LDL-current-title-temp");
        const tempValue = document.getElementById("LDL-current-temp");
        const conditionTitle = document.getElementById("LDL-current-title-condition");
        const conditionValue = document.getElementById("LDL-current-condition");
        const windTitle = document.getElementById("LDL-current-title-wind");
        const windValue = document.getElementById("LDL-current-wind");
        const humidityTitle = document.getElementById("LDL-current-title-humidity");
        const humidityValue = document.getElementById("LDL-current-humidity");

        cityName.textContent = `Weather conditions at ${data.siteData.location[0].name[0]._}`;
        tempTitle.textContent = "Temperature";
        tempValue.textContent = `${data.siteData.currentConditions[0].temperature[0]._}°C`;
        conditionTitle.textContent = "Condition";
        conditionValue.textContent = `${data.siteData.currentConditions[0].condition[0]}`;
        windTitle.textContent = "Wind";
        windValue.textContent = `${data.siteData.currentConditions[0].wind[0].direction[0]}, ${data.siteData.currentConditions[0].wind[0].speed[0]._} km/h`;
        humidityTitle.textContent = "Relative Humidity";
        humidityValue.textContent = `${data.siteData.currentConditions[0].relativeHumidity[0]._}%`;
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

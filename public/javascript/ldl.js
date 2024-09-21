const ldlText = document.getElementById('ldl-weather-text');

async function LDLData() {
  try {

    let data;
    let config;

    async function fetchData() {
      const [response, configResponse] = await Promise.all([
        fetch('./ldlData.json'),
        fetch('./config.json')
      ]);
  
      data = await response.json();
      config = await configResponse.json();
    }

    fetchData()
    setInterval(fetchData, 10000)

    let locationIndex = 0;

    function processNextLocation() {
      if (locationIndex < config.ldlLocations.length) {
        const locationName = config.ldlLocations[locationIndex];
        const locationData = data[locationName];

        if (locationData) {
          const latestKey = Object.keys(locationData)
            .map(Number)
            .sort((a, b) => b - a)[0];

          const latestData = locationData[latestKey];

        if (latestData && latestData.current) {
          const currentData =latestData.current;
          const locationText = `Conditions at ${locationName}`;
          const weatherText = `
${currentData.wxPhraseLong}
Temp: ${currentData.temperature}°C
Humidity: ${currentData.relativeHumidity}% Dewpoint: ${currentData.temperatureDewPoint}°C
Barometric Pressure: ${currentData.pressureMeanSeaLevel} mb.
Wind: ${currentData.windDirectionCardinal} ${currentData.windSpeed} km/h
Visibility: ${currentData.visibility} km. Ceiling: ${currentData.cloudCeiling}`;


            const fullText = [locationText, weatherText]
              .map(line => line.trim())
              .join('\n')

            drawText(fullText, () => {
              locationIndex++;
              processNextLocation();
            });
          } else {
            console.warn(`No valid current data found for ${locationName}`);
            locationIndex++;
            processNextLocation();
          }
        } else {
          console.warn(`No data found for ${locationName}`);
          locationIndex++;
          processNextLocation();
        }
      } else {
        setTimeout(() => {
          locationIndex = 0;
          processNextLocation();
        }, 1);
      }
    }

    setTimeout(processNextLocation, 500)
    
  } catch (error) {
    console.error('erm what the', error);
  }
}

function drawText(text, callback) {
  const lines = text.split('\n');
  let lineIndex = 0;

  function displayLine() {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      let charIndex = 0;

      function writeCharacter() {
        if (charIndex < line.length) {
          ldlText.innerHTML += line.charAt(charIndex);
          charIndex++;
          setTimeout(writeCharacter)
        } else {
          lineIndex++;
          setTimeout(() => {
            ldlText.innerHTML = '';
            setTimeout(displayLine, 0);
          }, 5000);
        }
      }
      writeCharacter();
    } else {
        if (callback) callback();
    }
  }
  displayLine();
}

LDLData();
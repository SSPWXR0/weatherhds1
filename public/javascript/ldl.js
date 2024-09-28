const ldlText = document.getElementById('ldl-weather-text');

async function LDLData() {
  try {

    let data;
    let config;

    const [response, configResponse] = await Promise.all([
        fetch('./ldlData.json'),
        fetch('./config.json')
    ]);
  
    data = await response.json();
    config = await configResponse.json();

    let locationIndex = 0;

    function processNextLocation() {

      if (config.units == "e") {
        endingTemp = "°F"
        endingWind = "mph"
        endingDistance = "mi"
        endingMeasurement = "in"
        endingCeiling= ""
        endingPressure = "hg"
        endingSnow = "in"
        endingRain = "in"
    } else if(config.units == "m") {
        endingTemp = "°C"
        endingWind = "km/h"
        endingDistance = "km"
        endingMeasurement = "mm"
        endingCeiling = "m"
        endingPressure = "mb"
        endingSnow = "cm"
        endingRain = "mm"
    }

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

          let ceilingFormatted;

           if (currentData.cloudCeiling === null) {
              ceilingFormatted = "Unlimited"
          } else {
              ceilingFormatted = `${currentData.cloudCeiling}${endingCeiling}`
          }
      
          const weatherText = `
${currentData.wxPhraseLong}
Temp: ${currentData.temperature}${endingTemp}
Humidity: ${currentData.relativeHumidity}% Dewpoint: ${currentData.temperatureDewPoint}${endingTemp}
Barometric Pressure: ${currentData.pressureMeanSeaLevel} ${endingPressure}.
Wind: ${currentData.windDirectionCardinal} ${currentData.windSpeed} ${endingWind}
Visibility: ${currentData.visibility} ${endingDistance}. Ceiling: ${ceilingFormatted}
Please submit WeatherHDS bug reports to
https://github.com/SSPWXR0/weatherhds1/issues
and/or contact this system's operator`;


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

      if (config.staticLDL === false) {

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
        
        ldlText.innerHTML = line
        lineIndex++
    
        setTimeout(() => {
          ldlText.innerHTML = '';
          setTimeout(displayLine, 0)
        }, 5000);

      }
    } else {
        if (callback) callback();
    }
  }
  displayLine();
}

LDLData();
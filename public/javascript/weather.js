const weatherIcons = { // DAY / NIGHT
    "0": ["tornado.svg", "tornado.svg"], // Tornado
    "1": ["hurricane.svg", "hurricane.svg"], // Tropical Storm
    "2": ["hurricane.svg", "hurricane.svg"], // Hurricane
    "3": ["thunderstorms-day-extreme-rain.svg", "thunderstorms-night-extreme-rain.svg"], // Strong Storms
    "4": ["thunderstorms-day.svg", "thunderstorms-night.svg"], // Thunderstorms
    "5": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Rain / Snow
    "6": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Rain / Sleet
    "7": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Wintry Mix
    "8": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Freezing Drizzle
    "9": ["drizzle.svg", "drizzle.svg"], // Drizzle
    "10": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Freezing Rain
    "11": ["overcast-day-rain.svg", "overcast-night-rain.svg"], // Showers
    "12": ["overcast-day-rain.svg", "overcast-night-rain.svg"], // Rain
    "13": ["overcast-day-snow.svg", "overcast-night-snow.svg"], // Flurries
    "14": ["overcast-day-snow.svg", "overcast-night-snow.svg"], // Snow Showers
    "15": ["extreme-day-snow.svg", "extreme-night-snow.svg"], // Blowing / Drifting Snow
    "16": ["overcast-day-snow.svg", "overcast-night-snow.svg"], // Snow
    "17": ["extreme-day-hail.svg", "extreme-night-hail.svg"], // Hail
    "18": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"], // Sleet
    "19": ["dust-wind.svg", "dust-wind.svg"], // Blowing Dust / Sandstorm
    "20": ["overcast-day-fog.svg", "overcast-night-fog.svg"], // Foggy
    "21": ["overcast-day-haze.svg", "overcast-night-haze.svg"], // Haze
    "22": ["overcast-day-smoke.svg", "overcast-night-smoke.svg"], // Smoke
    "23": ["wind.svg", "wind.svg"], // Breezy
    "24": ["wind.svg", "wind.svg"], // Windy
    "25": ["thermometer-colder.svg", "thermometer-colder.svg"], // Frigid / Ice Crystals
    "26": ["cloudy.svg", "cloudy.svg"], // Cloudy
    "27": ["overcast-night.svg", "overcast-night.svg"], // Mostly Cloudy (Night)
    "28": ["overcast-day.svg", "overcast-day.svg"], // Mostly Cloudy (Day)
    "29": ["partly-cloudy-night.svg", "partly-cloudy-night.svg"], // Partly Cloudy (Night)
    "30": ["partly-cloudy-day.svg", "partly-cloudy-day.svg"], // Partly Cloudy (Day)
    "31": ["clear-night.svg", "clear-night.svg"], // Clear (Night)
    "32": ["clear-day.svg", "clear-day.svg"], // Sunny (Day)
    "33": ["clear-night.svg", "clear-night.svg"], // Fair / Mostly Clear (Night)
    "34": ["clear-day.svg", "clear-day.svg"], // Fair / Mostly Sunny (Day)
    "35": ["extreme-hail.svg", "extreme-night-hail.svg"], // Mixed Rain and Hail
    "36": ["thermometer-sun.svg", "thermometer-sun.svg"], // Hot
    "37": ["thunderstorms-day.svg", "thunderstorms-day.svg"], // Isolated Thunderstorms (Day)
    "38": ["thunderstorms-day.svg", "thunderstorms-night.svg"], // Scattered Thunderstorms
    "39": ["overcast-day-rain.svg", "overcast-day-rain.svg"], // Scattered Showers (Day)
    "40": ["extreme-day-rain.svg", "extreme-night-rain.svg"], // Heavy Rain
    "41": ["snowflake.svg", "snowflake.svg"], // Scattered Snow Showers (Day)
    "42": ["extreme-day-snow.svg", "extreme-night-snow.svg"], // Heavy Snow
    "43": ["extreme-day-snow.svg", "extreme-night-snow.svg"], // Blizzard
    "44": ["not-available.svg", "not-available.svg"], // Not Available (N/A)
    "45": ["partly-cloudy-night-rain.svg", "partly-cloudy-night-rain.svg"], // Scattered Showers (Night)
    "46": ["partly-cloudy-night-sleet.svg", "partly-cloudy-night-sleet.svg"], // Scattered Snow Showers (Night)
    "47": ["thunderstorms-night.svg", "thunderstorms-night.svg"] // Scattered Thunderstorms (Night)
};

const animationFormat = 'avif';

const weatherGifs = {
    "snow": ["13", "14", "15", "16", "42", "43"], // Snow events
    "cloudy": ["26", "27", "28"], // Cloudy events
    "storm": ["3", "4", "37", "38", "47"], // Thunderstorms
    "rain": ["9", "11", "12", "40"], // Rain events
    "sun": ["32", "34"], // Sunny/Fair Day
    "partlycloudy": ["29", "30", "33"], // Partly Cloudy
    "fog": ["20", "21", "22"] // Fog, Haze, Smoke
};


let locationIndex = 0;

const upNextLocationText = document.getElementById('upnext-location');
const currentLocationText = document.getElementById('current-location');

let configGlobal;

let isWeatherGood;

let chart;

async function mainData() {

    try {

        const [response, configResponse] = await Promise.all([
            fetch('./wxData.json'),
            fetch('./config.json')
          ]);

          const data = await response.json();
          const config = await configResponse.json();

          configGlobal = config

          console.log(data)

          function processNextLocation() {

            if (config.staticIcons === true) {
                iconDir = "static"
            } else {
                iconDir = "animated"
            }

            if (config.units == "e") {
                endingTemp = "°F"
                endingWind = "mph"
                endingDistance = "mi"
                endingMeasurement = "in"
                endingCeiling= "ft"
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

            if (locationIndex < config.locations.length) {
              const locationName = config.locations[locationIndex];
              const locationData = data[locationName];
              const nextLocationName = config.locations[(locationIndex + 1) % config.locations.length];

              if (locationData) {
                const latestKey = Object.keys(locationData)
                  .map(Number)
                  .sort((a, b) => b - a)[0];
      
                const latestData = locationData[latestKey];
      
              if (latestData && latestData.current) {
                const currentData = latestData.current;
                const forecastData = latestData.weekly;
                const specialData = latestData.special;

                currentLocationText.innerHTML = locationName;

                upNextLocationText.innerHTML = `Next: ${nextLocationName}`;
                
                function istheweathergood() {
                    if (!currentData || !currentData.iconCode) {
                        console.error("no valid icon code in currentData")
                        return;
                    }

                    const iconCode = currentData.iconCode.toString();

                    const shmtWeatherStuff = [
                        "0",  // Tornado
                        "1",  // Tropical Storm
                        "2",  // Hurricane
                        "3",  // Strong Storms
                        "4",  // Thunderstorms
                        "15", // Blowing Snow
                        "17", // Hail
                        "35", // Mixed Rain and Hail
                        "36", // Extreme Heat
                        "37", // Isolated Thunderstorms
                        "38", // Scattered Thunderstorms
                        "40", // Heavy Rain
                        "42", // Heavy Snow
                        "43", // Blizzard
                        "47", // Scattered Thunderstorms (Night)
                        "25"  // Frigid, Ice Crystals
                    ];

                    isWeatherGood = !shmtWeatherStuff.includes(iconCode)

                }

                istheweathergood();

                function populateStationIDSlide() {
                    affiliateName = document.getElementById('station-id-affiliatename');
                    channelID = document.getElementById('station-id-channelid');
                    networkLogoStationID = document.getElementById('station-id-logo')

                    affiliateName.innerHTML = `${config.affiliateName}`
                    channelID.innerHTML = `${config.channelNumber}`
                }

                populateStationIDSlide()

                function populateCurrentSlide() {
                    currentText = document.getElementById('main-current-condition')
                    currentIcon = document.getElementById('main-current-icon')
                    currentTemp = document.getElementById('main-current-temp')
                    currentExtraWxContainer = document.getElementsByClassName('main-current-rightcontainer')[0];
                    currentExtraWxData = document.getElementById('main-current-extradata');
                    currentExtraWxLabels = document.getElementById('main-current-extralabels');
                    currentVideoBackground = document.getElementById('current-background');

                    //CLEAR
                    currentExtraWxData.innerHTML = ``;
                    currentExtraWxLabels.innerHTML = ``;

                    currentText.innerHTML = `${currentData.wxPhraseLong}`
                    currentTemp.innerHTML = `${currentData.temperature}${endingTemp}`

                    const iconCode = currentData.iconCode;
                    const dayOrNight = currentData.dayOrNight;
                    const iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                    currentIcon.src = `/graphics/${iconDir}/${iconPath}`


                    // CURRENT CONDITIONS VIDEO BACKGROUNDS
                    if (configGlobal.enableVideoBackgrounds === true) {
                        let gifCurrent = `sun.avif`;

                        for (let gif in weatherGifs) {
                            if (weatherGifs[gif].includes(iconCode.toString())) {
                                gifCurrent = `${gif}.${animationFormat}`;
                                break
                            }
                        }

                        document.getElementById('current-background').style.backgroundImage = `url(/images/gif/${gifCurrent})`;
                    }

                    let ceilingFormatted;

                    if (currentData.cloudCeiling === null) {
                        ceilingFormatted = "Unlimited"
                    } else {
                        ceilingFormatted = `${currentData.cloudCeiling}${endingCeiling}`
                    }

                    const windLabel = document.createTextNode(`• Winds:`)
                    const humidityLabel = document.createTextNode(`• Humidity:`);
                    const pressureLabel = document.createTextNode(`• Pressure:`);
                    const ceilingLabel = document.createTextNode(`• Ceiling:`);
                    const visibilityLabel = document.createTextNode(`• Visibility:`);
                    const moonLabel = document.createTextNode(`• Moon Phase:`);
                    const dewpointLabel = document.createTextNode(`• Dewpoint:`);
                    const uviLabel = document.createTextNode(`• UV Index:`)

                    const wind = document.createTextNode(`${currentData.windDirectionCardinal}, @ ${currentData.windSpeed} ${endingWind}`)
                    const humidity = document.createTextNode(`${currentData.relativeHumidity}%`);
                    const pressure = document.createTextNode(`${currentData.pressureAltimeter}${endingPressure} and ${currentData.pressureTendencyTrend}`);
                    const ceiling = document.createTextNode(ceilingFormatted);
                    const visibility = document.createTextNode(`${currentData.visibility} ${endingDistance}`);
                    const moon = document.createTextNode(`${latestData.weekly.moonPhase[0]}`);
                    const dewpoint = document.createTextNode(`${currentData.temperatureDewPoint}${endingTemp}`);
                    const uvi = document.createTextNode(`${currentData.uvIndex} of 11, or ${currentData.uvDescription}`)

                    currentExtraWxLabels.appendChild(windLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(humidityLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(pressureLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(ceilingLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(visibilityLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(moonLabel);
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(dewpointLabel)
                    currentExtraWxLabels.appendChild(document.createElement('br'));
                    currentExtraWxLabels.appendChild(uviLabel);

                    currentExtraWxData.appendChild(wind);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(humidity);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(pressure);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(ceiling);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(visibility);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(moon);
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(dewpoint)
                    currentExtraWxData.appendChild(document.createElement('br'));
                    currentExtraWxData.appendChild(uvi);
                }

                populateCurrentSlide()

                function populateForecastSlides() {
                    // Short-term forecast: DAY ONE
                    const dayOneIcon = document.getElementById('main-forecast-shorttermd1-icon');
                    const dayOneCondition = document.getElementById('forecast-shorttermd1-condition');
                    const dayOneTemp = document.getElementById('forecast-shorttermd1-temp');
                    const dayOneText = document.getElementById('forecast-shorttermd1-text');
                    const dayOneTitle = document.getElementById('forecast-shorttermd1-title')
                    const dayTwoIcon = document.getElementById('main-forecast-shorttermd2-icon');
                    const dayTwoCondition = document.getElementById('forecast-shorttermd2-condition');
                    const dayTwoTemp = document.getElementById('forecast-shorttermd2-temp');
                    const dayTwoText = document.getElementById('forecast-shorttermd2-text');
                    const dayTwoTitle = document.getElementById('forecast-shorttermd2-title')
                    const dayThreeTitle = document.getElementById('forecast-day3-title')
                    const dayThreeCondition = document.getElementById('forecast-day3-condition')
                    const dayThreeIcon = document.getElementById('forecast-day3-icon')
                    const dayThreeTempHi = document.getElementById('forecast-day3-high')
                    const dayThreeTempLow = document.getElementById('forecast-day3-low')
                    const dayThreeWind = document.getElementById('forecast-day3-wind')
                    const dayThreePrecip = document.getElementById('forecast-day3-pop')
                    const dayFourTitle = document.getElementById('forecast-day4-title')
                    const dayFourCondition = document.getElementById('forecast-day4-condition')
                    const dayFourIcon = document.getElementById('forecast-day4-icon')
                    const dayFourTempHi = document.getElementById('forecast-day4-high')
                    const dayFourTempLow = document.getElementById('forecast-day4-low')
                    const dayFourWind = document.getElementById('forecast-day4-wind')
                    const dayFourPrecip = document.getElementById('forecast-day4-pop')
                    const dayFiveTitle = document.getElementById('forecast-day5-title')
                    const dayFiveCondition = document.getElementById('forecast-day5-condition')
                    const dayFiveIcon = document.getElementById('forecast-day5-icon')
                    const dayFiveTempHi = document.getElementById('forecast-day5-high')
                    const dayFiveTempLow = document.getElementById('forecast-day5-low')
                    const dayFiveWind = document.getElementById('forecast-day5-wind')
                    const dayFivePrecip = document.getElementById('forecast-day5-pop')
                    const daySixTitle = document.getElementById('forecast-day6-title')
                    const daySixCondition = document.getElementById('forecast-day6-condition')
                    const daySixIcon = document.getElementById('forecast-day6-icon')
                    const daySixTempHi = document.getElementById('forecast-day6-high')
                    const daySixTempLow = document.getElementById('forecast-day6-low')
                    const daySixWind = document.getElementById('forecast-day6-wind')
                    const daySixPrecip = document.getElementById('forecast-day6-pop')
                    const daySevenTitle = document.getElementById('forecast-day7-title')
                    const daySevenCondition = document.getElementById('forecast-day7-condition')
                    const daySevenIcon = document.getElementById('forecast-day7-icon')
                    const daySevenTempHi = document.getElementById('forecast-day7-high')
                    const daySevenTempLow = document.getElementById('forecast-day7-low')
                    const daySevenWind = document.getElementById('forecast-day7-wind')
                    const daySevenPrecip = document.getElementById('forecast-day7-pop')

                    //cleasr
                    dayOneText.innerHTML = ``;
                    dayTwoText.innerHTML = ``;

                    dayOneCondition.innerHTML = `${forecastData.daypart[0].wxPhraseLong[0] ?? forecastData.daypart[0]?.wxPhraseLong[1]}`
                    dayOneTemp.innerHTML = `${forecastData.daypart[0].temperature[0] ?? forecastData.daypart[0]?.temperature[1]}${endingTemp}`
                    dayOneTitle.innerHTML = `${forecastData.daypart[0].daypartName[0] ?? forecastData.daypart[0]?.daypartName[1]}`

                    const dayOneIconCode = forecastData.daypart[0].iconCode[0] ?? forecastData.daypart[0].iconCode[1];
                    const dayOrNight = forecastData.daypart[0].dayOrNight[0] ?? forecastData.daypart[0]?.dayOrNight[1];
                    const iconPath = weatherIcons[dayOneIconCode] ? weatherIcons[dayOneIconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg'
                    dayOneIcon.src = `/graphics/${iconDir}/${iconPath}`

                    const dayOneNarrative = document.createTextNode(`${forecastData.daypart[0].narrative[0] ?? forecastData.daypart[0]?.narrative[1]}`)
                    dayOneText.appendChild(dayOneNarrative)

                    // DAY TWO

                    dayTwoCondition.innerHTML = `${forecastData.daypart[0].wxPhraseLong[2]}`
                    dayTwoTemp.innerHTML = `${forecastData.daypart[0].temperature[2]}${endingTemp}`
                    dayTwoTitle.innerHTML = `${forecastData.daypart[0].daypartName[2]}`

                    const dayTwoIconCode = forecastData.daypart[0].iconCode[2];
                    const dayOrNight2 = forecastData.daypart[0].dayOrNight[2];
                    const dayTwoIconPath = weatherIcons[dayTwoIconCode] ? weatherIcons[dayTwoIconCode][dayOrNight2 === "D" ? 0 : 1] : 'not-available.svg'
                    dayTwoIcon.src = `/graphics/${iconDir}/${dayTwoIconPath}`

                    const dayTwoNarrative = document.createTextNode(`${forecastData.daypart[0].narrative[2]}`)
                    dayTwoText.appendChild(dayTwoNarrative)

                    // EXTENDED

                    dayThreeTitle.innerHTML = `${forecastData.daypart[0].daypartName[4]}`
                    dayFourTitle.innerHTML = `${forecastData.daypart[0].daypartName[6]}`
                    dayFiveTitle.innerHTML = `${forecastData.daypart[0].daypartName[8]}`
                    daySixTitle.innerHTML = `${forecastData.daypart[0].daypartName[10]}`
                    daySevenTitle.innerHTML = `${forecastData.daypart[0].daypartName[12]}`

                    dayThreeCondition.innerHTML = `${forecastData.daypart[0].wxPhraseShort[4]}`
                    dayFourCondition.innerHTML = `${forecastData.daypart[0].wxPhraseShort[6]}`
                    dayFiveCondition.innerHTML = `${forecastData.daypart[0].wxPhraseShort[8]}`
                    daySixCondition.innerHTML = `${forecastData.daypart[0].wxPhraseShort[10]}`
                    daySevenCondition.innerHTML = `${forecastData.daypart[0].wxPhraseShort[12]}`

                    dayThreeTempHi.innerHTML = `${forecastData.calendarDayTemperatureMax[3]}`
                    dayFourTempHi.innerHTML = `${forecastData.calendarDayTemperatureMax[4]}`
                    dayFiveTempHi.innerHTML = `${forecastData.calendarDayTemperatureMax[5]}`
                    daySixTempHi.innerHTML = `${forecastData.calendarDayTemperatureMax[6]}`
                    daySevenTempHi.innerHTML = `${forecastData.calendarDayTemperatureMax[7]}`

                    dayThreeTempLow.innerHTML = `${forecastData.calendarDayTemperatureMin[3]}`
                    dayFourTempLow.innerHTML = `${forecastData.calendarDayTemperatureMin[4]}`
                    dayFiveTempLow.innerHTML = `${forecastData.calendarDayTemperatureMin[5]}`
                    daySixTempLow.innerHTML = `${forecastData.calendarDayTemperatureMin[6]}`
                    daySevenTempLow.innerHTML = `${forecastData.calendarDayTemperatureMin[7]}`
                    
                    dayThreeWind.innerHTML = `${forecastData.daypart[0].windDirectionCardinal[4]} ${forecastData.daypart[0].windSpeed[4]}${endingWind}`
                    dayFourWind.innerHTML = `${forecastData.daypart[0].windDirectionCardinal[6]} ${forecastData.daypart[0].windSpeed[6]}${endingWind}`
                    dayFiveWind.innerHTML = `${forecastData.daypart[0].windDirectionCardinal[8]} ${forecastData.daypart[0].windSpeed[8]}${endingWind}`
                    daySixWind.innerHTML = `${forecastData.daypart[0].windDirectionCardinal[10]} ${forecastData.daypart[0].windSpeed[10]}${endingWind}`
                    daySevenWind.innerHTML = `${forecastData.daypart[0].windDirectionCardinal[12]} ${forecastData.daypart[0].windSpeed[12]}${endingWind}`

                    dayThreePrecip.innerHTML = `${forecastData.daypart[0].precipChance[4]}%`
                    dayFourPrecip.innerHTML = `${forecastData.daypart[0].precipChance[6]}%`
                    dayFivePrecip.innerHTML = `${forecastData.daypart[0].precipChance[8]}%`
                    daySixPrecip.innerHTML = `${forecastData.daypart[0].precipChance[10]}%`
                    daySevenPrecip.innerHTML = `${forecastData.daypart[0].precipChance[12]}%`

                    function setDayIcon(day, daypartIndex) {
                        const iconCode = forecastData.daypart[0].iconCode[daypartIndex];
                        const dayOrNight = forecastData.daypart[0].dayOrNight[daypartIndex];
                        const iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg';
                        day.src = `/graphics/${iconDir}/${iconPath}`;
                    }
                    
                    // Set day icons
                    setDayIcon(dayThreeIcon, 4);
                    setDayIcon(dayFourIcon, 6);
                    setDayIcon(dayFiveIcon, 8);
                    setDayIcon(daySixIcon, 10);
                    setDayIcon(daySevenIcon, 12);

                    const airQualityIndex = document.getElementById('airqaulityindex')
                    const airQualityCategory = document.getElementById('airqaulitycategory')
                    const airQualityPrimaryPol =document.getElementById('airqaulityprimarypollutant')
		            const airQualityGeneral = document.getElementById('airqaulitygeneralmessage')
		            const airQualitySensitive = document.getElementById('airqaulitysensitivemessage')

                    airQualityIndex.innerHTML = `${specialData.aqi.globalairquality.airQualityIndex}`
		            airQualityCategory.innerHTML = `${specialData.aqi.globalairquality.airQualityCategory}`
		            airQualityPrimaryPol.innerHTML = `${specialData.aqi.globalairquality.primaryPollutant}`
		            airQualityGeneral.innerHTML = `${specialData.aqi.globalairquality.messages.General.text}`
		            airQualitySensitive.innerHTML = `${specialData.aqi.globalairquality.messages["Sensitive Group"].text}`
                }

                populateForecastSlides()

                function mainRadar() {
                    const radarContainer = document.getElementsByClassName('main-current-radar-container')[0];
                    const radarImgLink = latestData.radar

                    radarContainer.style.backgroundImage = `url(${radarImgLink})`
                }

                mainRadar()

                function alerts() {
                    const alertsSlideContainer = document.getElementById('alerts')

                    if (latestData.alerts && Array.isArray(latestData.alerts.alerts) && latestData.alerts.alerts.length > 0) {

                        latestData.alerts.alerts.forEach(function(alert) {
                            alertsSlideContainer.innerHTML = "";
                            let alertElement = document.createElement('div')
                            alertElement.className = 'alert-box';
                            alertElement.innerHTML = `
                                            <h3>${alert.officeName} --- ${alert.eventDescription}</h3>
                                            <p>for the area of ${alert.areaName};</P
                                            <p>${alert.headlineText}</p>
                                            `;
                            alertsSlideContainer.appendChild(alertElement);
                        })
                        
                    } else {
                        if (config.disableBrainrot === true) {
                            alertsSlideContainer.innerHTML= `<h3 style="font-size: 16pt; text-shadow: 2pt 2pt 5pt #000000; font-weight: bold;" id="upnext-subtitle">Now... here is your weather,<h3>
                            <h1 style="font-size: 36pt; text-shadow: 2pt 2pt 5pt #000000; font-weight: 400; text-align: right;" id="upnext-location-header">${locationName}</h1>`

                            let decorativeContainer = document.createElement('div')
                            let decorative = document.createElement('div')

                            decorative.className = `main-alerts-standby-scrolltextdecorative`
                            decorativeContainer.className = `main-alerts-standby-scrolltextcontainer`

                            decorative.innerHTML = `${config.networkName}&nbsp;&nbsp;`.repeat(180);
                            alertsSlideContainer.appendChild(decorativeContainer);
                            decorativeContainer.appendChild(decorative);

                            alertsSlideContainer.style.lineHeight = "0.1"
                        } else {
                            async function alertSlideStandby() {

                                alertsSlideContainer.innerHTML = "";
    
                                console.info('Showing alert slide standby')
                                
                                try {
                                    const response = await fetch('./imageIndex.json');
                                    const imageIndex = await response.json();
                                
                                    let standbyContainer = document.createElement('div');
                                    standbyContainer.className = `main-alerts-standby`;
                                    standbyContainer.innerHTML = `
                                        <h4>There are no alerts in effect...</h4>
                                        <h6>In the meantime, take 10 seconds before the slide changes to admire this random cat picture!</h6>
                                    `;
                                
                                    alertsSlideContainer.appendChild(standbyContainer);
                                
                                    if (imageIndex.brainrot && imageIndex.brainrot.length > 0) {
                                        const randomIndex = Math.floor(Math.random() * imageIndex.brainrot.length);
                                        const randomImage = imageIndex.brainrot[randomIndex];
                                
                                        let imageContainer = document.createElement('div');
                                        imageContainer.className = `main-alerts-standby-brainrot`;
                                        imageContainer.style.backgroundImage = `url(${randomImage})`;
                                        imageContainer.style.backgroundSize = 'contain';
                                        imageContainer.style.height = '70%';
                                        imageContainer.style.width = '60%';
    
                                        standbyContainer.appendChild(imageContainer);
                                    }
                                } catch (error) {
                                    console.error('Error fetching imageIndex.json:', error);
                                }
                            }
    
                            alertSlideStandby();
                        }
                        
                    }
                }

                alerts()

                //define the canvas with 
                const sevenDayHighAndLow = document.getElementById('sevenDayChart');
                //we cannot reuse a canvas, once made, it needs to be destroyed. Easiest to do this reight before makinf the chart
                if (chart) chart.destroy();
                //These define the default option overides 
                Chart.defaults.backgroundColor = '#FFF';
                Chart.defaults.borderColor = '#FFF';
                Chart.defaults.color = '#FFF';
                Chart.defaults.font.weight = 'bold';
                  chart = new Chart(sevenDayHighAndLow, {
                    type: 'line',
                
                	responsive: true,
                    maintainAspectRatio: false,
                	devicePixelRatio: 8,
                	
                    data: {
                      labels: forecastData.dayOfWeek,
                      datasets: [{
                        label: 'Daily Low',
                        data: forecastData.calendarDayTemperatureMin,
                        borderWidth: 2
                      },
                      {
                	label: 'Daily High',
                	data:  forecastData.calendarDayTemperatureMax,
                	borderWidth: 2
                      }
                ]
                    },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: false
                        }
                      }
                    }
                  });
                

            } else {
                console.warn(`No valid current data found for ${locationName}`)
                locationIndex++;
                setTimeout(processNextLocation, 1)
            }
            } else {
                console.warn(`No data found for ${locationName}`);
                locationIndex++;
                setTimeout(processNextLocation, 1)
            }
            } else {
                locationIndex = 0;
                setTimeout(processNextLocation, 1)
            }
        
        }
    processNextLocation();

    } catch (error) {
        console.error('erm what the', error);
    }
}

mainData();

setTimeout(() => {
    console.log(isWeatherGood)
}, 500);

function nextLocation() {
    locationIndex++;
    if (locationIndex >= configGlobal.locations.length) {
        locationIndex = 0;
    }
    mainData();
    slideIndex = 0;
    showSlide(slideIndex);
}

let isSeason = '';

async function backgroundCycle() {
    const backgroundElement = document.querySelector('.wallpaper')
    
    const seasons = [
        "winter",
        "spring",
        "summer",
        "autumn"
    ]

    // calculate the day of the year as a number
    var now = new Date();
    var currentDate = new Date(now.toUTCString());
    var start = new Date(currentDate.getFullYear(), 0, 0);
    var diff = currentDate - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);

    // determin tge seasno
    if (day <= 78) {
        isSeason = seasons[0]; // winter
    } else if (day >= 78 && day <= 171) {
        isSeason = seasons[1]; // spring
    } else if (day >= 171 && day <= 265) {
        isSeason = seasons[2]; // summer
    } else if (day >= 265 && day <= 355) {
        isSeason = seasons[3]; // autumn
    } else if (day >= 355 && day <= 365) {
        isSeason = seasons[0]; // winter
    }

    const response = await fetch('./imageIndex.json')
    const imageIndex = await response.json();

    const seasonBG = imageIndex[`bg_${isSeason}`]
    console.log(isSeason)
    const { wxbad, wxgood } = seasonBG;

    const bgCategory = isWeatherGood ? 'wxgood' : 'wxbad';
    console.log('isWeatherGood equals: ', isWeatherGood)
    const images = seasonBG[bgCategory];
    console.log('Background image category: ', bgCategory)
    const randomize = images[Math.floor(Math.random() * images.length)];

    console.log('Chosen image:', randomize)

    backgroundElement.style.backgroundImage = `url('${randomize}')`;
}

setTimeout(backgroundCycle, 500)
setInterval(backgroundCycle, 600000)

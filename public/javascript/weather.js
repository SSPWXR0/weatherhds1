import { requestWxData, serverHealth } from './data.js'
import { weatherIcons, locationConfig, serverConfig, config } from "../config.js";
import { drawMap } from './radar.js';
import { showBulletinCrawl } from './ldl.js';

export const upNextLocationText = document.getElementById('upnext-location');
export const currentLocationText = document.getElementById('current-location');

const units = serverConfig.units

export let locationIndex = 0;
let chart = null;
const logTheFrickinTime = `[weather.js] | ${new Date().toLocaleString()} |`;
let iconDir = "animated"
let endingTemp, endingWind, endingDistance, endingMeasurement, endingCeiling, endingPressure, endingSnow, endingRain;

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

/*function determineSevereMode() {

}*/

function formatTime(timeString) {
    const date = new Date(timeString)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;

    hours = hours ? hours : 12

    minutes = minutes < 10 ? "0" + minutes : minutes;

    const timeFmt = `${hours}:${minutes} ${ampm}`

    return timeFmt;
}

export function appendTextContent(dataMap) {
        Object.entries(dataMap).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id.includes("icon")) {
            el.src = `/graphics/${iconDir}/${value}`;
        } else {
            el.innerHTML = value;
        }
    });
}

export async function appendDatatoMain(locale, locType) {
    let wxData = {};
    wxData = await requestWxData(locale, locType)

    let lat = wxData?.metadata?.localeData?.lat ?? null;
    let lon = wxData?.metadata?.localeData?.lon ?? null;

    let current;
    let intraday;
    let forecast;
    let airQuality;
    let pollen;

    if (wxData.weather != null) {
            current = wxData?.weather?.["v3-wx-observations-current"] ?? null;
            intraday = wxData?.weather?.v2fcstintraday3?.forecasts ?? [];
            forecast = wxData?.weather?.["v3-wx-forecast-daily-7day"] ?? wxData.weather?.["v3-wx-forecast-daily-3day"] ?? null;
            airQuality = wxData?.weather?.["v3-wx-globalAirQuality"]?.globalairquality ?? null;
            pollen = wxData?.weather?.pollenData?.pollenForecast12hour ?? null;

            if (serverHealth === 0) {

            switch (locType) {

                case "regional":
                    buildCurrentConditions()
                    break;
                case "secondary":
                    buildCurrentConditions()
                    buildShortTermForecast()
                    break;

                case "primary":
                default:
                    buildCurrentConditions()
                    buildIntraDayForecast()
                    buildShortTermForecast()
                    buildExtendedForecast()
                    buildHighLowGraph()
                    buildAirQuality()
                    break;
            }

            try {
                if (wxData?.weather?.alertDetail && locationConfig.locations.some(loc => loc.name.includes(locale))) {
                    let detailText = wxData.weather.alertDetail.texts[0].description
                    let detailTextFmt = detailText.replace(/\n/g, '\u00A0')
                    let alertCategory = wxData.weather.v3alertsHeadlines.alerts[0].significance
                    let headlineText = wxData.weather.v3alertsHeadlines.alerts[0].headlineText
                    showBulletinCrawl(detailTextFmt, alertCategory, headlineText)
                }} catch (error) {}

            } else {
                console.warn(logTheFrickinTime, "Server is unreachable, cannot fetch weather data.")

            }
    }


    drawMap(lat, lon, "twcRadarHcMosaic", 8, 'radar-div-so-that-mapbox-will-be-happy')

    function setDayIcon(day, product, daypartIndex) { // this sucks i hate myself

        let dayOrNight;
        let iconCode;
        let iconPath;
        let avifPath;

        switch (product) {

            case "intraday":
                    dayOrNight = 'D'

                    if (intraday[daypartIndex].daypart_name === "Overnight") {
                        dayOrNight = 'N'
                    }

                    iconCode = intraday[daypartIndex].icon_code;
                    iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg';
                    day.src = `/graphics/${iconDir}/${iconPath}`;
                break;
            case "forecast":
                default:
                    iconCode = forecast.daypart[0].iconCode[daypartIndex];
                    dayOrNight = forecast.daypart[0].dayOrNight[daypartIndex];
                    iconPath = weatherIcons[iconCode] ? weatherIcons[iconCode][dayOrNight === "D" ? 0 : 1] : 'not-available.svg';
                    day.src = `/graphics/${iconDir}/${iconPath}`;
                break;
            case "fcVideoBack":
                    iconCode = forecast.daypart[0].iconCode[daypartIndex];
                    avifPath = weatherIcons[iconCode] && weatherIcons[iconCode][2]? `/images/avif/${weatherIcons[iconCode][2]}`: null;
                    day.style.backgroundImage = `url(${avifPath})`
        }
    }

    function buildCurrentConditions() {

        let uvIndexVar;
        let windIcon = document.getElementById('main-current-windicon')
        let vidBack = document.getElementById('current-background')
        let feelsLikeIcon = document.getElementById('main-current-feelslikeicon')
        let gustValue = document.getElementById('main-current-windvalue-gust')
        let currentIcon = document.getElementById('main-current-icon')
        let ceilingFormatted

        const wxImgRoot = weatherIcons[current.iconCode] || null
        const iconPath = wxImgRoot ? weatherIcons[current.iconCode][current.dayorNight === "D" ? 0 : 1] : 'not-available.svg'
        const avifPath = wxImgRoot && wxImgRoot[2]? `/images/avif/${wxImgRoot[2]}`: null;
        currentIcon.src = `/graphics/${iconDir}/${iconPath}`

        console.log(avifPath)

        if (config.videoBackgrounds === true) {
            vidBack.style.backgroundImage = `url(${avifPath})`
        }

        if (current.windGust === null) {
            gustValue.innerHTML = ``
            windIcon.src = `/graphics/${iconDir}/windsock-weak.svg`
        } else {
            gustValue.innerHTML = `Gusting to ${current.windGust}${endingWind}`
            windIcon.src = `/graphics/${iconDir}/windsock.svg`
        }

        if (current.uvIndex === 0) {
            uvIndexVar = `N/A`
        } else {
            uvIndexVar = `${current.uvIndex} or ${current.uvDescription}`
        }

        if (current.cloudCeiling === null) {
            ceilingFormatted = 'Unlimited'
        } else {
            ceilingFormatted = current.cloudCeiling + endingCeiling
        }

        const dataMapCurrent = {
            "main-current-condition": current.wxPhraseLong,
            "main-current-temp": `${current.temperature}${endingTemp}`,
            "main-current-sunrise-value": formatTime(current.sunriseTimeLocal),
            "main-current-sunset-value": formatTime(current.sunsetTimeLocal),
            "main-current-humidityvalue": `${current.relativeHumidity}%`,
            "main-current-pressurevalue": `${current.pressureAltimeter} ${endingPressure + '\u00A0and\u00A0' + current.pressureTendencyTrend}`,
            "main-current-ceilingvalue": ceilingFormatted,
            "main-current-visibvalue": `${current.visibility} ${endingDistance}`,
            "main-current-dewpointvalue": `${current.temperatureDewPoint}${endingTemp}`,
            "main-current-uvvalue": uvIndexVar,
            "main-current-tempchangevalue": current.temperatureChange24Hour + endingTemp,
            "main-current-feelslikevalue": current.temperatureFeelsLike + endingTemp
        }



        if (units == "m") {
            if (current.temperatureFeelsLike < 0) {
                feelsLikeIcon.src = `/graphics/${iconDir}/thermometer-colder.svg`
            } else {
                feelsLikeIcon.src = `/graphics/${iconDir}/thermometer.svg`
            }
                    } else {
                        if (current.temperatureFeelsLike < 0) {
                            feelsLikeIcon.src = `/graphics/${iconDir}/thermometer-colder.svg`
                        } else {
                            feelsLikeIcon.src = `/graphics/${iconDir}/thermometer.svg`
                        }
                    }
                    if (units == "e") {
                        if (current.temperatureFeelsLike < 32) {
                            feelsLikeIcon.src = `/graphics/${iconDir}/thermometer-colder.svg`
                        } else {
                            feelsLikeIcon.src = `/graphics/${iconDir}/thermometer.svg`
                        }
                    }

        appendTextContent(dataMapCurrent)
    }

    function buildIntraDayForecast() {
        const dataMapIntraday = {
            "main-intraday-title0": intraday[0].daypart_name,
            "main-intraday-time0": formatTime(intraday[0].fcst_valid_local),
            "main-intraday-title1": intraday[1].daypart_name,
            "main-intraday-time1": formatTime(intraday[1].fcst_valid_local),
            "main-intraday-title2": intraday[2].daypart_name,
            "main-intraday-time2": formatTime(intraday[2].fcst_valid_local),
            "main-intraday-title3": intraday[3].daypart_name,
            "main-intraday-time3": formatTime(intraday[3].fcst_valid_local),
            "main-intraday-condition0": intraday[0].phrase_22char,
            "main-intraday-condition1": intraday[1].phrase_22char,
            "main-intraday-condition2": intraday[2].phrase_22char,
            "main-intraday-condition3": intraday[3].phrase_22char,
            "main-intraday-temp0": intraday[0].temp + endingTemp,
            "main-intraday-temp1": intraday[1].temp + endingTemp,
            "main-intraday-temp2": intraday[2].temp + endingTemp,
            "main-intraday-temp3": intraday[3].temp + endingTemp,
            
        };

        let daypartOneIcon = document.getElementById('main-intraday-icon0')
        let daypartTwoIcon = document.getElementById('main-intraday-icon1')
        let daypartThreeIcon = document.getElementById('main-intraday-icon2')
        let daypartFourIcon = document.getElementById('main-intraday-icon3')

        appendTextContent(dataMapIntraday)

        setDayIcon(daypartOneIcon, 'intraday', 0);
        setDayIcon(daypartTwoIcon, 'intraday', 1);
        setDayIcon(daypartThreeIcon, 'intraday', 2);
        setDayIcon(daypartFourIcon, 'intraday', 3);
    }

    function buildShortTermForecast() {
        const dataMapShortTerm = {
            "forecast-shorttermd1-title": forecast.daypart[0].daypartName[0] ?? forecast.daypart[0].daypartName[1],
            "forecast-shorttermd1-condition": forecast.daypart[0].wxPhraseLong[0] ?? forecast.daypart[0].wxPhraseLong[1],
            "forecast-shorttermd1-temp": `${forecast.daypart[0].temperature[0] ?? forecast.daypart[0].temperature[1]}${endingTemp}`,
            "forecast-shorttermd1-text": forecast.daypart[0].narrative[0] ?? forecast.daypart[0].narrative[1],
            "forecast-shorttermd2-title": forecast.daypart[0].daypartName[2] ?? forecast.daypart[0].daypartName[3],
            "forecast-shorttermd2-condition": forecast.daypart[0].wxPhraseLong[2] ?? forecast.daypart[0].wxPhraseLong[3],
            "forecast-shorttermd2-temp": `${forecast.daypart[0].temperature[2] ?? forecast.daypart[0].temperature[3]}${endingTemp}`,
            "forecast-shorttermd2-text": forecast.daypart[0].narrative[2] ?? forecast.daypart[0].narrative[3],
        };

        appendTextContent(dataMapShortTerm)

        const vidBack = document.getElementById('forecast-shorttermd1-summary')
        const vidBack2 = document.getElementById('forecast-shorttermd2-summary')

        let dayOneIcon = document.getElementById('main-forecast-shorttermd1-icon')
        let dayTwoIcon = document.getElementById('main-forecast-shorttermd2-icon')

        setDayIcon(dayOneIcon, 'forecast', 0);
        setDayIcon(dayTwoIcon, 'forecast', 2);

        setDayIcon(vidBack, 'fcVideoBack', 0)
        setDayIcon(vidBack2, 'fcVideoBack', 2)
    }

    function buildExtendedForecast() {

        const dataMapExtended = {
        "forecast-day3-title": forecast.daypart[0].daypartName[4],
        "forecast-day3-condition": forecast.daypart[0].wxPhraseShort[4],
        "forecast-day3-high": `${forecast.calendarDayTemperatureMax[3]}`,
        "forecast-day3-low": `${forecast.calendarDayTemperatureMin[3]}`,
        "forecast-day3-wind": `${forecast.daypart[0].windDirectionCardinal[4]} ${forecast.daypart[0].windSpeed[4]}${endingWind}`,
        "forecast-day3-pop": `${forecast.daypart[0].precipChance[4]}%`,

        "forecast-day4-title": forecast.daypart[0].daypartName[6],
        "forecast-day4-condition": forecast.daypart[0].wxPhraseShort[6],
        "forecast-day4-high": `${forecast.calendarDayTemperatureMax[4]}`,
        "forecast-day4-low": `${forecast.calendarDayTemperatureMin[4]}`,
        "forecast-day4-wind": `${forecast.daypart[0].windDirectionCardinal[6]} ${forecast.daypart[0].windSpeed[6]}${endingWind}`,
        "forecast-day4-pop": `${forecast.daypart[0].precipChance[6]}%`,

        "forecast-day5-title": forecast.daypart[0].daypartName[8],
        "forecast-day5-condition": forecast.daypart[0].wxPhraseShort[8],
        "forecast-day5-high": `${forecast.calendarDayTemperatureMax[5]}`,
        "forecast-day5-low": `${forecast.calendarDayTemperatureMin[5]}`,
        "forecast-day5-wind": `${forecast.daypart[0].windDirectionCardinal[8]} ${forecast.daypart[0].windSpeed[8]}${endingWind}`,
        "forecast-day5-pop": `${forecast.daypart[0].precipChance[8]}%`,

        "forecast-day6-title": forecast.daypart[0].daypartName[10],
        "forecast-day6-condition": forecast.daypart[0].wxPhraseShort[10],
        "forecast-day6-high": `${forecast.calendarDayTemperatureMax[6]}`,
        "forecast-day6-low": `${forecast.calendarDayTemperatureMin[6]}`,
        "forecast-day6-wind": `${forecast.daypart[0].windDirectionCardinal[10]} ${forecast.daypart[0].windSpeed[10]}${endingWind}`,
        "forecast-day6-pop": `${forecast.daypart[0].precipChance[10]}%`,

        "forecast-day7-title": forecast.daypart[0].daypartName[12],
        "forecast-day7-condition": forecast.daypart[0].wxPhraseShort[12],
        "forecast-day7-high": `${forecast.calendarDayTemperatureMax[7]}`,
        "forecast-day7-low": `${forecast.calendarDayTemperatureMin[7]}`,
        "forecast-day7-wind": `${forecast.daypart[0].windDirectionCardinal[12]} ${forecast.daypart[0].windSpeed[12]}${endingWind}`,
        "forecast-day7-pop": `${forecast.daypart[0].precipChance[12]}%`
        };

        const dayThreeIcon = document.getElementById('forecast-day3-icon');
        const dayFourIcon = document.getElementById('forecast-day4-icon');
        const dayFiveIcon = document.getElementById('forecast-day5-icon');
        const daySixIcon = document.getElementById('forecast-day6-icon');
        const daySevenIcon = document.getElementById('forecast-day7-icon');


        setDayIcon(dayThreeIcon, 'forecast', 4);
        setDayIcon(dayFourIcon, 'forecast', 6);
        setDayIcon(dayFiveIcon, 'forecast', 8);
        setDayIcon(daySixIcon, 'forecast', 10);
        setDayIcon(daySevenIcon, 'forecast', 12);

        appendTextContent(dataMapExtended)
    }

    function buildHighLowGraph() {
        const sevenDayHighAndLow = document.getElementById('sevenDayChart');
        //we cannot reuse a canvas, once made, it needs to be destroyed. Easiest to do this reight before makinf the chart
        if (chart) {
            chart.destroy();
        }
        //These define the default option overides 
        Chart.defaults.backgroundColor = '#FFF';
        Chart.defaults.borderColor = '#FFF';
        Chart.defaults.color = '#FFF';
        Chart.defaults.font.size = 38;
        Chart.defaults.font.family = "Poppins, Arial, sans-serif";
        Chart.defaults.font.weight = 'bold';
            chart = new Chart(sevenDayHighAndLow, {
            type: 'line',
                        
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: 12,
                            
            data: {
                labels: forecast.dayOfWeek,
                datasets: [{
                label: 'Daily Low',
                data: forecast.calendarDayTemperatureMin,
                borderWidth: 2,
                borderColor: "#08F",
                backgroundColor: "#08F"
                },
                {
            label: 'Daily High',
            data:  forecast.calendarDayTemperatureMax,
            borderWidth: 2,
            borderColor: "#F80",
            backgroundColor: "#F80"
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

    }

    function buildAirQuality() {
        const icon = document.getElementById('main-aq-icon')

        const dataMapAirQuality = {
            "main-aq-category": airQuality.airQualityCategory,
            "main-aq-pp": airQuality.primaryPollutant,
            "main-aq-narrative": airQuality.messages.General.text,
            "main-aq-ppamount": `${airQuality.pollutants[airQuality.primaryPollutant].amount}${airQuality.pollutants[airQuality.primaryPollutant].unit}`
        };

        appendTextContent(dataMapAirQuality)

        document.getElementById('main-aq-category').style.color = `#${airQuality.airQualityCategoryIndexColor}`

        switch (airQuality.airQualityCategoryIndex) {
            case 2:
                icon.src=`/graphics/ux/leaf_moderate.svg`
                break;

            case 3:
                icon.src=`/graphics/ux/leaf_sensitive.svg`
                break;
            case 4:
                icon.src=`/graphics/ux/leaf_unhealthy.svg`
                break;
            case 5:
                icon.src=`/graphics/ux/leaf_veryunhealthy.svg`
                break;
            case 6:
                icon.src=`/graphics/ux/leaf_hazardous.svg`
                break;
            default:
                case 1:
                icon.src=`/graphics/ux/leaf_good.svg`
                break;
        }

        if (document.getElementById('main-aq-category').innerText.length < 12) {
            document.getElementById('main-aq-category').style.fontSize = '52pt'
        } else {
            document.getElementById('main-aq-category').style.fontSize = '44pt'
        }
    }
} 

export function animateIntraday() {
    const intradayTempSliders = [
            {
                daypart: 0,
                htmlID: document.getElementById('main-intraday-temp-slider-day0'),
                tempID: document.getElementById('main-intraday-temp0')
            },
            {
                daypart: 1,
                htmlID: document.getElementById('main-intraday-temp-slider-day1'),
                tempID: document.getElementById('main-intraday-temp1')
            },
            {
                daypart: 2,
                htmlID: document.getElementById('main-intraday-temp-slider-day2'),
                tempID: document.getElementById('main-intraday-temp2')
            },
            {
                daypart: 3,
                htmlID: document.getElementById('main-intraday-temp-slider-day3'),
                tempID: document.getElementById('main-intraday-temp3')
            }
        ]

        const sliderScale = {
            e: {
                min: -58,
                max: 122
            },
            m: {
                min: -50,
                max: 50,
            }
        }

        for (const slider of intradayTempSliders) {
                const htmlEl = slider.htmlID;
                const temp = slider.tempID.innerText
                const tempInt = parseInt(temp)
                const scale = sliderScale[serverConfig.units] || sliderScale['e']
                const percentage = ((tempInt - scale.min) / (scale.max - scale.min)) * 100
                const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
                
                htmlEl.animate([
                    {height: `0%`},
                    {height: `${clampedPercentage}%`}
                ], {
                    duration: 1000,
                    fill: 'forwards',
                    easing: 'ease-in-out'
                })
        }
}

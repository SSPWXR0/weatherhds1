export let config = {
    "networkName": "METEOChannel", // sets the network name.
    "affiliateName": "SSPWXR Media Group", // your affiliate.
    "channelNumber": "sspwxr02", // channel id.
    "videoBackgrounds": true, // enables or disables the video backgrounds on the current conditions slide.
    "currentConditionsGradient": true, // current conditions gradient based on current time relative to sunrise or sunset.
    "staticIcons": false, // would you like icons that dont move?
    "transparentLDL": 0, // adjusts the background opacity of the LDL.
    "ldlClock": true, // when in LDL only mode, choose if you want to show the clock and the network logo on the LDL.
    "presentationType": 0, // 0 = main presentation, 1 = ldl only, and 2 = no ldl and only main presentation.
    "videoType": 0, // sets the aspect ratio
    "textureFiltering": true, // ONLY AFFECTS RADAR. whether to use pixelated or smooth image rendering.
    "systemTimeZone": "America/Regina", // tz_database. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    "tickerContent": "", // empty = hides scroll. add any text to it to show a crawl on the LDL.
    "overrideBackgroundImage": "", // skips the background rotation and uses the URL provided.
    "enableBackgrounds": true, // enables or disables the background
    "backgroundSource": "online", // set to local to use the locally stored default backgrounds, set value to online to use the Bing background api thing.
    "verboseLogging": false // enables or disables console.log
}

export const weatherIcons = {
    "0": ["tornado.svg", "tornado.svg"],
    "1": ["hurricane.svg", "hurricane.svg"],
    "2": ["hurricane.svg", "hurricane.svg"],
    "3": ["thunderstorms-day-extreme-rain.svg", "thunderstorms-night-extreme-rain.svg"],
    "4": ["thunderstorms-day.svg", "thunderstorms-night.svg"],
    "5": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "6": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "7": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "8": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "9": ["drizzle.svg", "drizzle.svg"],
    "10": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "11": ["overcast-day-rain.svg", "overcast-night-rain.svg"],
    "12": ["overcast-day-rain.svg", "overcast-night-rain.svg"],
    "13": ["overcast-day-snow.svg", "overcast-night-snow.svg"],
    "14": ["overcast-day-snow.svg", "overcast-night-snow.svg"],
    "15": ["extreme-day-snow.svg", "extreme-night-snow.svg"],
    "16": ["overcast-day-snow.svg", "overcast-night-snow.svg"],
    "17": ["extreme-day-hail.svg", "extreme-night-hail.svg"],
    "18": ["overcast-day-sleet.svg", "overcast-night-sleet.svg"],
    "19": ["dust-wind.svg", "dust-wind.svg"],
    "20": ["overcast-day-fog.svg", "overcast-night-fog.svg"],
    "21": ["overcast-day-haze.svg", "overcast-night-haze.svg"],
    "22": ["overcast-day-smoke.svg", "overcast-night-smoke.svg"],
    "23": ["wind.svg", "wind.svg"],
    "24": ["wind.svg", "wind.svg"],
    "25": ["thermometer-colder.svg", "thermometer-colder.svg"],
    "26": ["cloudy.svg", "cloudy.svg"],
    "27": ["overcast-night.svg", "overcast-night.svg"],
    "28": ["overcast-day.svg", "overcast-day.svg"],
    "29": ["partly-cloudy-night.svg", "partly-cloudy-night.svg"],
    "30": ["partly-cloudy-day.svg", "partly-cloudy-day.svg"],
    "31": ["clear-night.svg", "clear-night.svg"],
    "32": ["clear-day.svg", "clear-day.svg"],
    "33": ["clear-night.svg", "clear-night.svg"],
    "34": ["clear-day.svg", "clear-day.svg"],
    "35": ["extreme-hail.svg", "extreme-night-hail.svg"],
    "36": ["thermometer-sun.svg", "thermometer-sun.svg"],
    "37": ["thunderstorms-day.svg", "thunderstorms-day.svg"],
    "38": ["thunderstorms-day.svg", "thunderstorms-night.svg"],
    "39": ["overcast-day-rain.svg", "overcast-day-rain.svg"],
    "40": ["extreme-day-rain.svg", "extreme-night-rain.svg"],
    "41": ["snowflake.svg", "snowflake.svg"],
    "42": ["extreme-day-snow.svg", "extreme-night-snow.svg"],
    "43": ["extreme-day-snow.svg", "extreme-night-snow.svg"],
    "44": ["not-available.svg", "not-available.svg"],
    "45": ["partly-cloudy-night-rain.svg", "partly-cloudy-night-rain.svg"],
    "46": ["partly-cloudy-night-sleet.svg", "partly-cloudy-night-sleet.svg"],
    "47": ["thunderstorms-night.svg", "thunderstorms-night.svg"]
}
// WeatherHDS system and presentation configuration.

export let config = {
    "networkName": "METEOChannel", // sets the network name.
    "affiliateName": "Mist Weather Media", // your affiliate.
    "channelNumber": "/sspwxr", // channel id.
    "videoBackgrounds": true, // enables or disables the video backgrounds on the current conditions slide.
    "currentConditionsGradient": true, // current conditions gradient based on current time relative to sunrise or sunset.
    "staticIcons": false, // would you like icons that dont move?
    "ldlClock": true, // when in LDL only mode, choose if you want to show the clock and the network logo on the LDL.
    
    "presentationConfig": {
        "main": true,
        "ldl": true,
        "ldlClock": false,
        "ldlBack": true,
        "backgrounds": true,
        "repeatMain": true,
        "squareLogo": true,
        "bannerLogo": true,
    },

    "loadingScreen": false,
    "topbarStyle": "domestic", // domestic or weatherscan.
    "videoType": "hdtv", // sets the aspect ratio
    "systemTimeZone": "America/Regina", // tz_database. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    "tickerContent": "", // empty = hides scroll. add any text to it to show a crawl on the LDL.
    "overrideBackgroundImage": "", // skips the background rotation and uses the URL provided.
    "backgroundSource": "online", // set to local to use the locally stored default backgrounds, set value to online to use the Bing background api thing, and set to url to use a background URL.
    "verboseLogging": false // enables or disables console.log
}

export const locationConfig = {
  locations: [
    { name: "DUMMY LOCATION", type: "startPadding" },
    { name: "Saskatoon, SK", type: "primary" },
    { name: "Warman, SK", type: "secondary" },
    { name: "Outlook, SK", type: "secondary"},
    { name: "North Battleford, SK", type: "secondary" },
    { name: "Humboldt, SK", type: "secondary" },

    { name: "Prince Albert, SK", type: "primary" },
    { name: "Melfort, SK", type: "secondary" },
    { name: "Rosthern, SK", type: "secondary" },
    { name: "Waskesiu Lake, SK", type: "secondary" },
    { name: "Wakaw, SK", type: "secondary" },

    { name: "Regina, SK", type: "regional" },
    { name: "Winnipeg, MB", type: "regional" },
    { name: "Edmonton, AB", type: "regional" },
    { name: "Calgary, AB", type: "regional" },
    { name: "Vancouver, BC", type: "regional" },
  ],

  ldlLocations: [
    "Saskatoon, SK",
    "Outlook, SK",
    "Rosetown, SK",
    "Melfort, SK",
    "North Battleford, SK",
    "Lloydminster, AB",
    "Regina, SK"
  ]
};

export const serverConfig = {
  "twcApiKey": "e1f10a1e78da46f5b10a1e78da96f525",
  "units": "m",
  "webPort": 3000,
  "cacheValidTime": 480 //in seconds
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

export const versionID = '1-2025.09.18'
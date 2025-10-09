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

    "loadingScreen": true,
    "topbarStyle": "domestic", // domestic or weatherscan.
    "videoType": "hdtv", // sets the aspect ratio
    "systemTimeZone": "America/Regina", // tz_database. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    "tickerContent": "", // empty = hides scroll. add any text to it to show a crawl on the LDL.
    "overrideBackgroundImage": "", // skips the background rotation and uses the URL provided.
    "backgroundSource": "online", // set to local to use the locally stored default backgrounds, set value to online to use the Bing background api thing, and set to url to use a background URL.
    "verboseLogging": true, // enables or disables console.log
    "refreshInterval": 120 // how often to refresh the browser tab, in minutes.
}

export const locationConfig = {
  locations: [
    { name: "DUMMY LOCATION", type: "startPadding", displayName: "" },
    { name: "Saskatoon, SK", type: "primary", displayName: "Saskatoon" },
    { name: "Warman, SK", type: "secondary", displayName: "Warman" },
    { name: "Outlook, SK", type: "secondary", displayName: "Outlook"},
    { name: "North Battleford, SK", type: "secondary", displayName: "North Battleford" },
    { name: "Humboldt, SK", type: "secondary", displayName: "Humboldt" },

    { name: "Prince Albert, SK", type: "primary", displayName: "Prince Albert" },
    { name: "Melfort, SK", type: "secondary", displayName: "Melfort" },
    { name: "Rosthern, SK", type: "secondary", displayName: "Rosthern" },
    { name: "Waskesiu Lake, SK", type: "secondary", displayName: "Waskesiu" },
    { name: "Wakaw, SK", type: "secondary", displayName: "Wakaw" },

    { name: "Regina, SK", type: "regional", displayName: "Regina, SK" },
    { name: "Winnipeg, MB", type: "regional", displayName: "Winnipeg, MB" },
    { name: "Edmonton, AB", type: "regional", displayName: "Edmonton, AB" },
    { name: "Calgary, AB", type: "regional", displayName: "Calgary, AB" },
    { name: "Vancouver, BC", type: "regional", displayName: "Vancouver, BC" },
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
  "cacheValidTime": 720, //in seconds
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

export const holidayMapping = {
    "01-01": { name: "New Year's Day", color0: "#ffffff", color1: "#000000", icon: "", banner: "" },
    "01-18": { name: "MLK Day", color0: "#d9a10c", color1: "#d9a10c", icon: "", banner: "" },
    "02-02": { name: "Groundhog Day", color0: "#611579", color1: "#611579", icon: "", banner: "" },
    "02-14": { name: "Valentine's Day", color0: "#dd1b89", color1: "#dd1b89", icon: "", banner: "" },
    "03-13": { name: "Spring Clock Change", color0: "#6bbc79", color1: "#6bbc79", icon: "", banner: "" },
    "03-17": { name: "St. Patrick's Day", color0: "#05860b", color1: "#05860b", icon: "", banner: "" },
    "03-20": { name: "First Day of Spring", color0: "#c881d1", color1: "#c881d1", icon: "", banner: "" },
    "03-27": { name: "Easter", color0: "#e875c3", color1: "#e875c3", icon: "", banner: "" },
    "04-01": { name: "April Fools' Day", color0: "#ffff66", color1: "#ffffff", icon: "", banner: "" },
    "04-22": { name: "Earth Day", color0: "#006400", color1: "#006400", icon: "", banner: "" },
    "04-29": { name: "Arbor Day", color0: "#406732", color1: "#406732", icon: "", banner: "" },
    "05-08": { name: "Mother's Day", color0: "#f88fa3", color1: "#f88fa3", icon: "", banner: "" },
    "05-30": { name: "Memorial Day", color0: "#174ed5", color1: "#174ed5", icon: "", banner: "" },
    "06-19": { name: "Father's Day", color0: "#5c820b", color1: "#5c820b", icon: "", banner: "" },
    "06-20": { name: "First Day of Summer", color0: "#e87106", color1: "#e87106", icon: "", banner: "" },
    "07-01": { name: "Canada Day", color0: "#ff0000", color1: "#ffffff", icon: "", banner: "" },
    "07-04": { name: "Independence Day (US)", color0: "#de2a16", color1: "#de2a16", icon: "", banner: "" },
    "09-05": { name: "Labor Day", color0: "#1c3258", color1: "#a52d30", icon: "", banner: "" },
    "09-22": { name: "First Day of Fall", color0: "#a74101", color1: "#a74101", icon: "", banner: "" },
    "10-09": { name: "Thanksgiving (Canada, 2023 example)", color0: "#cc6600", color1: "#ffcc66", icon: "", banner: "" },
    "10-13": { name: "Thanksgiving (Canada, 2025 example)", color0: "#b85423", color1: "#b85423", icon: "", banner: "" },
    "10-31": { name: "Halloween", color0: "#d79f00", color1: "#d79f00", icon: "", banner: "" },
    "11-06": { name: "Fall Clock Change", color0: "#b3ad00", color1: "#b3ad00", icon: "", banner: "" },
    "11-11": { name: "Remembrance Day (CA) / Veterans Day (US)", color0: "#8a3030", color1: "#8a3032", icon: "", banner: "" },
    "11-23": { name: "Thanksgiving (US, 2023 example)", color0: "#ff9933", color1: "#663300", icon: "", banner: "" },
    "12-06": { name: "First Day of Hanukkah", color0: "#dead39", color1: "#dead39", icon: "", banner: "" },
    "12-21": { name: "First Day of Winter", color0: "#0e105d", color1: "#0e105d", icon: "", banner: "" },
    "12-24": { name: "Christmas Eve", color0: "#be312a", color1: "#be312a", icon: "", banner: "" },
    "12-25": { name: "Christmas Day", color0: "#008000", color1: "#ff0000", icon: "", banner: "" },
    "12-31": { name: "New Year's Eve", color0: "#d4aa45", color1: "#d4aa45", icon: "", banner: "" }
}



export const versionID = '1-2025.10.06'
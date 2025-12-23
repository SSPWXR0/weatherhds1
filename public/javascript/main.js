import { config } from "../config.js";
import { fetchOnlineBackground } from "./data.js";
import { imageIndex } from "../imageIndex.js";

const viewport = document.getElementsByClassName("view")[0];
const mainSlides = document.getElementsByClassName("main-slides")[0];
const wallpaper = document.getElementsByClassName("wallpaper")[0];
const topBar = document.getElementsByClassName("topbar")[0];
const ldl = document.getElementsByClassName("ldl-presentation")[0];
const ldlContainer = document.getElementsByClassName("ldl-weather")[0];
const ldlBranding = document.getElementsByClassName("ldl-netlogo")[0];
const date = document.getElementById("date");
const time = document.getElementById("time");
const dateLDL = document.getElementById("dateLDL");
const timeLDL = document.getElementById("timeLDL");

let broadcastState = 0; // zero is good weather, one is bad weather.

const logTheFrickinTime = `[main.js] | ${new Date().toLocaleString()} |`;

function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    if ((month === 12 && day >= 21) || (month <= 3 && day < 20) || (month < 3)) {
        return "bg_winter";
    } else if ((month === 3 && day >= 20) || (month < 6) || (month === 6 && day < 21)) {
        return "bg_spring";
    } else if ((month === 6 && day >= 21) || (month < 9) || (month === 9 && day < 23)) {
        return "bg_summer";
    } else {
        return "bg_autumn";
    }
}

setInterval(() => {
    getCurrentSeason();
}, 24 / 60 * 60 * 1000);
getCurrentSeason();

function initBackgrounds() {
        if (config.backgroundSource === "online") {
            async function onlineBg() {
                const url = await fetchOnlineBackground();
                console.log(logTheFrickinTime, "Fetched new online background:", url);
                wallpaper.style.backgroundImage = `url(${url})`;
            }
            setInterval(onlineBg, 8 * 36000000);
            onlineBg();
        } 
        if (config.backgroundSource === "local") {
            const season = getCurrentSeason();

            let url;
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                url = `url(${array[0]})`;
                
                return url;
            }
            setInterval(() => {
                wallpaper.style.backgroundImage = shuffleArray(imageIndex[season][broadcastState === 0 ? "wxgood" : "wxbad"]);
            }, 600_000); 
            wallpaper.style.backgroundImage = shuffleArray(imageIndex[season][broadcastState === 0 ? "wxgood" : "wxbad"]);
        }
        if (config.overrideBackgroundImage !== "" && config.backgroundSource === "url") {
            wallpaper.style.backgroundImage = `url(${config.overrideBackgroundImage})`;
        }
    }



function ScaleViewportToTheWindowIGuessLmao() {

    const videoTypeParam = new URLSearchParams(window.location.search).get('videoType');

    if (videoTypeParam !== null) {
        const parsed = String(videoTypeParam).toLowerCase();
        config.videoType = parsed;
}

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    let width
    let height

    const videoModes = {
        vga: { width: 1920, height: 1440, barWidth: "95%"},
        hdtv: { width: 2560, height: 1440, barWidth: "95%"},
        ntsc: { width: 2160, height: 1440, barWidth: "95%"},
        tablet: { width: 2304, height: 1440, barWidth: "95%"},
        i2sidebar: { width: 2048, height: 1440, barWidth: "95%"}, // specialized video mode for IntelliStar 2 xD systems with TWC Enhanced sidebar
        i2buffer: { width: 2560, height: 1440, barWidth: "100%"}, // specialized video mode with buffered sidebar area for IntelliStar 2 xD systems with TWC Enhanced sidebar
    };

    const mode = videoModes[config.videoType] || videoModes.vga;

    width = mode.width;
    height = mode.height;
    viewport.style.width = `${mode.width}px`;

    const scaleRatioWidth = containerWidth / width;
    const scaleRatioHeight = containerHeight / height;

    const scaleRatio = Math.min(scaleRatioWidth, scaleRatioHeight);

    viewport.style.transformOrigin = `top left`;

    const centeredLeft = (containerWidth - viewport.offsetWidth * scaleRatio) / 2;
    const centeredTop = (containerHeight - viewport.offsetHeight * scaleRatio) / 2;

    viewport.style.left = `${centeredLeft}px`;
    viewport.style.top = `${centeredTop}px`;

    ldlContainer.style.width = `${mode.barWidth}`;
    topBar.style.width = `${mode.barWidth}`;

    if (config.videoType === "i2buffer") {
        document.getElementsByClassName("i2-sidebar-buffer")[0].style.display = `block`;
        mainSlides.style.width = `80%`;

    }

    if (
        config.videoType !== "hdtv" &&
        config.videoType !== "tablet" &&
        config.videoType !== "i2Sidebar"
    ) {
        document.getElementById('upnext-location2').style.display = 'none' // we only have two up next locations displayed so that it wont be squeezed in SDTV modes.
    }

    viewport.style.transform = `scale(${scaleRatio})`;
}

window.addEventListener('resize', ScaleViewportToTheWindowIGuessLmao);

function clock() { // partially copied from weatherHDS 2
    const now = new Date();
    const utcDate = new Date(now.toUTCString());
    const timezone = config.systemTimeZone

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const dayOfWeek = days[now.getDay()];
    const month = months[now.getMonth()];
    const dayOfMonth = now.getDate();
    const year = now.getFullYear();

    const options = {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(utcDate);

    date.innerText = `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
    time.innerText = formattedDate;

    dateLDL.innerText = `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
    timeLDL.innerText = formattedDate;
}

clock();
setInterval(clock, 1000)

function presentationType() {


    const mainPres = new URLSearchParams(window.location.search).get('main');
    const ldlPres = new URLSearchParams(window.location.search).get('ldl');
    const backgrounds = new URLSearchParams(window.location.search).get('backgrounds');
    const repeatMain = new URLSearchParams(window.location.search).get('repeatMain');
    const ldlClock = new URLSearchParams(window.location.search).get('ldlClock');
    const ldlBack = new URLSearchParams(window.location.search).get('ldlBack')

    if (mainPres !== null) {
        const parsed = mainPres.toLowerCase() === 'true';
        config.presentationConfig.main = parsed;
    }

    if (ldlPres !== null) {
        const parsed = ldlPres.toLowerCase() === 'true';
        config.presentationConfig.ldl = parsed;
    }
    
    if (backgrounds !== null) {
        const parsed = backgrounds.toLowerCase() === 'true';
        config.presentationConfig.backgrounds = parsed;
    }
    if (repeatMain !== null) {
        const parsed = repeatMain.toLowerCase() === 'true';
        config.presentationConfig.repeatMain = parsed;
    }

    if (ldlClock !== null) {
        const parsed = ldlClock.toLowerCase() === 'true';
        config.presentationConfig.ldlClock = parsed;
    }

    if (ldlBack !== null) {
        const parsed = ldlBack.toLowerCase() === 'true';
        config.presentationConfig.ldlBack = parsed;
    }

    if (config.presentationConfig.main != true) {
        wallpaper.style.display = `none`
        mainSlides.style.display = `none`
        topBar.style.display = `none`
    } else {
        ldlBranding.style.display = `none`
    }

    if (config.presentationConfig.backgrounds != true) {
        wallpaper.style.display = `none`
    } else {
        wallpaper.style.display = `block`
    }

    if (config.presentationConfig.ldl != true) {
        if (config.presentationConfig.ldlClock) {
            ldlBranding.style.display = `block`
        }
        ldl.style.display = `none`;
    }
    if (config.presentationConfig.ldlBack === false) {
        ldlBranding.style.display = `none`
        ldlContainer.style.borderLeft = `none`
        ldlContainer.style.borderRight = `none`
        ldlContainer.style.borderTop = `none`
        ldlContainer.style.backgroundColor = `transparent`
        ldlContainer.style.backdropFilter = `none`
    }
}

function scrollTicker() {
    if (config.tickerContent === "") {
        document.getElementsByClassName('ldl-marquee')[0].style.display = `none`
    } else {
        
        document.getElementById('marquee-ticker').innerHTML = config.tickerContent

        $(document).ready(function(){
            $('#marquee-ticker').marquee({
                duration: 9000,
                gap: 360,
                delayBeforeStart: 0,
                direction: 'left',
                duplicated: true, 
                pauseOnHover: true,
            })
        })

    }

}



window.onload = () => {
    ScaleViewportToTheWindowIGuessLmao()
    presentationType()
    scrollTicker()
    initBackgrounds()
}

const refreshInterval = config.refreshInterval * 60000

setTimeout(() => {
    window.reload(true)
}, refreshInterval);
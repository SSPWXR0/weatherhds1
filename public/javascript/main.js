import { config } from "./config.js";

const viewport = document.getElementsByClassName("view")[0];
const mainSlides = document.getElementsByClassName("main-slides")[0];
const wallpaper = document.getElementsByClassName("wallpaper")[0];
const topBar = document.getElementsByClassName("topbar")[0];
const ldl = document.getElementsByClassName("ldl-presentation")[0];
const ldlContainer = document.getElementsByClassName("ldl-weather")[0];
const ldlBranding = document.getElementsByClassName("ldl-netlogo")[0];
const ldlLineThing = document.getElementById('ldl-divider');
const date = document.getElementById("date");
const time = document.getElementById("time");
const dateLDL = document.getElementById("dateLDL");
const timeLDL = document.getElementById("timeLDL");

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
        vga: { width: 640, height: 480, viewportWidth: `640px`, bottom: null },
        hdtv: { width: 854, height: 480, viewportWidth: `854px`, bottom: `-3%` },
        ntsc: { width: 720, height: 480, viewportWidth: `720px`, bottom: null },
        tablet: { width: 768, height: 480, viewportWidth: `768px`, bottom: null }
    };

    const mode = videoModes[config.videoType] || videoModes.vga;

    width = mode.width;
    height = mode.height;
    viewport.style.width = mode.viewportWidth;

    if (mode.bottom !== null) {
        ldlContainer.style.bottom = mode.bottom;
    }

    

    const scaleRatioWidth = containerWidth / width;
    const scaleRatioHeight = containerHeight / height;

    const scaleRatio = Math.min(scaleRatioWidth, scaleRatioHeight);

    viewport.style.transformOrigin = `top left`;

    const centeredLeft = (containerWidth - viewport.offsetWidth * scaleRatio) / 2;
    const centeredTop = (containerHeight - viewport.offsetHeight * scaleRatio) / 2;

    viewport.style.left = `${centeredLeft}px`;
    viewport.style.top = `${centeredTop}px`;

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

setInterval(clock, 1000)

function presentationType() {


    const mainPres = new URLSearchParams(window.location.search).get('main');
    const ldlPres = new URLSearchParams(window.location.search).get('ldl');
    const backgrounds = new URLSearchParams(window.location.search).get('backgrounds');
    const repeatMain = new URLSearchParams(window.location.search).get('repeatMain');
    const ldlClock = new URLSearchParams(window.location.search).get('ldlClock');

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
        ldlContainer.style.display = `none`;
    }

    if (config.presentationConfig.ldlClock === false) {
        timeLDL.style.display = `none`
        dateLDL.style.display = `none`
    }
    if (config.transparentLDL === 1) { // make ldl transparent
        ldlContainer.style.backgroundColor = `rgba(0,0,0,0)`
    }
    if (config.transparentLDL === 2) { // make ldl transparent, and remove the white line at the top
        ldlContainer.style.backgroundColor = `rgba(0,0,0,0)`
        ldlLineThing.remove()
    }
    if (config.transparentLDL === 3) { // like option one, but with text shadow
        ldlContainer.style.backgroundColor = `rgba(0,0,0,0)`
        ldlContainer.style.textShadow = `black 1.1px 1.5px 3px;`
    }
    if (config.transparentLDL === 4) { // like option two, but with text shadow
        ldlContainer.style.backgroundColor = `rgba(0,0,0,0)`
        ldlContainer.style.textShadow = `black 1.1px 1.5px 3px;`
        ldlLineThing.remove()
    }
}

const mainTheme = document.querySelector(':root')

function imageRendering() {
    if (config.textureFiltering === true) { // smoothes images when scaled
        mainTheme.style.imageRendering = `auto`
    }
    if (config.textureFiltering === false) { // pixelates images when scaled
        mainTheme.style.imageRendering = `pixelated`
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

export function everythingConfigLmao() {
    imageRendering()
    ScaleViewportToTheWindowIGuessLmao()
    presentationType()
    scrollTicker()
}

setTimeout(() => {
    location.reload();
  }, 28800000);

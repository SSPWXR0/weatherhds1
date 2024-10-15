const viewport = document.getElementsByClassName("view")[0];
const mainSlides = document.getElementsByClassName("main-slides")[0];
const wallpaper = document.getElementsByClassName("wallpaper")[0];
const topBar = document.getElementsByClassName("topbar")[0];
const ldl = document.getElementsByClassName("ldl-presentation")[0];
const ldlContainer = document.getElementsByClassName("ldl-weather")[0];
const ldlBranding = document.getElementsByClassName("ldl-netlogo")[0];
const date = document.getElementById("date");
const time = document.getElementById("time")
const dateLDL = document.getElementById("dateLDL");
const timeLDL = document.getElementById("timeLDL")


let config;

async function loadConfig() {
    const Response = await fetch('./config.json');
    config = await Response.json();

    console.log(`[main.js]: Loaded the following configuration: ${JSON.stringify(config, null, 2)}`)
}

loadConfig()

function ScaleViewportToTheWindowIGuessLmao() {

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    let width
    let height

    if (config.videoType === 0) {
        width = 640
        height = 480

        viewport.style.width = `640px`
    } else {
        width = 854
        height = 480

        viewport.style.width = `854px`
        ldlContainer.style.bottom = `-3%`
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
    if (config.presentationType === 0) {
        console.log(`Running main presentation. Presentation ID: ${config.presentationType}`)
        ldl.style.width = `90%`
        ldlBranding.style.display = `none`
    } else {
        console.log(`Running LDL-only presentation. Presentation ID: ${config.presentationType}`)

        wallpaper.style.display = `none`
        mainSlides.style.display = `none`
        topBar.style.display = `none`

        ldl.style.width = `75%`
        ldlBranding.style.display = `block`

    }
}

const mainTheme = document.querySelector(':root')

function imageRendering() {
    if (config.textureFiltering === true) {
        mainTheme.style.imageRendering = `auto`
    }
    if (config.textureFiltering === false) {
        mainTheme.style.imageRendering = `pixelated`
    }
}

setTimeout(() => {
    imageRendering()
    ScaleViewportToTheWindowIGuessLmao()
    presentationType()
}, 400);
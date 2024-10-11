const viewport = document.getElementsByClassName("view")[0];
const date = document.getElementById("date");
const time = document.getElementById("time")

let config;

async function loadConfig() {
    const Response = await fetch('./config.json');
    config = await Response.json();

    console.log(`[main.js]: Loaded the following configuration: ${JSON.stringify(config, null, 2)}`)
}

loadConfig()

let head = document.getElementsByTagName('head')[0];

async function determineCSS() {
    await loadConfig()
    let linkSD = document.createElement('link')
    let linkHD = document.createElement('link')

    linkSD.rel = 'stylesheet'
    linkSD.type = 'text/css'
    linkSD.href = './css/style.css'

    linkHD.rel = 'stylesheet'
    linkHD.type = 'text/css'
    linkHD.href = './css/hdSqueezeback.css'

    if (config.videoType === 0) {
        head.appendChild(linkSD)
    } else {
        head.appendChild(linkSD)
        head.appendChild(linkHD)
    }
}

determineCSS()

async function ScaleViewportToTheWindowIGuessLmao() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    let width = 640
    let height = 480

    if (config.videoType === 0) {
        width = 640
        height = 480
    } else {
        width = 1920
        height = 1080
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

setTimeout(() => {
    determineCSS();
    ScaleViewportToTheWindowIGuessLmao();
}, 500);

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
}

setInterval(clock, 1000)
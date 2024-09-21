const viewport = document.getElementsByClassName("view")[0];
const date = document.getElementById("date");
const time = document.getElementById("time")
let timezone = "CST"

async function loadConfig() {
    const Response = await fetch('./config.json');
    const config = await Response.json();

    console.log(`[main.js]: Loaded the following configuration: ${JSON.stringify(config, null, 2)}`)
}

loadConfig()

function ScaleViewportToTheWindowIGuessLmao() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const scaleRatioWidth = containerWidth / 640;
    const scaleRatioHeight = containerHeight / 480;

    const scaleRatio = Math.min(scaleRatioWidth, scaleRatioHeight);

    viewport.style.transformOrigin = `top left`;

    const centeredLeft = (containerWidth - viewport.offsetWidth * scaleRatio) / 2;
    const centeredTop = (containerHeight - viewport.offsetHeight * scaleRatio) / 2;

    viewport.style.left = `${centeredLeft}px`;
    viewport.style.top = `${centeredTop}px`;

    viewport.style.transform = `scale(${scaleRatio})`;
}

ScaleViewportToTheWindowIGuessLmao();

window.addEventListener('resize', ScaleViewportToTheWindowIGuessLmao);

function clock() {
    const now = new Date();

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const dayOfWeek = days[now.getDay()];
    const month = months[now.getMonth()];
    const dayOfMonth = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds =now.getSeconds().toString().padStart(2, '0');
    const AMPM = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12;
    hours = hours ? hours : 12;

    date.innerText = `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
    time.innerText = `${hours}:${minutes}:${seconds} ${AMPM} ${timezone}`;
}

setInterval(clock, 1000)
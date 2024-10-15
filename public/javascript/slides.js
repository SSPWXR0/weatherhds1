const presentationSlides = {
    "0": { title: "Welcome!", htmlID: "stationid", durationMS: "8000"},
    "1": { title: "Weather Alerts", htmlID: "alerts", durationMS: "8000"},
    "2": { title: "Current Conditions", htmlID: "current", durationMS: "10000"},
    "3": { title: "Latest Radar Image", htmlID: "radar", durationMS: "8000"},
    "4": { title: "Day One Forecast", htmlID: "forecast-shortterm", durationMS: "8000"},
    "5": { title: "Day Two Forecast", htmlID: "forecast-shortterm-d2", durationMS: "8000"},
    "6": { title: "Extended Outlook", htmlID: "forecast-extended", durationMS: "10000" },
    "7": { title: "7 Day High and Lows", htmlID: "7day-graph", durationMS: "10000" },
    "8": { title: "Air Quality", htmlID: "airquality", durationMS: "8000"},
    "9": { title: "Again... Current Conditions", htmlID: "current", durationMS: "10000"},
}

let slideIndex = 0;

let slideDurationMS
let slideDurationSec
let totalSlideDurationMS
let totalSlideDurationSec
const weatherHDSVersionNumber = document.getElementsByClassName('versionID')[0].innerText

for (let slide in presentationSlides) {
    totalSlideDurationMS += Number(presentationSlides[slide].durationMS);
}

totalSlideDurationSec = totalSlideDurationMS / 1000;

const slides = document.getElementsByClassName('main-slide')
const currentSlideText = document.getElementById('current-slide');

function showSlide(index) {
    slideDurationMS = Number(presentationSlides[index].durationMS);
    slideDurationSec = Number(presentationSlides[index].durationMS) / 1000;

    for (let key in presentationSlides) {
        const slideElement = document.getElementById(presentationSlides[key].htmlID)
        if (slideElement) {

            setTimeout(() => {
                slideElement.style.animation = `mainPresentationSlideIn 500ms ease-in-out`
            }, slideDurationMS - 500);

            currentSlideText.style.display = `none`
            currentSlideText.style.animation = `switchModules 0.5s ease-in-out`
            currentSlideText.innerHTML = `${presentationSlides[index].title}`
            currentSlideText.style.display = `block`

            slideElement.style.display = 'none';
        }
    }

    const currentSlideElement = document.getElementById(presentationSlides[index].htmlID)

    if (currentSlideElement) {

        setTimeout(() => {
            currentSlideElement.style.animation = `mainPresentationSlideOut 350ms ease-in-out 1 forwards`
        }, slideDurationMS - 300);

        setTimeout(() => {
            currentSlideText.style.animation = `fadeModule 0.5s ease-out`
        }, slideDurationMS - 500);

        currentSlideElement.style.display = 'block';    
    }

    console.log(`Showing Main Presentation Slide: ${presentationSlides[index].htmlID} for a duration of ${slideDurationMS}`)
}

function nextSlide() {
    
    slideIndex++;
    const totalSlides = Object.keys(presentationSlides).length;

    if (slideIndex < totalSlides) {
        showSlide(slideIndex);
    } else {
        slideIndex = 0;
        nextLocation();
    }

    setTimeout(nextSlide, slideDurationMS);
}

function startSlideshow() {
    showSlide(slideIndex);
    setTimeout(nextSlide, slideDurationMS);
}

function loadingScreen() {
    const spinningLogo = document.getElementById('loadingscreen-spinny')

    const xEnd = Math.floor(Math.random() * (360 - 240 + 1)) + 240;
    const yEnd = Math.floor(Math.random() * (360 - 240 + 1)) + 240;

    document.getElementById('loadingscreen-versionID').innerHTML = `WeatherHDS ${weatherHDSVersionNumber}`

    setInterval(() => {
        document.getElementById('loadingscreen-affiliatename').innerHTML = `Affiliate Name: ${config.affiliateName}`
        document.getElementById('loadingscreen-locationname').innerHTML = `System Location: ${config.locations[0]}`
    }, 1000);
    

    console.log(`${xEnd}, ${yEnd}`)

    const keyframes = `
        @keyframes spinXandY {
        1% { transform: rotateX(0deg) rotateY(0deg);}
        100% { transform: rotateX(${xEnd}deg) rotateY(${yEnd}deg); }
    }`

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    spinningLogo.style.animation = `spinXandY ${Number(presentationSlides[0].durationMS)}ms linear`

    setTimeout(() => {
        document.getElementById('loading-screen').remove();
    }, Number(presentationSlides[0].durationMS));
}

loadingScreen()

window.onload = startSlideshow
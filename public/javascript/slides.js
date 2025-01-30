import { config } from "./config.js";
import { nextLocation } from './weather.js';
import { locationsList } from './dataLoader.js';

const presentationSlides = {
    "0": { title: "Welcome!", htmlID: "stationid", durationMS: "6000"},
    "1": { title: "Weather Alerts", htmlID: "alerts", durationMS: "8000"},
    "2": { title: "Current Conditions", htmlID: "current", durationMS: "20000"},
    "3": { title: "Latest Radar Image", htmlID: "radar", durationMS: "8000"},
    "4": { title: "Day One Forecast", htmlID: "forecast-shortterm", durationMS: "8000"},
    "5": { title: "Day Two Forecast", htmlID: "forecast-shortterm-d2", durationMS: "8000"},
    "6": { title: "Extended Outlook", htmlID: "forecast-extended", durationMS: "10000" },
    "7": { title: "7 Day High and Lows", htmlID: "7day-graph", durationMS: "10000" },
    "8": { title: "Air Quality", htmlID: "airquality", durationMS: "8000"},
    "9": { title: "Again... Current Conditions", htmlID: "current", durationMS: "10000"},
}

let slideDurationMS
let slideDurationSec
let totalSlideDurationMS
let totalSlideDurationSec
export let slideIndex = 0;

const weatherHDSVersionNumber = document.getElementsByClassName('versionID')[0].innerText

for (let slide in presentationSlides) {
    totalSlideDurationMS += Number(presentationSlides[slide].durationMS);
}

totalSlideDurationSec = totalSlideDurationMS / 1000;

const currentSlideText = document.getElementById('current-slide');

function runMainCurrentSlide() {
    const module1 = document.getElementsByClassName('main-current-module1')[0]
    const module2 = document.getElementsByClassName('main-current-module2')[0]

    module1.style.display = 'block';
    module2.style.display = 'none';
    document.getElementsByClassName('main-current-extraproducts')[0].style.display = `none`
    document.getElementsByClassName('main-current-extraproducts')[1].style.display = `none`
    document.getElementsByClassName('main-current-extraproducts')[2].style.display = `none`
    document.getElementsByClassName('main-current-extraproducts')[3].style.display = `none`

    setTimeout(() => {
        document.getElementsByClassName('main-current-extraproducts')[0].style.animation = `mainPresentationSlideIn 500ms ease-in-out`
        document.getElementsByClassName('main-current-extraproducts')[1].style.animation = `mainPresentationSlideIn 600ms ease-in-out`
        document.getElementsByClassName('main-current-extraproducts')[2].style.animation = `mainPresentationSlideIn 700ms ease-in-out`
        document.getElementsByClassName('main-current-extraproducts')[3].style.animation = `mainPresentationSlideIn 800ms ease-in-out`

        document.getElementsByClassName('main-current-extraproducts')[0].style.display = `flex`
        document.getElementsByClassName('main-current-extraproducts')[1].style.display = `flex`
        document.getElementsByClassName('main-current-extraproducts')[2].style.display = `flex`
        document.getElementsByClassName('main-current-extraproducts')[3].style.display = `flex`
    }, 500);



    setTimeout(() => {
        module1.style.animation = 'fadeModule 0.4s ease-out 1';

        setTimeout(() => {
            module1.style.display = 'none';
            module1.style.animation = '';
            module2.style.display = 'block';
            module2.style.animation = 'switchModules 0.5s ease-out';
        }, 300);
    }, slideDurationMS / 2 - 500);
}

function runAirQualitySlide() {
    document.getElementsByClassName('main-aq-messagebox')[0].style.display = `block`
    document.getElementsByClassName('main-aq-messagebox')[0].style.display = `block`
    document.getElementsByClassName('main-aq-messagebox')[1].style.display = `none`
    document.getElementsByClassName('main-aq-messagebox')[1].style.display = `none`

    setTimeout(() => {
        document.getElementsByClassName('main-aq-messagebox')[0].style.animation = `fadeModule 300ms ease-in-out`
        
        setTimeout(() => {
            document.getElementsByClassName('main-aq-messagebox')[0].style.display = `none`
            document.getElementsByClassName('main-aq-messagebox')[1].style.display = `block`
            document.getElementsByClassName('main-aq-messagebox')[1].style.animation = `switchModules 500ms ease-in-out`
        }, 300);
    }, slideDurationMS / 2 - 500);
}

function runExtendedSlide() {
    document.getElementsByClassName('main-forecast-day')[0].style.animation = `switchModules 0.6s ease-in-out`
    document.getElementsByClassName('main-forecast-day')[1].style.animation = `switchModules 0.7s ease-in-out`
    document.getElementsByClassName('main-forecast-day')[2].style.animation = `switchModules 0.8s ease-in-out`
    document.getElementsByClassName('main-forecast-day')[3].style.animation = `switchModules 0.9s ease-in-out`
    document.getElementsByClassName('main-forecast-day')[4].style.animation = `switchModules 1s ease-in-out`

    setTimeout(() => {
        document.getElementsByClassName('main-forecast-day')[0].style.animation = ``
        document.getElementsByClassName('main-forecast-day')[1].style.animation = ``
        document.getElementsByClassName('main-forecast-day')[2].style.animation = ``
        document.getElementsByClassName('main-forecast-day')[3].style.animation = ``
        document.getElementsByClassName('main-forecast-day')[4].style.animation = ``
    }, slideDurationMS);
}

export function showSlide(index) {
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

    if (presentationSlides[index].htmlID === 'current') {
        runMainCurrentSlide()
    }

    if (presentationSlides[index].htmlID === 'airquality') {
        runAirQualitySlide()
    }
    if (presentationSlides[index].htmlID === 'forecast-extended') {
        runExtendedSlide()
    }
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
    let loadingScreen = true

    switch (loadingScreen) {
        case true:

                let time = 0

                const spinningLogo = document.getElementById('loadingscreen-spinny')

                const startxx = Math.random() * 1000;
                const startxy = Math.random() * 1000;
                const startyx = Math.random() * 1000;
                const startyy = Math.random() * 1000;
                const startzx = Math.random() * 1000;
                const startzy = Math.random() * 1000;
            
                document.getElementById('loadingscreen-versionID').innerHTML = `WeatherHDS ${weatherHDSVersionNumber}`
            
                setTimeout(() => {
                    document.getElementById('loadingscreen-affiliatename').innerHTML = `Affiliate Name: ${config.affiliateName}`
                    document.getElementById('loadingscreen-locationname').innerHTML = `System Location: ${locationsList.locationIndex.locations[0]}`
                }, 2000);
                    
                const rotateAnimation = () => {
                    const rotatex = perlin.get(startxx + time, startxy + time) * 2;
                    const rotatey = perlin.get(startyx + time, startyy + time) * 2;
                    const rotatez = perlin.get(startzx + time, startzy + time) * 2;
                    spinningLogo.style.transition = "transform 1s linear";
                    spinningLogo.style.transform = `rotateX(${rotatex}turn) rotateY(${rotatey}turn) rotateZ(${rotatez}turn)`;
                }

                setInterval(() => {
                    time += 0.005;
                    rotateAnimation()
                }, 100);
                    
                setTimeout(() => {
                    document.getElementById('loading-screen').remove();
                }, Number(presentationSlides[0].durationMS));
            
            break;
    
        default:
            document.getElementById('loading-screen').style.display = `none` // for when im debugging and i dont want the loading screen
            break;
    }
}

window.onload = loadingScreen()

startSlideshow()
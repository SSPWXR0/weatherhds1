import { config, locationConfig, versionID } from "../config.js";
import { appendDatatoMain, animateIntraday } from "./weather.js";

const playlistSettings = {
    defaultAnimationIn: `mainPresentationSlideIn 500ms ease-in-out`,
    defaultAnimationOut: `mainPresentationSlideOut 500ms ease-in-out forwards`,
}

const preferredPlaylist = {

    startPadding: [
        {
            htmlID: "stationid",
            title: "Welcome!",
            duration: 10000,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        }
    ],

    mainPlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 10000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 10000,
            dynamicFunction: runRadarSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-intraday",
            title: "Intraday Forecast",
            duration: 10000,
            dynamicFunction: animateIntraday,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: "Day One",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: "Day Two",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-extended",
            title: "Beyond",
            duration: 10000,
            dynamicFunction: runExtendedSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "7day-graph",
            title: "Daily Highs & Lows",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "airquality",
            title: "Current AQI",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ],
    secondaryLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 10000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 10000,
            dynamicFunction: runRadarSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: "Short-term Forecast",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: "Short-term Forecast",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ],
    regionalLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 10000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 10000,
            dynamicFunction: runRadarSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ]
};


let slideDurationMS
//let slideDurationSec
let totalSlideDurationMS
let totalSlideDurationSec

const logTheFrickinTime = `[weather.js] | ${new Date().toLocaleString()} |`;
const radarDiv = document.getElementsByClassName('main-radar')[0]

document.getElementById('station-id-hdsver').innerText = versionID
document.getElementById('loadingscreen-versionID').innerHTML = `WeatherHDS ${versionID}`
const currentSlideText = document.getElementById('current-slide');
const currentLocationText = document.getElementById('current-location');
const upNextLocationText = document.getElementById('upnext-location')
currentSlideText.style.display = 'none';
currentLocationText.style.display = 'none';
upNextLocationText.style.display = 'none';


let localeIndex = 0

let slideNearEnd, slideEnd;

async function runPlaylist(locale, call) {
    const loc = locationConfig.locations.find(l => l.name === locale);
    let selectedPlaylist = preferredPlaylist.mainPlaylist;

    clearTimeout(slideNearEnd);
    clearTimeout(slideEnd);

    switch (loc.type) {
        case "startPadding": selectedPlaylist = preferredPlaylist.startPadding; break;
        case "secondary": selectedPlaylist = preferredPlaylist.secondaryLocalePlaylist; break;
        case "regional": selectedPlaylist = preferredPlaylist.regionalLocalePlaylist; break;
        case "primary":
        default: selectedPlaylist = preferredPlaylist.mainPlaylist; break;
    }

    if (locale !== "DUMMY LOCATION" && selectedPlaylist !== preferredPlaylist.startPadding) {
        await appendDatatoMain(locale, loc?.type);
        await new Promise(r => setTimeout(r, 300));
    }

    const slides = document.querySelectorAll('.main-slide');
    const activeSlides = selectedPlaylist.filter(item =>
        Array.from(slides).some(el => el.id === item.htmlID)
    );

    let slideIndex = 0;

    function showNextSlide() {
        if (slideIndex >= activeSlides.length) {
            slides.forEach(s => s.style.display = "none");
            call?.();
            return;
        }

        const slide = activeSlides[slideIndex];
        const el = document.getElementById(slide.htmlID);

        slideDurationMS = slide.duration;

        slides.forEach(s => s.style.display = "none");

        if (el) {
            el.style.display = "block";
            el.style.animation = slide.animationIn;

            if (typeof slide.dynamicFunction === "function") {
                slide.dynamicFunction();
            }
        }

        currentSlideText.innerHTML = slide.title;
        currentSlideText.style.display = "block";
        currentSlideText.style.animation = `switchModules 0.5s ease-in-out`;

        slideNearEnd = setTimeout(() => {
            if (el) el.style.animation = slide.animationOut;
            currentSlideText.style.animation = `fadeModule 0.2s ease-in-out forwards`;
        }, slide.duration - 500);

        slideEnd = setTimeout(() => {
            currentSlideText.style.display = "none";
            currentSlideText.style.animation = "";

            if (!config.presentationConfig.repeatMain && slideIndex === activeSlides.length - 1) {
                slides.forEach(s => s.style.display = "none");
                call?.();
                return;
            }

            slideIndex++;
            showNextSlide();
        }, slide.duration);
    }

    showNextSlide();
}

function loopLocations() {

    function runNextLocation() {


        const location = locationConfig.locations[localeIndex];

        currentLocationText.style.display = `none`
        currentLocationText.style.animation = `switchModules 0.5s ease-in-out`
        if (location.name === "DUMMY LOCATION") {
            currentLocationText.innerHTML = "Please Standby..."
        } else {
            currentLocationText.innerHTML = location.name;
        }
        currentLocationText.style.display = `block`

        let nextLocation = locationConfig.locations[(localeIndex + 1) % locationConfig.locations.length];
        
        upNextLocationText.style.display = `none`
        upNextLocationText.style.animation = `switchModules 0.5s ease-in-out`
        upNextLocationText.innerHTML = `<span style="font-weight:200;font-size:22pt;">Next:</span> ${nextLocation.name}`;
        upNextLocationText.style.display = `block`

        runPlaylist(location.name, () => {
            localeIndex = (localeIndex + 1) % locationConfig.locations.length;
            runNextLocation();
        });

    }

    runNextLocation();
}

window.addEventListener('load', loopLocations)












































































function cancelSlideshow() {
    const wallpaper = document.getElementsByClassName('wallpaper')[0]
    const topbar = document.getElementsByClassName('topbar')[0]
    wallpaper.style.animation = `mainPresentationSlideOut 600ms ease-in-out 1 forwards`
    topbar.style.animation = `fadeModule 600ms ease-in-out 1 forwards`
    setTimeout(() => {
        wallpaper.style.display = `none`
        wallpaper.style.animation = ``
        topbar.style.display = `none`
        topbar.style.animation = ``
    }, 650);
}

function loadingScreen() {
    switch (config.loadingScreen) {
        case true:

                let time = 0

                const spinningLogo = document.getElementById('loadingscreen-spinny')

                const startxx = Math.random() * 1000;
                const startxy = Math.random() * 1000;
                const startyx = Math.random() * 1000;
                const startyy = Math.random() * 1000;
                const startzx = Math.random() * 1000;
                const startzy = Math.random() * 1000;
            
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

//startSlideshow()







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
        radarDiv.style.display = `block` // radar shit ignore

        setTimeout(() => {
            module1.style.display = 'none';
            module1.style.animation = '';
            module2.style.display = 'block';
            module2.style.animation = 'switchModules 0.5s ease-out';
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

function runRadarSlide() {
    radarDiv.style.animation = `fadeInTypeBeat 300ms ease forwards`
    setTimeout(() => {
        radarDiv.style.animation = `fadeModule 300ms ease`
    }, slideDurationMS + 100);
    radarDiv.style.display = `block`
}

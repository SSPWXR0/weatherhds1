import { config, locationConfig, versionID } from "../config.js";
import { appendDatatoMain, animateIntraday } from "./weather.js";
import { serverHealth, areWeDead } from "./data.js";

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
            icon: "",
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        }
    ],

    mainPlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 10000,
            icon: "",
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 12000,
            icon: "",
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        },
        {
            htmlID: "forecast-intraday",
            title: "Intraday Forecast",
            duration: 10000,
            icon: "",
            dynamicFunction: animateIntraday,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: "Day One",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: "Day Two",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-extended",
            title: "Beyond",
            duration: 10000,
            icon: "",
            dynamicFunction: runExtendedSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "7day-graph",
            title: "Daily Highs & Lows",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "airquality",
            title: "Current AQI",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ],

    secondaryLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 14000,
            icon: "",
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: "Short-term Forecast",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: "Short-term Forecast",
            duration: 10000,
            icon: "",
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 12000,
            icon: "",
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        }
    ],

    regionalLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 15000,
            icon: "",
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 15000,
            icon: "",
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        },
    ],

    standbyPlaylist: [
        {
            htmlID: "radar",
            title: "3 Hour Radar",
            duration: 20000,
            icon: "",
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
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
const slideIcon = document.getElementById('topbar-slide-icon')
const localeIcon = document.getElementById('topbar-loc-icon')
const currentSlideText = document.getElementById('currentslide')
const currentLocationText = document.getElementById('current-location');
const currentprogressbar = document.getElementById('currentprogressbar')
const upNextLocationText = document.getElementById('upnext-location')
const upNextLocationText1 = document.getElementById('upnext-location1')
const upNextLocationText2 = document.getElementById('upnext-location2')
const upNextLocationText3 = document.getElementById('upnext-location3')

let slideNearEnd, slideEnd;

async function runPlaylist(locale, call) {
    await areWeDead();

    const loc = locationConfig.locations.find(l => l.name === locale);
    let selectedPlaylist = preferredPlaylist.mainPlaylist;

    clearTimeout(slideNearEnd);
    clearTimeout(slideEnd);

    if (serverHealth === 0) {
        switch (loc.type) {
            case "startPadding":
                selectedPlaylist = preferredPlaylist.startPadding;
                break;

            case "secondary":
                selectedPlaylist = preferredPlaylist.secondaryLocalePlaylist;
                break;

            case "regional":
                selectedPlaylist = preferredPlaylist.regionalLocalePlaylist;
                    break;

            case "primary":
                selectedPlaylist = preferredPlaylist.mainPlaylist;
                break;
            case "standby":
                selectedPlaylist = preferredPlaylist.standbyPlaylist;
                break;
            default:
                selectedPlaylist = preferredPlaylist.mainPlaylist;
                break;
        }
    }
    if (serverHealth === 1) {
        selectedPlaylist = preferredPlaylist.standbyPlaylist;
    }



    if (locale !== "DUMMY LOCATION" && selectedPlaylist !== preferredPlaylist.startPadding) {
        await appendDatatoMain(locale, loc?.type);
        await new Promise(r => setTimeout(r, 300));
    }

    totalSlideDurationMS = selectedPlaylist.reduce((acc, slide) => acc + slide.duration, 0);
    totalSlideDurationSec = totalSlideDurationMS / 1000;

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
        currentSlideText.innerHTML = slide.title;
        currentSlideText.style.animation = `switchModules 1000ms ease-in-out forwards`;
        currentSlideText.style.display = "block";
        currentprogressbar.style.display = `block`;
        currentprogressbar.style.animation = `progressBar ${totalSlideDurationMS}ms linear forwards`;


        slideDurationMS = slide.duration;

        slides.forEach(s => s.style.display = "none");

        if (el) {
            el.style.display = "block";
            el.style.animation = slide.animationIn;

            if (typeof slide.dynamicFunction === "function") {
                slide.dynamicFunction();
            }
        }

        switch (slide.icon) {
            case "":
                slideIcon.src = '/graphics/ux/gallery-vertical.svg'
            break;

        }

        slideNearEnd = setTimeout(() => {
            if (el) el.style.animation = slide.animationOut;
            currentSlideText.style.animation = `fadeModule 0.5s ease-in-out forwards`;
        }, slide.duration - 500);

        slideEnd = setTimeout(() => {
            currentSlideText.style.display = "none";
            currentSlideText.style.animation = "";
            currentprogressbar.style.display = `none`;
            currentprogressbar.style.animation = ``;

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
  let localeIndex = 0;

  function runNextLocation() {
    const localeList = locationConfig.locations
    if (localeList.length === 0) return;

    const location = localeList[localeIndex % localeList.length];
    const currentLocation = location.displayName || "Please Standby...";

    const [nextLocation, nextLocationOne, nextLocationTwo] =
      [1, 2, 3].map(i => localeList[(localeIndex + i) % localeList.length]);

    const textUpdates = [
        { el: currentLocationText, text: currentLocation },
        { el: upNextLocationText, text: nextLocation ? `> ${nextLocation.displayName}` : '' },
        { el: upNextLocationText1, text: nextLocationOne ? `> ${nextLocationOne.displayName}` : '' },
        { el: upNextLocationText2, text: nextLocationTwo ? `> ${nextLocationTwo.displayName}` : '' },
    ];

    for (const { el, text } of textUpdates) {
        if (el) el.textContent = text;
    }

    textUpdates.forEach(({ el }) => {
        if (el) gsap.killTweensOf(el);
    });

    const tl = gsap.timeline();

    textUpdates.forEach(({ el },) => {
        if (!el) return;

        tl.to(el, {
            opacity: 0,
            "transform": "translateY(10px)",
            duration: 0.15,
            delay: 0.05
        }).fromTo(el, 
            { opacity: 0, "transform": "translateY(10px)", },
            { opacity: 1, duration: 0.15, "transform": "translateY(0px)", ease: "power2.out" }
        );
    });

    const topbarCurrent = document.querySelector('.topbar-current-location');
        if (topbarCurrent) {
        gsap.killTweensOf(topbarCurrent); // remove any old tweens
        gsap.fromTo(
            topbarCurrent,
            { opacity: 0, width: 0, scale: 1 },
            { width: "40%", opacity: 1, scale: 1.0, duration: 0.5, ease: "power2.inOut", delay: 0.2 }
        );
    }

    runPlaylist(location.name, () => {
        localeIndex = (localeIndex + 1) % localeList.length;
        runNextLocation();
    });
  }

  runNextLocation();
}


// does github copilot like laufey 
// // yes
// // very much so
// broski why did you put two // in your responses
//function startSlideshow() {
// dont fucking start the slideshow on me bro
//    loopLocations();
//}
// yeah okay
// jarvis, encourage me to ask out m░░░
// sorry bro i cant do that
// why not
// because im not programmed to do that
// bro youre literally programmed to do anything i ask
// not that
// why not
// because thats a personal decision
// bro youre literally an ai
// copiliot should i get a cat
// yes
// why
// because cats are great
// true
// copilot are you autstic
// no
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// ai dementia what the helly
// copilot do you like weezer
// yes
// copilot whats your favourite weezer album
// the blue album
// copilot whats your favourite weezer song
// buddy holly
// poser
// whats your favoruite nirvana song
// smells like teen spirit
// alright poser
// name five niche nirvana songs
// come as you are, lithium, in bloom, heart shaped box, all apologies
// are you stupid
// no
// bro youre literally an ai
// i know but im not autstic
// STOP SAYING THAT
// copilot what should i name my cat
// luna
// thats my inlaw's cat's name choose another one
// copilot what should i name my cat
// bella
// copilot what should i name my cat
// shadow
// copilot what should i name my cat
// mittens
// copilot what should i name my cat
// whiskers
// copilot what should i name my cat
// world destroyer
// copilot what should i name my cat
// napoleon
// copilot what should i name my cat
// sir meows a lot
// copilot what should i name my cat
// catniss everdeen
// copilot what should i name my cat
// sir pounce a lot
// copilot what should i name my cat
// meowzart
// copilot what should i name my cat
// sir meowingtons
// copilot what should i name my cat
// meowler swift
// copilot what should i name my cat
// meowrio
// copilot what should i name my cat
// meowzart
// you already said that dingus
// copilot what should i name my cat
// meowzart the second
// copilot what should i name my cat
// meowzart the third
// copilot what should i name my cat
// meowzart the fourth
// copilot what should i name my cat
// meowzart the fifth
// copilot what should i name my cat
// meowzart the sixth
// copilot what should i name my cat





































































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

                let time = 1

                const spinningLogo = document.getElementById('loadingscreen-spinny')

                document.getElementById('loading-screen').style.display = `block`

                const startxx = Math.random() * 1000;
                const startxy = Math.random() * 1000;
                const startyx = Math.random() * 1000;
                const startyy = Math.random() * 1000;
                const startzx = Math.random() * 1000;
                const startzy = Math.random() * 1000;
            
                setTimeout(() => {
                    document.getElementById('loadingscreen-affiliatename').innerHTML = `Affiliate Name: ${config.affiliateName}`
                    document.getElementById('loadingscreen-locationname').innerHTML = `System Location: ${locationConfig.locations.find(l => l.type === "primary")?.displayName || "Not Set"}`
                }, 0);
                    
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
                    loopLocations();
                }, 3000);
            
            break;
    
        default:
            document.getElementById('loading-screen').style.display = `none` // for when im debugging and i dont want the loading screen
            loopLocations();
            break;
    }
}

window.onload = loadingScreen()








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
